/**
* The "Cocoon.Touch" object holds some functions to handle the touch events in both surfaces ( Cocoon & WebView )
* @namespace Cocoon.Touch
*/
Cocoon.define("Cocoon.Touch" , function(extension){

    extension.addADivToDisableInput = function() {
        var div = document.createElement("div");
        div.id = "CocoonJSInputBlockingDiv";
        div.style.left = 0;
        div.style.top = 0;
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.position = "absolute";
        div.style.backgroundColor = 'transparent';
        div.style.border = "0px solid #000"; 
        div.style.zIndex = 999999999;
        document.body.appendChild(div);
    };

    extension.removeTheDivToEnableInput = function() {
        var div = document.getElementById("CocoonJSInputBlockingDiv");
        if (div) document.body.removeChild(div);
    };

    /**
     * Disables the touch events in the Cocoon environment.
     * @memberOf Cocoon.Touch
     * @function disable
     * @example
     * Cocoon.Touch.disable();
     */
    extension.disable = function () {
        if (Cocoon.nativeAvailable) {
            window.ext.IDTK_APP.makeCall("disableTouchLayer", "CocoonJSView");
        }
        else if (!navigator.isCocoonJS) {
            if (!Cocoon.App.EmulatedWebViewIFrame) {
                Cocoon.App.forwardEventsToCocoonJSEnabled = false;
                Cocoon.App.forwardAsync("Cocoon && Cocoon.Touch && Cocoon.Touch.disable();");
            }
        }
    };

    /**
     * Enables the touch events in the Cocoon environment.
     * @memberOf Cocoon.Touch
     * @function enable
     * @example
     * Cocoon.Touch.enable();
     */
    extension.enable = function () {
        if (Cocoon.nativeAvailable) {
            window.ext.IDTK_APP.makeCall("enableTouchLayer", "CocoonJSView");
        }
        else if (!navigator.isCocoonJS) {
            if (!Cocoon.App.EmulatedWebViewIFrame) {
                Cocoon.App.forwardEventsToCocoonJSEnabled = true;
                Cocoon.App.forwardAsync("Cocoon && Cocoon.Touch && Cocoon.Touch.enable();");
            }
        }
    };


    /**
     * Disables the touch events in the WebView environment.
     * @memberOf Cocoon.Touch
     * @function disableInWebView
     * @example
     * Cocoon.Touch.disableInWebView();
     */
    extension.disableInWebView = function () {
        if (Cocoon.nativeAvailable) {
            window.ext.IDTK_APP.makeCall("disableTouchLayer", "WebView");
        }
        else if (!navigator.isCocoonJS) {
            if (!Cocoon.App.EmulatedWebViewIFrame) {
                Cocoon.Touch.addADivToDisableInput();
            }
            else {
                Cocoon.App.forwardAsync("Cocoon && Cocoon.Touch && Cocoon.Touch.disableInWebView();");
            }
        }
    };

    /**
     * Enables the touch events in the WebView environment.
     * @memberOf Cocoon.Touch
     * @function enableInWebView
     * @example
     * Cocoon.Touch.enableInWebView();
     */
    extension.enableInWebView = function () {
        if (Cocoon.nativeAvailable) {
            window.ext.IDTK_APP.makeCall("enableTouchLayer", "WebView");
        }
        else if (!navigator.isCocoonJS) {
            if (!Cocoon.App.EmulatedWebViewIFrame) {
                Cocoon.Touch.removeTheDivToEnableInput();
            }
            else {
                Cocoon.Touch.forwardAsync("Cocoon && Cocoon.Touch && Cocoon.Touch.enableInWebView();");
            }
        }
    };
    
    return extension;

});