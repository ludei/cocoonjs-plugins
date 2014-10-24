Cocoon.define("Cocoon.App" , function(extension){

    function checkEmulatedWebViewReady() {
        var emulatedWB = Cocoon.App.EmulatedWebView;
        if (emulatedWB) {
            return; //ready
        }

        emulatedWB = document.createElement('div'); 
        emulatedWB.setAttribute('id', 'CocoonJS_App_ForCocoonJS_WebViewDiv'); 
        emulatedWB.style.width = 0; 
        emulatedWB.style.height = 0; 
        emulatedWB.style.position = "absolute"; 
        emulatedWB.style.left = 0; 
        emulatedWB.style.top = 0;
        emulatedWB.style.backgroundColor = 'transparent';
        emulatedWB.style.border = "0px solid #000"; 

        var frame = document.createElement("IFRAME");
        frame.setAttribute('id', 'CocoonJS_App_ForCocoonJS_WebViewIFrame');
        frame.setAttribute('name', 'CocoonJS_App_ForCocoonJS_WebViewIFrame');
        frame.style.width = 0; 
        frame.style.height = 0; 
        frame.frameBorder = 0;
        frame.allowtransparency = true;

        emulatedWB.appendChild(frame);
        Cocoon.App.EmulatedWebView = emulatedWB;
        Cocoon.App.EmulatedWebViewIFrame = frame;

        if(!document.body) {
            document.body = document.createElement("body");
        }
        document.body.appendChild(Cocoon.App.EmulatedWebView);
    }

    /**
     * Pauses the Cocoon JavaScript execution loop.
     * The callback function does not receive any parameter.
     * @function pause
     * @memberOf Cocoon.App
     * @example
     * Cocoon.App.pause();
     */
    extension.pause = function()
    {
        if (Cocoon.App.nativeAvailable)
        {
            return Cocoon.callNative("IDTK_APP", "pause", arguments);
        }
    };
    /**
     * Resumes the Cocoon JavaScript execution loop.
     * @function resume
     * @memberOf Cocoon.App
     * @example
     * Cocoon.App.resume();
     */

    extension.resume = function()
    {
        if (Cocoon.App.nativeAvailable)
        {
            return Cocoon.callNative("IDTK_APP", "resume", arguments);
        }
    };

    /**
    * Loads a resource in the WebView environment from the Cocoon environment.
    * @function loadInTheWebView
    * @memberOf Cocoon.App
    * @param {string} path The path to the resource. It can be a remote URL or a path to a local file.
    * @param {Cocoon.App.StorageType} [storageType] An optional parameter to specify at which storage in the device the file path is stored. By default, APP_STORAGE is used.
    * @example
    * Cocoon.App.WebView.on("load", {
    *   success : function(){
    *     Cocoon.App.showTheWebView();
    *   },
    *   error : function(){
    *     console.log("Cannot show the Webview for some reason :/");
    *     console.log(JSON.stringify(arguments));
    *   }
    * });
    * Cocoon.App.loadInTheWebView("wv.html");
    */
    extension.loadInTheWebView = function(path, storageType)
    {
        if (navigator.isCocoonJS && Cocoon.App.nativeAvailable)
        {
            Cocoon.callNative("IDTK_APP", "loadInTheWebView", arguments)
        }
        else
        {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function(event) {
                if (xhr.readyState === 4)
                {
                    if ((xhr.status >= 200 && xhr.status <=299) || xhr.status === 0)
                    {

                        checkEmulatedWebViewReady();
                        var callback= function(event){
                            Cocoon.App.onLoadInTheWebViewSucceed.notifyEventListeners(path);
                            Cocoon.App.EmulatedWebViewIFrame.removeEventListener("load", callback);
                        };

                        Cocoon.App.EmulatedWebViewIFrame.addEventListener(
                            "load", 
                            callback
                        );
                        Cocoon.App.EmulatedWebViewIFrame.contentWindow.location.href= path;
                    }
                    else
                    {
                        this.onreadystatechange = null;
                        Cocoon.App.onLoadInTheWebViewFailed.notifyEventListeners(path);
                    }
                }
            };
            xhr.open("GET", path, true);
            xhr.send();
        }
    };

    /**
     * Reloads the last loaded path in the WebView context.
     * @function reloadWebView
     * @memberOf Cocoon.App
     * @example
     * Cocoon.App.reloadWebView();
     */
    extension.reloadWebView = function()
    {
        if (Cocoon.App.nativeAvailable && navigator.isCocoonJS)
        {
            Cocoon.callNative("IDTK_APP", "reloadWebView", arguments);
        }
        else
        {
            checkEmulatedWebViewReady();
            Cocoon.App.EmulatedWebViewIFrame.contentWindow.location.reload();
        }
    };

    /**
    * Shows the webview.
    * @function showTheWebView
    * @memberOf Cocoon.App
    * @param {number}  x The top lef x coordinate of the rectangle where the webview will be shown.
    * @param {number}  y The top lef y coordinate of the rectangle where the webview will be shown.
    * @param {number}  width The width of the rectangle where the webview will be shown.
    * @param {number}  height The height of the rectangle where the webview will be shown.
    * @example
    * Cocoon.App.showTheWebView(0 , 0 , window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    */
    extension.showTheWebView = function(x, y, width, height)
    {
        if (Cocoon.App.nativeAvailable && navigator.isCocoonJS)
        {
            Cocoon.callNative("IDTK_APP", "showTheWebView", arguments)
        }
        else
        {
            checkEmulatedWebViewReady();
            Cocoon.App.EmulatedWebViewIFrame.style.width = (width ? width/window.devicePixelRatio : window.innerWidth)+'px';
            Cocoon.App.EmulatedWebViewIFrame.style.height = (height ? height/window.devicePixelRatio : window.innerHeight)+'px';
            Cocoon.App.EmulatedWebView.style.left = (x ? x : 0)+'px';
            Cocoon.App.EmulatedWebView.style.top = (y ? y : 0)+'px';
            Cocoon.App.EmulatedWebView.style.width = (width ? width/window.devicePixelRatio : window.innerWidth)+'px';
            Cocoon.App.EmulatedWebView.style.height = (height ? height/window.devicePixelRatio : window.innerHeight)+'px';
            Cocoon.App.EmulatedWebView.style.display = "block";

        }
    };

    /**
    * Hides the webview.
    * @function hideTheWebView
    * @memberOf Cocoon.App
    * @example
    * Cocoon.App.hideTheWebView();
    */
    extension.hideTheWebView = function() {
        if (Cocoon.App.nativeAvailable && navigator.isCocoonJS) {
            var javaScriptCodeToForward = "ext.IDTK_APP.makeCall('hide');";
            return Cocoon.App.forwardAsync(javaScriptCodeToForward);
        }
        else {
            checkEmulatedWebViewReady();
            Cocoon.App.EmulatedWebView.style.display = "none";
        }
    };

    /**
    * Sets a callback function that will be called whenever the system tries to finish the app.
    * The developer can specify how the system will react to the finish of the app by returning a
    * boolean value in the callback function: true means, close the app, false means that the developer
    * will handle the app close.
    * A common example of this is the back button in Android devices. When the back button is pressed, this
    * callback will be called and the system will react depending on the developers choice finishing, or not,
    * the application.
    * @function exitCallback
    * @memberOf Cocoon.App
    * @param {function} callback A function object that will be called when the system
    * determines that the app should be finished. This function must return a true or a false value
    * depending on what the developer wants: true === finish the app, false === do not close the app.
    * @example
    * Cocoon.App.exitCallback(function(){
    *   if(true){
    *       return true; // Finish the app
    *   }else{
    *       return false; // Do not close the app
    *   }  
    * });
    */
    extension.exitCallback = function(appShouldFinishCallback)
    {
        if (navigator.isCocoonJS && Cocoon.App.nativeAvailable)
        {
            window.onidtkappfinish = appShouldFinishCallback;
        }
    }

    /**
    * @private
    * @function forwardedEventFromTheWebView
    * @memberOf Cocoon.App
    */
    extension.forwardedEventFromTheWebView = function(eventName, eventDataString) {
        var eventData = JSON.parse(eventDataString);
        eventData.target = window;
        var event = new Event(eventName);
        for (var att in eventData) {
            event[att] = eventData[att];
        }
        event.target = window;
        window.dispatchEvent(event);
        var canvases = document.getElementsByTagName("canvas");
        for (var i = 0; i < canvases.length; i++) {
            event.target = canvases[i];
            canvases[i].dispatchEvent(event);
        }
    }

    extension.onLoadInTheWebViewSucceed = new Cocoon.EventHandler("IDTK_APP", "App", "forwardpageload");

    extension.onLoadInTheWebViewFailed = new Cocoon.EventHandler("IDTK_APP", "App", "forwardpagefail");

    var signal = new Cocoon.Signal.createSignal();

    signal.register("load", {
        success : extension.onLoadInTheWebViewSucceed,
        error : extension.onLoadInTheWebViewFailed
    });
    
    extension.WebView = Cocoon.WebView || {};
    extension.WebView.on = signal.expose();

    return extension;
});