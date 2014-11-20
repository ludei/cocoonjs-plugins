/**
 * @fileOverview
 * Ludei's plugins are multiplatform Javascript APIs, that work in any of the three environments 
 * of CocoonJS: accelerated Canvas+, webview+ and system webview.
 * - Select the specific plugin below to open the relevant documentation section.
 <ul>
    <li><a href="Cocoon.html">Cocoon</a></li>
    <li><a href="Cocoon.Ad.html">Ad</a></li>
    <li><a href="Cocoon.App.html">App</a></li>
    <li><a href="Cocoon.Camera.html">Camera</a></li>
    <li><a href="Cocoon.Device.html">Device</a></li>
    <li><a href="Cocoon.Dialog.html">Dialog</a></li>
    <li><a href="Cocoon.Motion.html">Motion</a></li>
    <li><a href="Cocoon.Multiplayer.html">Multiplayer</a></li>
    <li><a href="Cocoon.Notification.html">Notification</a></li>
    <li><a href="Cocoon.Proxify.html">Proxify</a></li>
    <li><a href="Cocoon.Social.html">Social</a></li>
    <li><a href="Cocoon.Store.html">Store</a></li>
    <li><a href="Cocoon.Touch.html">Touch</a></li>
    <li><a href="Cocoon.Utils.html">Utils</a></li>
    <li><a href="Cocoon.WebView.html">WebView</a></li>
    <li><a href="Cocoon.Widget.html">Widget</a></li>
</ul>
 <br/>The CocoonJS Plugin's library (cocoon.js and cocoon.min.js) can be found at Github. <br/>
 <a href="https://github.com/ludei/CocoonJS-Plugins"><img src="img/download.png" style="width:230px;height:51px;" /></a>
 <br/><br/>In addition to all the previously mentioned, in the following link you'll find an <a href="http://support.ludei.com/hc/en-us/articles/201821276-Extensions-overview">overview of all the avaliable features</a> in which each plugin support and availability are detailed.
 <br/><br/>
 * We hope you find everything you need to get going here, but if you stumble on any problems with the docs or the plugins, 
 * just drop us a line at our forum (support.ludei.com) and we'll do our best to help you out.
 * <h3>Tools</h3>
 <a href="http://support.ludei.com/hc/communities/public/topics"><img src="img/cocoon-tools-1.png" /></a>
 <a href="http://support.ludei.com/hc"><img src="img/cocoon-tools-2.png" /></a>
 <a href="https://cloud.ludei.com/"><img src="img/cocoon-tools-3.png" /></a>
 <a href="https://www.ludei.com/cocoonjs/how-to-use/"><img src="img/cocoon-tools-4.png" /></a>
 * @version 3.0.5
 */
