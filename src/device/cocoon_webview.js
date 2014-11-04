/**
* This namespace represents all functionalities available in the WebView environment.
*
* <div class="alert alert-success">
*   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/Webview">Webview demo</a>.
*</div>
*
* @namespace Cocoon.WebView
* @example
* Cocoon.WebView.on("load",{
*   success : function(){
*       Cocoon.App.showTheWebView();
*   },
*   error : function(){
*        console.log("Cannot show the Webview for some reason :/");
*   }
* });
* Cocoon.App.loadInTheWebView("WV.html");
*/

Cocoon.define("Cocoon.WebView" , function(extension){

    if (typeof Cocoon === 'undefined' || Cocoon === null) return extension;
    if (typeof Cocoon.App === 'undefined' || Cocoon.App  === null) return extension;
    if (navigator.isCocoonJS) return extension;

    /**
    * Shows a transparent WebView on top of the Cocoon hardware accelerated environment rendering context.
    * @function show
    * @memberof Cocoon.WebView
    * @param {number} [x] The horizontal position where to show the WebView.
    * @param {number} [y] The vertical position where to show the WebView.
    * @param {number} [width] The horitonzal size of the WebView.
    * @param {number} [height] the vertical size of the WebView.
    */
    extension.show = function(x, y, width, height)
    {
        if (Cocoon.App.nativeAvailable)
        {
           return Cocoon.callNative("IDTK_APP", "show", arguments);
        }
        else
        {
            var div = window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewDiv');
            div.style.left = (x ? x : div.style.left)+'px';
            div.style.top = (y ? y : div.style.top)+'px';
            div.style.width = (width ? width/window.devicePixelRatio : window.parent.innerWidth)+'px';
            div.style.height = (height ? height/window.devicePixelRatio : window.parent.innerHeight)+'px';
            div.style.display = "block";
            var iframe = window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewIFrame');
            iframe.style.width = (width ? width/window.devicePixelRatio : window.parent.innerWidth)+'px';
            iframe.style.height = (height ? height/window.devicePixelRatio : window.parent.innerHeight)+'px';
        }
    };

    /**
    * Hides the transparent WebView on top of the Cocoon hardware acceleration environment rendering contect.
    * @function hide
    * @memberof Cocoon.WebView
    */
    extension.hide = function()
    {
        if (Cocoon.App.nativeAvailable)
        {
           return Cocoon.callNative("IDTK_APP", "hide", arguments);
        }
        else
        {
            window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewDiv').style.display = "none";
        }
    };

    /**
    * Loads a resource in the Cocoon environment from the WebView environment. 
    * @function loadInCocoon
    * @memberof Cocoon.WebView
    * @param {string} path The path to the resource. It can be a remote URL or a path to a local file.
    * @param {callbacks} cb - An object containing two callbacks, { success : callback, error: callback }.
    * @param {Cocoon.App.StorageType} [storageType] An optional parameter to specify at which storage in the device the file path is stored. By default, APP_STORAGE is used.
    * <br/> success: This callback function allows listening to events called when the Cocoon load has completed successfully.
    * <br/> error: This callback function allows listening to events called when the Cocoon load fails.
    * @example
    * Cocoon.WebView.loadInCocoon("index.html", {
    *   success : function(){ ... },
    *   error : function(){ ... }
    * });
    */
    extension.loadInCocoon = function(path, callbacks, storageType)
    {
        if (Cocoon.App.nativeAvailable)
        {
            var javaScriptCodeToForward = "ext.IDTK_APP.makeCall('loadPath'";
            if (typeof path !== 'undefined')
            {
                javaScriptCodeToForward += ", '" + path + "'";
                if (typeof storageType !== 'undefined')
                {
                    javaScriptCodeToForward += ", '" + storageType + "'";
                }
            }
            javaScriptCodeToForward += ");";

            return Cocoon.App.forwardAsync(javaScriptCodeToForward);
        }
        else
        {
            Cocoon.App.forwardAsync("Cocoon.App.load('" + path + "');");
        }
    };

    extension.reloadCocoonJS = function()
    {
        if (Cocoon.App.nativeAvailable)
        {
            return Cocoon.App.forwardAsync("ext.IDTK_APP.makeCall('reload');");
        }
        else if (!navigator.isCocoonJS)
        {
            window.parent.location.reload();
        }
    };


    window.addEventListener("load", function()
    {
        

        // Only if we are completely outside CocoonJS (or CocoonJS' webview),
        // setup event forwarding from the webview (iframe) to Cocoon.
        if (!Cocoon.App.nativeAvailable && window.name == 'CocoonJS_App_ForCocoonJS_WebViewIFrame') {
            Cocoon.App.forwardEventsToCocoonJSEnabled = false;
            var EVENT_ATTRIBUTES = [ 'timeStamp', 'button', 'type', 'x', 'y', 'pageX', 'pageY', 'clientX', 'clientY', 'offsetX', 'offsetY'];
            var EVENTS = [ "dblclick", "touchmove", "mousemove", "touchend", "touchcancel", "mouseup", "touchstart", "mousedown", "release", "dragleft", "dragright", "swipeleft", "swiperight" ];
            function forwardEventToCocoonJS(eventName, event) {
                var eventData = {};
                var att, i;
                for (var att in event) {
                    i = EVENT_ATTRIBUTES.indexOf(att);
                    if (i >= 0) {
                        eventData[att] = event[att];
                    }
                }
                var jsCode = "Cocoon && Cocoon.App && Cocoon.App.forwardedEventFromTheWebView && Cocoon.App.forwardedEventFromTheWebView(" + JSON.stringify(eventName) + ", '" + JSON.stringify(eventData) + "');";
                Cocoon.App.forward(jsCode);
            }
            for (i = 0; i < EVENTS.length; i++) {
                window.addEventListener(EVENTS[i], (function(eventName) {
                    return function(event) {
                        if (Cocoon.App.forwardEventsToCocoonJSEnabled) {
                            forwardEventToCocoonJS(eventName, event);
                        }
                    };
                })(EVENTS[i]));
            }
        }

    });

    extension.onLoadInCocoonJSSucceed = new Cocoon.EventHandler("IDTK_APP", "App", "forwardpageload");

    extension.onLoadInCocoonJSFailed = new Cocoon.EventHandler("IDTK_APP", "App", "forwardpagefail");

    return extension;
});