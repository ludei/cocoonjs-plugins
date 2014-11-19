/**
 * This namespace represents different methods to control your application.
 *
 * <div class="alert alert-success">
 * <p>Here you will find demos about this namespace: </p> 
 * <ul> <li> <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Rate">Rate demo</a>.</li>
 * <li> <a href="https://github.com/ludei/cocoonjs-demos/tree/Sound">Sound demo</a>.</li>
 * <li> <a href="https://github.com/ludei/cocoonjs-demos/tree/Vibration">Vibration demo</a>.</li>
 * <li> <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Basic%20examples">Basic examples demo</a>.</li></ul>
 * </div>
 *
 * @namespace Cocoon.App
 * @example
 * // Example 1: Closes the application
 * Cocoon.App.exit();
 * // Example 2: Opens a given URL
 * Cocoon.App.openURL("http://www.ludei.com");
 * // Example 3: Fired when the application is suspended
 * Cocoon.App.on("suspended", function(){
 *  ...
 * });
 */
Cocoon.define("Cocoon.App" , function(extension){
    
    extension.nativeAvailable = (!!window.ext) && (!!window.ext.IDTK_APP);

    extension.isBridgeAvailable = function(){
        if (Cocoon.App.forward.nativeAvailable === 'boolean') {
            return Cocoon.App.forward.nativeAvailable;
        }
        else {
            var available = Cocoon.callNative("IDTK_APP", "forwardAvailable", arguments);
            available = !!available;
            Cocoon.App.forward.nativeAvailable = available;
            return available;
        }
    };

    /**
     * Makes a forward call of some javascript code to be executed in a different environment (i.e. from CocoonJS to the WebView and viceversa).
     * It waits until the code is executed and the result of it is returned === synchronous.
     * @function forward
     * @memberof Cocoon.App
     * @param {string} code Some JavaScript code in a string to be forwarded and executed in a different JavaScript environment (i.e. from CocoonJS to the WebView and viceversa).
     * @return {string} The result of the execution of the passed JavaScript code in the different JavaScript environment.
     * @example
     * Cocoon.App.forward("alert('Ludei!');");
     */
    extension.forward = function (javaScriptCode) {
        if (Cocoon.App.nativeAvailable && Cocoon.App.isBridgeAvailable()) {
            return Cocoon.callNative("IDTK_APP", "forward", arguments);
        }
        else if (!navigator.isCocoonJS) {
            if (window.name == 'CocoonJS_App_ForCocoonJS_WebViewIFrame') {
                return window.parent.eval(javaScriptCode);
            }
            else {
                return window.frames['CocoonJS_App_ForCocoonJS_WebViewIFrame'].window.eval(javaScriptCode);
            }
        }
    };

    /**
     * Makes a forward call of some javascript code to be executed in a different environment (i.e. from CocoonJS to the WebView and viceversa).
     * It is asyncrhonous so it does not wait until the code is executed and the result of it is returned. Instead, it calls a callback function when the execution has finished to pass the result.
     * @function forwardAsync
     * @memberof Cocoon.App
     * @param {string} javaScriptCode Some JavaScript code in a string to be forwarded and executed in a different JavaScript environment (i.e. from CocoonJS to the WebView and viceversa).
     * @param {function} [callback] A function callback (optional) that will be called when the passed JavaScript code is executed in a different thread to pass the result of the execution in the different JavaScript environment.
     * @example
     * Cocoon.App.forwardAsync("alert('Ludei!');", function(){
     * ...
     * });
     */
    extension.forwardAsync = function (javaScriptCode, returnCallback) {
        if (Cocoon.App.nativeAvailable && Cocoon.App.isBridgeAvailable()) {
            if (typeof returnCallback !== 'undefined') {
                return ext.IDTK_APP.makeCallAsync("forward", javaScriptCode, returnCallback);
            }
            else {
                return ext.IDTK_APP.makeCallAsync("forward", javaScriptCode);
            }
        }
        else {
            setTimeout(function() {
                var res;
                window.name == 'CocoonJS_App_ForCocoonJS_WebViewIFrame' ? 
                    (res = window.parent.eval(javaScriptCode), (typeof returnCallback === 'function') && returnCallback(res) ) :
                    (
                        res = window.parent.frames['CocoonJS_App_ForCocoonJS_WebViewIFrame'].window.eval(javaScriptCode), 
                        (typeof returnCallback === 'function') && returnCallback(res)
                    );
            }, 1);
        }
    };

    /**
     * Allows to load a new JavaScript/HTML5 resource that can be loaded either locally (inside the platform/device storage) or using a remote URL.
     * @function load
     * @memberof Cocoon.App
     * @param {string} path A path to a resource stored in the platform or in a URL to a remote resource.
     * @param {Cocoon.App.StorageType} [storageType] If the path argument represents a locally stored resource, the developer can specify the storage where it is stored. If no value is passes, the {@link Cocoon.App.StorageType.APP_STORAGE} value is used by default.
     * @example
     * Cocoon.App.load("index.html");
     */
    extension.load = function (path, storageType) {
        if (Cocoon.App.nativeAvailable) {
            return Cocoon.callNative("IDTK_APP", "loadPath", arguments);
        }
        else if (!navigator.isCocoonJS) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (event) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var jsCode;
                        // If there is no webview, it means we are in the webview, so notify the CocoonJS environment
                        if (!Cocoon.App.EmulatedWebViewIFrame) {
                            jsCode = "window.Cocoon && window.Cocoon.App.onLoadInTheWebViewSucceed.notifyEventListeners('" + path + "');";
                        }
                        // If there is a webview, it means we are in CocoonJS, so notify the webview environment
                        else {
                            jsCode = "window.Cocoon && window.Cocoon.App.onLoadInCocoonJSSucceed.notifyEventListeners('" + path + "');";
                        }
                        Cocoon.App.forwardAsync(jsCode);
                        window.location.href = path;
                    }
                    else if (xhr.status === 404) {
                        this.onreadystatechange = null;
                        var jsCode;
                        // If there is no webview, it means we are in the webview, so notify the CocoonJS environment
                        if (!Cocoon.App.EmulatedWebViewIFrame) {
                            jsCode = "Cocoon && Cocoon.App.onLoadInTheWebViewFailed.notifyEventListeners('" + path + "');";
                        }
                        // If there is a webview, it means we are in CocoonJS, so notify the webview environment
                        else {
                            jsCode = "Cocoon && Cocoon.App.onLoadInCocoonJSFailed.notifyEventListeners('" + path + "');";
                        }
                        Cocoon.App.forwardAsync(jsCode);
                    }
                }
            };
            xhr.open("GET", path, true);
            xhr.send();
        }
    };

    /**
     * Reloads the last loaded path in the current context.
     * @function reload
     * @memberof Cocoon.App
     * @example
     * Cocoon.App.reload();
     */
    extension.reload = function () {
        if (Cocoon.App.nativeAvailable) {
            return Cocoon.callNative("IDTK_APP", "reload", arguments);
        }
        else if (!navigator.isCocoonJS) {
            if (window.name == 'CocoonJS_App_ForCocoonJS_WebViewIFrame') {
                return window.parent.location.reload();
            }
            else {
                return window.parent.frames['CocoonJS_App_ForCocoonJS_WebViewIFrame'].window.location.reload();
            }
        }
    };

    /**
     * Opens a given URL using a system service that is able to open it. For example, open a HTTP URL using the system WebBrowser.
     * @function openURL
     * @memberof Cocoon.App
     * @param {string} url The URL to be opened by a system service.
     * @example
     * Cocoon.App.openURL("http://www.ludei.com");
     */
    extension.openURL = function (url) {
        if (Cocoon.App.nativeAvailable) {
            return Cocoon.callNative("IDTK_APP", "openURL", arguments, true);
        }
        else if (!navigator.isCocoonJS) {
            window.open(url, '_blank');
        }
    }

    /**
     * Forces the app to finish.
     * @function exit
     * @memberof Cocoon.App
     * @example
     * Cocoon.App.exit();
     */
    extension.exit = function () {
        if (Cocoon.App.nativeAvailable) {
            return Cocoon.callNative("IDTK_APP", "forceToFinish", arguments);
        }
        else if (!navigator.isCocoonJS) {
            window.close();
        }
    }

    /**
     * 
     * @memberof Cocoon.App
     * @name Cocoon.App.StorageType
     * @property {string} Cocoon.App.StorageType - The base object
     * @property {string} Cocoon.App.StorageType.APP_STORAGE The application storage
     * @property {string} Cocoon.App.StorageType.INTERNAL_STORAGE Internal Storage
     * @property {string} Cocoon.App.StorageType.EXTERNAL_STORAGE External Storage
     * @property {string} Cocoon.App.StorageType.TEMPORARY_STORAGE Temporary Storage
     */
    extension.StorageType = {
        APP_STORAGE:        "APP_STORAGE",
        INTERNAL_STORAGE:   "INTERNAL_STORAGE",
        EXTERNAL_STORAGE:   "EXTERNAL_STORAGE",
        TEMPORARY_STORAGE:  "TEMPORARY_STORAGE"
    };

    extension.onSuspended = new Cocoon.EventHandler("IDTK_APP", "App", "onsuspended");

    extension.onActivated = new Cocoon.EventHandler("IDTK_APP", "App", "onactivated");

    extension.onSuspending = new Cocoon.EventHandler("IDTK_APP", "App", "onsuspending");

    extension.onMemoryWarning = new Cocoon.EventHandler("IDTK_APP", "App", "onmemorywarning");

    var signal = new Cocoon.Signal.createSignal();

    /**
     * Allows to listen to events called when the application is suspended.
     * The callback function does not receive any parameter.
     * @event On application suspended
     * @memberof Cocoon.App
     * @example
     * Cocoon.App.on("suspended", function(){
     *  ...
     * });
     */
    signal.register("suspended", extension.onSuspended);
    /**
     * Allows to listen to events called when the application is activated.
     * The callback function does not receive any parameter.
     * @event On application activated
     * @memberof Cocoon.App
     * @example
     * Cocoon.App.on("activated", function(){
     *  ...
     * });
     */
    signal.register("activated", extension.onActivated);

    /**
     * Allows to listen to events called when the application is suspending.
     * The callback function does not receive any parameter.
     * @event On application suspending
     * @memberof Cocoon.App
     * @example
     * Cocoon.App.on("suspending", function(){
     *  ...
     * });
     */
    signal.register("suspending", extension.onSuspending);

    /**
     * Allows to listen to memory warning notifications from the system
     * It is strongly recommended that you implement this method and free up as much memory as possible by disposing of cached data objects, images on canvases that can be recreated.
     * @event On memory warning
     * @memberof Cocoon.App
     * @example
     * Cocoon.App.on("memorywarning", function(){
     *  ...
     * });
     */
     signal.register("memorywarning", extension.onMemoryWarning);


    extension.on = signal.expose();
    
    return extension;
});