(function () {
    
    /**
    * The "Cocoon" object holds all the CocoonJS Extensions and other stuff needed for the CocoonJS environment.
    * @namespace Cocoon
    */
    Cocoon = window.Cocoon ? window.Cocoon : {};
    
    /**
     * @property {string} version Current version of the CocoonJS Extensions.
     * @memberOf Cocoon
     * @example
     * console.log(Cocoon.version);
     */
    Cocoon.version = "3.0.5";
    
    /**
     * Is the native environment available? true if so.
     * @property {bool} version
     * @memberof Cocoon
     * @private
     * @example
     * if(Cocoon.nativeAvailable) { ... do native stuff here ... }
     */

    Cocoon.nativeAvailable = (!!window.ext);

    /**
    * This utility function allows to create an object oriented like hierarchy between two functions using their prototypes.
    * This function adds a "superclass" and a "__super" attributes to the subclass and it's functions to reference the super class.
    * @memberof Cocoon
    * @private
    * @static
    * @param {function} subc The subclass function.
    * @param {function} superc The superclass function.
    */
    Cocoon.extend = function(subc, superc) {
        var subcp = subc.prototype;

        var CocoonJSExtendHierarchyChainClass = function() {};
        CocoonJSExtendHierarchyChainClass.prototype = superc.prototype;

        subc.prototype = new CocoonJSExtendHierarchyChainClass();
        subc.superclass = superc.prototype;
        subc.prototype.constructor = subc;

        if (superc.prototype.constructor === Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }

        for (var method in subcp) {
            if (subcp.hasOwnProperty(method)) {
                subc.prototype[method] = subcp[method];
            }
        }
    }

    /**
    * This utility function copies the properties from one object to a new object array, the result object array can be used as arguments when calling Cocoon.callNative()
    * @memberof Cocoon
    * @static
    * @private
    * @param {function} obj The base object that contains all properties defined.
    * @param {function} copy The object that user has defined.
    */
    Cocoon.clone = function(obj,copy){
        if (null == obj || "object" != typeof obj) return obj;
        var arr = [];
        for (var attr in obj) {
            if ( copy.hasOwnProperty(attr) ) { 
                arr.push(copy[attr]);
            }else{
                arr.push(obj[attr]);
            }
        }
        return arr;
    }

    /**
    * IMPORTANT: This function should only be used by Ludei.
    * This function allows a call to the native extension object function reusing the same arguments object.
    * Why is interesting to use this function instead of calling the native object's function directly?
    * As the Cocoon object functions expicitly receive parameters, if they are not present and the native call is direcly mapped,
    * undefined arguments are passed to the native side. Some native functions do not check the parameters validation
    * correctly (just check the number of parameters passed).
    * Another solution instead of using this function call is to correctly check if the parameters are valid (not undefined) to make the
    * call, but it takes more work than using this approach.
    * @static
    * @private
    * @param {string} nativeExtensionObjectName The name of the native extension object name. The object that is a member of the 'ext' object.
    * @param {string} nativeFunctionName The name of the function to be called inside the native extension object.
    * @param {object} arguments The arguments object of the Cocoon extension object function. It contains all the arguments passed to the Cocoon extension object function and these are the ones that will be passed to the native call too.
    * @param {boolean} [async] A flag to indicate if the makeCall (false or undefined) or the makeCallAsync function should be used to perform the native call.
    * @returns Whatever the native function call returns.
    */
    Cocoon.callNative = function(nativeExtensionObjectName, nativeFunctionName, args, async) {
        if (Cocoon.nativeAvailable) {
            var argumentsArray = Array.prototype.slice.call(args);
            argumentsArray.unshift(nativeFunctionName);
            var nativeExtensionObject = ext[nativeExtensionObjectName];
            var makeCallFunction = async ? nativeExtensionObject.makeCallAsync : nativeExtensionObject.makeCall;
            var ret = makeCallFunction.apply(nativeExtensionObject, argumentsArray);
            var finalRet = ret;
            if (typeof ret === "string") {
                try {
                    finalRet = JSON.parse(ret);
                }
                catch(error) {
                    console.log(error);
                }
            }
            return finalRet;
        }
    };

    /**
    * Returns an object retrieved from a path specified by a dot specified text path starting from a given base object.
    * It could be useful to find the reference of an object from a defined base object. For example the base object could be window and the
    * path could be "Cocoon.App" or "document.body".
    * @static
    * @param {Object} baseObject The object to start from to find the object using the given text path.
    * @param {string} objectPath The path in the form of a text using the dot notation. i.e. "document.body"
    * @private
    * @memberof Cocoon
    * For example:
    * var body = Cocoon.getObjectFromPath(window, "document.body");
    */
    Cocoon.getObjectFromPath = function(baseObject, objectPath) {
        var parts = objectPath.split('.');
        var obj = baseObject;
        for (var i = 0, len = parts.length; i < len; ++i) 
        {
            obj[parts[i]] = obj[parts[i]] || undefined;
            obj = obj[parts[i]];
        }
        return obj;
    };

    /**
    * A class that represents objects to handle events. Event handlers have always the same structure:
    * Mainly they provide the addEventListener and removeEventListener functions.
    * Both functions receive a callback function that will be added or removed. All the added callback
    * functions will be called when the event takes place.
    * Additionally they also allow the addEventListenerOnce and notifyEventListeners functions.
    * @constructor
    * @param {string} nativeExtensionObjectName The name of the native extension object (inside the ext object) to be used.
    * @param {string} CocoonExtensionObjectName The name of the sugarized extension object.
    * @param {string} nativeEventName The name of the native event inside the ext object.
    * @param {number} [chainFunction] An optional function used to preprocess the listener callbacks. This function, if provided,
    * will be called before any of the other listeners.
    * @memberof Cocoon
    * @private
    * @static
    */
    Cocoon.EventHandler = function(nativeExtensionObjectName, CocoonExtensionObjectName, nativeEventName, chainFunction) {
        this.listeners = [];
        this.listenersOnce = [];
        this.chainFunction = chainFunction;

        /**
        * Adds a callback function so it can be called when the event takes place.
        * @param {function} listener The callback function to be added to the event handler object. See the referenced Listener function documentation for more detail in each event handler object's documentation.
        * @memberof Cocoon.EventHandler
        * @private
        * @static
        */
        this.addEventListener = function(listener) {
            if (chainFunction) {
                var f = function() {
                    chainFunction.call(this, arguments.callee.sourceListener, Array.prototype.slice.call(arguments)); 
                };
                listener.CocoonEventHandlerChainFunction = f;
                f.sourceListener = listener;
                listener = f;
            }

            var CocoonExtensionObject = Cocoon.getObjectFromPath(Cocoon, CocoonExtensionObjectName);
            if (CocoonExtensionObject && CocoonExtensionObject.nativeAvailable) {
                ext[nativeExtensionObjectName].addEventListener(nativeEventName, listener);
            }
            else {
                var indexOfListener = this.listeners.indexOf(listener);
                if (indexOfListener < 0) {
                    this.listeners.push(listener);
                }
            }
        };
        /**
        * Adds a callback function that will be called only one time.
        * @param {function} listener The callback function to be added to the event handler object. See the referenced Listener function documentation for more detail in each event handler object's documentation.
        * @memberof Cocoon.EventHandler
        * @private
        * @static
        */

        this.addEventListenerOnce = function(listener)
        {
            if (chainFunction) {
                var f = function() { chainFunction(arguments.callee.sourceListener,Array.prototype.slice.call(arguments)); };
                f.sourceListener = listener;
                listener = f;
            }

            var CocoonExtensionObject = Cocoon.getObjectFromPath(Cocoon, CocoonExtensionObjectName);
            if (CocoonExtensionObject.nativeAvailable) {
                ext[nativeExtensionObjectName].addEventListenerOnce(nativeEventName, listener);
            }
            else
            {
                var indexOfListener = this.listeners.indexOf(listener);
                if (indexOfListener < 0)
                {
                    this.listenersOnce.push(listener);
                }
            }
        };

        /**
        * Removes a callback function that was added to the event handler so it won't be called when the event takes place.
        * @param {function} listener The callback function to be removed from the event handler object. See the referenced Listener function documentation for more detail in each event handler object's documentation.
        * @memberof Cocoon.EventHandler
        * @private
        * @static
        */
        this.removeEventListener = function (listener) {

            if (chainFunction) {
                listener = listener.CocoonEventHandlerChainFunction;
                delete listener.CocoonEventHandlerChainFunction;
            }

            var CocoonExtensionObject = Cocoon.getObjectFromPath(Cocoon, CocoonExtensionObjectName);
            if (CocoonExtensionObject.nativeAvailable) {
                ext[nativeExtensionObjectName].removeEventListener(nativeEventName, listener);
            }
            else {
                var indexOfListener = this.listeners.indexOf(listener);
                if (indexOfListener >= 0) {
                    this.listeners.splice(indexOfListener, 1);
                }
            }
        };

        this.removeEventListenerOnce = function (listener) {

            if (chainFunction) {
                listener = listener.CocoonEventHandlerChainFunction;
                delete listener.CocoonEventHandlerChainFunction;
            }

            var CocoonExtensionObject = Cocoon.getObjectFromPath(Cocoon, CocoonExtensionObjectName);
            if (CocoonExtensionObject.nativeAvailable) {
                ext[nativeExtensionObjectName].removeEventListenerOnce(nativeEventName, listener);
            }
            else {
                var indexOfListener = this.listenersOnce.indexOf(listener);
                if (indexOfListener >= 0) {
                    this.listenersOnce.splice(indexOfListener, 1);
                }
            }
        };

        /**
        * @memberof Cocoon.EventHandler
        * @private
        * @static
        */

        this.notifyEventListeners = function() {
            var CocoonExtensionObject = Cocoon.getObjectFromPath(Cocoon, CocoonExtensionObjectName);
            if (CocoonExtensionObject && CocoonExtensionObject.nativeAvailable) {
                ext[nativeExtensionObjectName].notifyEventListeners(nativeEventName);
            } else {

                var argumentsArray= Array.prototype.slice.call(arguments);
                var listeners =     Array.prototype.slice.call(this.listeners);
                var listenersOnce = Array.prototype.slice.call(this.listenersOnce);
                var _this = this;
                // Notify listeners after a while ;) === do not block this thread.
                setTimeout(function() {
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i].apply(_this, argumentsArray);
                    }
                    for (var i = 0; i < listenersOnce.length; i++) {
                        listenersOnce[i].apply(_this, argumentsArray);
                    }
                }, 0);

                _this.listenersOnce= [];
            }
        };
        return this;
    };
    
    /**
    * This function is used to create extensions in the global namespace of the "Cocoon" object.
    * @memberof Cocoon
    * @private
    * @static
    * @param {string} namespace The extensions namespace, ex: Cocoon.App.Settings.
    * @param {object} callback The callback which holds the declaration of the new extension.
    * @example
    * Cocoon.define("Cocoon.namespace" , function(extension){
    * "use strict";
    *
    * return extension;
    * });
    */
    Cocoon.define = function(extName, ext){
        
        var namespace = (extName.substring(0,7) == "Cocoon.") ? extName.substr(7) : extName;

        var base    = window.Cocoon;
        var parts  = namespace.split(".");
        var object = base;
    
        for(var i = 0; i < parts.length; i++) {
            var part = parts[i];
            (!object[part]) ? console.log("Created namespace: " + extName) : console.log("Updated namespace: - " + extName);
            object = object[part] = (i == (parts.length - 1)) ? ext( (object[part] || {}) ) : {};
            if(!object) {
                throw "Unable to create class " + extName;
            }
        }
                
        return true;
    }

    console.log("Created namespace: Cocoon");

})();