/** 
* This namespace holds the WebDialog widget, which essentially shows a Webview on top of the CocoonJS layer.
* @namespace Cocoon.Widget
*/
Cocoon.define("Cocoon.Widget" , function(extension){
    "use strict";
    /**
    * Creates the WebDialog
    * @constructor WebDialog
    * @memberOf Cocoon.Widget
    * @example var dialog = new Cocoon.Widget.WebDialog();
    */
    extension.WebDialog = function() {
        
        if (Cocoon.App.nativeAvailable) {
            this.webDialogID = window.ext.IDTK_APP.makeCall("createWebDialog");
        }
        else {
            var iframe = document.createElement("iframe");
            iframe.id = "CocoonJSWebDialogIFrame";
            iframe.name = "CocoonJSWebDialogIFrame";
            iframe.style.cssText = "position:fixed;left:0;top:0;bottom:0;right:0; width:100%; height:100%;margin:0;padding:0;";
            var me = this;
            iframe.onload = function(){
                me.iframeloaded = true;
                var js = "Cocoon = {}; Cocoon.Widget = {}; Cocoon.Widget.WebDialog = {}; Cocoon.Widget.WebDialog.close = function()" +
                    "{" +
                    "   window.parent.CocoonJSCloseWebDialog();" +
                    "};";
                me.evalIframe(js);
                for (var i = 0; i < me.pendingEvals.length; ++i) {
                    me.evalIframe(me.pendingEvals[i]);
                }
                me.pendingEvals = [];
            }
            iframe.onerror = function(){
                me.close();
            }
            this.iframe = iframe;
            this.pendingEvals = [];

            window.CocoonJSCloseWebDialog = function() {
               me.close();
            }
        }

    }

    extension.WebDialog.prototype = {
        /**
        * Shows the dialog.
        * @function show
        * @memberOf Cocoon.Widget.WebDialog
        * @param {string} url The url to be opened on the Web Dialog.
        * @param {function} closeCallback The callback that will be fired when the dialog is closed.
        * @example 
        * var dialog = new Cocoon.Widget.WebDialog();
        * dialog.show("http://www.ludei.com", function(){
        *   console.log("The dialog has been closed!");
        * });
        */
        show: function(url, callback) {
            this.closeCallback = function() {
                Cocoon.Touch.enable();
                if (callback)
                    callback();
            }
            if (Cocoon.App.nativeAvailable) {
                Cocoon.Touch.disable();
                return window.ext.IDTK_APP.makeCallAsync("showWebDialog", this.webDialogID, url, this.closeCallback);
            }
            else {
                this.iframe.src = url;
                document.body.appendChild(this.iframe);
            }

        },
        
        /**
        * Closes the dialog.
        * @function close
        * @memberOf Cocoon.Widget.WebDialog
        * @example 
        * var dialog = new Cocoon.Widget.WebDialog();
        * dialog.show("http://www.ludei.com");
        * //This dialog will close after 15 seconds.
        * setTimeout(function(){
        *   dialog.close();
        * }, 15000);
        */
        close: function() {
            if (Cocoon.App.nativeAvailable) {
                return window.ext.IDTK_APP.makeCallAsync("closeWebDialog", this.webDialogID);
            }
            else {
                if (this.iframe.parentNode) {
                    this.iframe.parentNode.removeChild(this.iframe);
                }
            }
            if (this.closeCallback)
                this.closeCallback();
        },
        evalIframe: function(js) {
            window.frames["CocoonJSWebDialogIFrame"].eval(js);
        },

        /**
        * Evaluates a javascript string in the WebDialog environment.
        * @function eval
        * @memberOf Cocoon.Widget.WebDialog
        * @example 
        * var dialog = new Cocoon.Widget.WebDialog();
        * dialog.eval("alert('Michael Jackson is the king of pop')");
        */
        eval: function(js) {
            if (Cocoon.App.nativeAvailable) {
                return window.ext.IDTK_APP.makeCallAsync("evalWebDialog", this.webDialogID, js);
            }
            else {
                if (this.iframeloaded)
                    this.evalIframe(js);
                else
                    this.pendingEvals.push(js);
            }
        }

    };

    return extension;

});