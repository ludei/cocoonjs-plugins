Cocoon.define("Cocoon.Proxify" , function(extension){
    "use strict";
    /**
    * Proxies different functions of the WebView environment, like Audio objects and XHR.
    * @namespace Cocoon.Proxify
    */

    /**
    * @function getKeyForValueInDictionary
    * @memberof Cocoon.WebView
    * @private
    */
    extension.getKeyForValueInDictionary = function(dictionary, value) {
        var finalKey = null;
        for (var key in dictionary) {
            if (dictionary[key] === value){
                finalKey = key;
                break;
            }
        }
        return finalKey;
    }

    /**
    * Setups a origin proxy for a given typeName. What this means is that after calling this function the environment that makes this call will suddenly
    * have a way of creating instances of the given typeName and those instances will act as a transparent proxy to counterpart instances in the destination environment.
    * Manipulating attributes, calling funcitions or handling events will all be performed in the destination environment but the developer will think they will be
    * happening in the origin environment.
    * IMPORTANT NOTE: These proxies only work with types that use attributes and function parameters and return types that are primitive like numbers, strings or arrays.
    * @function setupOriginProxyType
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type to be proxified.
    * @param {array} [attributeNames] A list of the names of the attributes to be proxified.
    * @param {array} [functionNames] A list of the names of the functions to be proxified.
    * @param {array} [eventHandlerNames] A list of the names of the event handlers to be proxified (onXXXX like attributes that represent callbacks).
    * A valid typeName and at least one valid array for attribute, function or event handler names is mandatory.
    */
    extension.setupOriginProxyType = function (typeName, attributeNames, functionNames, eventHandlerNames) {
        if (Cocoon.nativeAvailable){
            // Control the parameters.
            if (!typeName) throw "The given typeName must be valid.";
            if (!attributeNames && !functionNames && !eventHandlerNames) throw "There is no point on setting up a proxy for no attributes, functions nor eventHandlers.";
            attributeNames = attributeNames ? attributeNames : [];
            functionNames = functionNames ? functionNames : [];
            eventHandlerNames = eventHandlerNames ? eventHandlerNames : [];

            // The parent object will be the window. It could be another object but careful, the destination side should know about this.
            // TODO: Specify the parentObject as a parameter, obtain it's path from the window object and pass it to the destination environment so it knows about it.
            var parentObject = window;

            // Setup the destination side too.
            var jsCode = "Cocoon.Proxify.setupDestinationProxyType(" + JSON.stringify(typeName) + ", " + JSON.stringify(eventHandlerNames) + ");";
            Cocoon.App.forward(jsCode);

            var originalType = parentObject[typeName];

            // Constructor. This will be the new proxified type in the origin environment. Instances of this type will be created by the developer without knowing that they are
            // internally calling to their counterparts in the destination environment.
            parentObject[typeName] = function () {
                var _this = this;

                // Each proxy object will have a origin object inside with all the necessary information to be a proxy to the destination.
                this._cocoonjs_proxy_object_data = {};
                // The id is obtained calling to the destination side to create an instance of the type.
                var jsCode = "Cocoon.Proxify.newDestinationProxyObject(" + JSON.stringify(typeName) + ");";
                this._cocoonjs_proxy_object_data.id = Cocoon.App.forward(jsCode);
                // The eventHandlers dictionary contains objects of the type { eventHandlerName : string, eventHandler : function } to be able to make the callbacks when the 
                // webview makes the corresponding calls.
                this._cocoonjs_proxy_object_data.eventHandlers = {};
                // Also store the typename inside each instance.
                this._cocoonjs_proxy_object_data.typeName = typeName;
                // A dictionary to store the event handlers
                this._cocoonjs_proxy_object_data.eventListeners = {};

                // TODO: eventHandlers and eventListeners should be in the same list ;)

                // Store all the proxy instances in a list that belongs to the type itself.
                parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[this._cocoonjs_proxy_object_data.id] = this;

                // Create a setter and a getter for all the attribute names that have been specified. When the attributes are accessed (set or get) a call to the destination counterpart will be performed.
                for (var i = 0; i < attributeNames.length; i++) {
                    (function (attributeName) {
                        _this.__defineSetter__(attributeName, function (value) {
                            var jsCode = "Cocoon.Proxify.setDestinationProxyObjectAttribute(" + JSON.stringify(typeName) + ", " + _this._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(attributeName) + ", " + JSON.stringify(value) + ");";
                            return Cocoon.App.forward(jsCode);
                        });
                        _this.__defineGetter__(attributeName, function () {
                            var jsCode = "Cocoon.Proxify.getDestinationProxyObjectAttribute(" + JSON.stringify(typeName) + ", " + _this._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(attributeName) + ");";
                            return Cocoon.App.forward(jsCode);
                        });
                    })(attributeNames[i]);
                }

                // Create a function that performs a call to the destination environment counterpart for all the function names that have been specified.
                for (var i = 0; i < functionNames.length; i++) {
                    (function (functionName) {
                        _this[functionName] = function () {
                            // Get the arguments as an array and add the typeName, the proxy id and the functionName before all the other arguments before making the call to the destination counterpart.
                            var argumentsArray = Array.prototype.slice.call(arguments);
                            argumentsArray.unshift(functionName);
                            argumentsArray.unshift(this._cocoonjs_proxy_object_data.id);
                            argumentsArray.unshift(typeName);
                            // Use the array to create the correct function call.
                            var jsCode = "Cocoon.Proxify.callDestinationProxyObjectFunction(";
                            for (var i = 0; i < argumentsArray.length; i++) {
                                // The second argument (the id) should not be stringified
                                jsCode += (i !== 1 ? JSON.stringify(argumentsArray[i]) : argumentsArray[i]) + (i < argumentsArray.length - 1 ? ", " : "");
                            }
                            jsCode += ");";
                            // TODO: This next call should be synchronous but it seems that some customers are experiencing some crash issues. Making it async solves these crashes.
                            // Another possible solution could be to be able to specify which calls could be async and which sync in the proxification array.
                            var ret = Cocoon.App.forwardAsync(jsCode);
                            return ret;
                        };
                    })(functionNames[i]);
                }

                // Create a setter and getter for all the event handler names that have been specified. When the event handlers are accessed, store them inside the corresponding position on the eventHandlers
                // array so they can be called when the destination environment makes the corresponding callback call.
                for (var i = 0; i < eventHandlerNames.length; i++) {
                    (function (eventHandlerName) {
                        _this.__defineSetter__(eventHandlerName, function (value) {
                            _this._cocoonjs_proxy_object_data.eventHandlers[eventHandlerName] = value;
                        });
                        _this.__defineGetter__(eventHandlerName, function () {
                            return _this._cocoonjs_proxy_object_data.eventHandlers[eventHandlerName];
                        });
                    })(eventHandlerNames[i]);
                }

                // Setup the add and remove event listeners in the proxy object
                _this.addEventListener = function (eventTypeName, eventCallback) {
                    var addEventCallback = true;
                    // Check for the eventListeners
                    var eventListeners = _this._cocoonjs_proxy_object_data.eventListeners[eventTypeName];
                    if (eventListeners) {
                        // As the eventListeners were already added, check that the same callback has not been added.
                        addEventCallback = eventListeners.indexOf(eventCallback) < 0;
                    }
                    else {
                        // There are no event listeners, so add the one and add the listeners array for the specific event type name
                        eventListeners = [];
                        _this._cocoonjs_proxy_object_data.eventListeners[eventTypeName] = eventListeners;

                        // Forward the call so the other end registers a event listener (only one is needed).
                        var jsCode = "Cocoon.Proxify.addDestinationProxyObjectEventListener(" + JSON.stringify(_this._cocoonjs_proxy_object_data.typeName) + ", " + _this._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(eventTypeName) + ");";
                        Cocoon.App.forwardAsync(jsCode);
                    }
                    // Only if the alforithm above specify so, add the eventcallback and notify the destination environment to do the same
                    if (addEventCallback) {
                        eventListeners.push(eventCallback);
                    }
                };

                _this.removeEventListener = function (eventTypeName, eventCallback) {
                    // Check for the eventListeners
                    var eventListeners = _this._cocoonjs_proxy_object_data.eventListeners[eventTypeName];
                    if (eventListeners) {
                        var eventCallbackIndex = eventListeners.indexOf(eventCallback);
                        if (eventCallbackIndex >= 0) {
                            eventListeners.splice(eventCallbackIndex, 1);
                        }
                    }
                };

                // Return the proxy instance.
                return this;
            };

            // The type will contain a proxy data structure to store all the instances that are created so they are available when the destination environment calls back. 
            parentObject[typeName]._cocoonjs_proxy_type_data =
            {
                originalType:originalType,
                proxyObjects:[]
            };

            /**
             * Deletes a proxy instance from both the CocoonJS environment structures and also deleting it's webview environment counterpart.
             * This function should be manually called whenever a proxy instance won't be accessed anymore.
             * @param {object} object The proxy object to be deleted.
             */
            parentObject[typeName]._cocoonjs_proxy_type_data.deleteProxyObject = function (object) {
                var proxyObjectKey = extension.getKeyForValueInDictionary(this.proxyObjects, object);
                if (proxyObjectKey) {
                    var jsCode = "Cocoon.Proxify.deleteDestinationProxyObject(" + JSON.stringify(typeName) + ", " + object._cocoonjs_proxy_object_data.id + ");";
                    Cocoon.App.forwardAsync(jsCode);
                    object._cocoonjs_proxy_object_data = null;
                    delete this.proxyObjects[proxyObjectKey];
                }
            };

            /**
             * Calls an event handler for the given proxy object id and an eventHandlerName.
             * @param {number} id The id to be used to look for the proxy object for which to make the call to it's event handler.
             * @param {string} eventHandlerName The name of the handler to be called.
             * NOTE: Events are a complex thing in the HTML specification. This function just performs a call but at least provides a
             * structure to the event passing the target (the proxy object).
             * TODO: The destination should serialize the event object as far as it can so many parameters can be passed to the origin
             * side. Using JSON.stringify in the destination side and parse in origin side maybe? Still must add the target to the event structure though.
             */
            parentObject[typeName]._cocoonjs_proxy_type_data.callProxyObjectEventHandler = function (id, eventHandlerName) {
                var object = this.proxyObjects[id];
                var eventHandler = object._cocoonjs_proxy_object_data.eventHandlers[eventHandlerName];
                if (eventHandler) {
                    eventHandler({ target:object });
                }
            };

            parentObject[typeName]._cocoonjs_proxy_type_data.callProxyObjectEventListeners = function (id, eventTypeName) {
                var object = this.proxyObjects[id];
                var eventListeners = object._cocoonjs_proxy_object_data.eventListeners[eventTypeName].slice();
                for (var i = 0; i < eventListeners.length; i++) {
                    eventListeners[i]({ target:object });
                }
            };
        }
    };

    /**
    * Takes down the proxification of a type and restores it to it's original type. Do not worry if you pass a type name that is not proxified yet. The
    * function will handle it correctly for compativility reasons.
    * @function takedownOriginProxyType
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type to be deproxified (take down the proxification and restore the type to it's original state)
    */
    extension.takedownOriginProxyType = function (typeName) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            if (parentObject[typeName] && parentObject[typeName]._cocoonjs_proxy_type_data) {
                parentObject[typeName] = parentObject[typeName]._cocoonjs_proxy_type_data.originalType;
            }
        }
    };

    /**
    * Deletes everything related to a proxy object in both environments. Do not worry of you do not pass a proxified object to the
    * function. For compatibility reasons, you can still have calls to this function even when no poxification of a type has been done.
    * @function deleteOriginProxyObject
    * @memberof Cocoon.Proxify
    * @private
    * @param {object} object The proxified object to be deleted.
    */
    extension.deleteOriginProxyObject = function (object) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            if (object && object._cocoonjs_proxy_object_data) {
                parentObject[object._cocoonjs_proxy_object_data.typeName]._cocoonjs_proxy_type_data.deleteProxyObject(object);
            }
        }
    };

    /**
    * Calls the origin proxy object when an event handler need to be updated/called from the destination environment.
    * @function callOriginProxyObjectEventHandler
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The type name of the proxified type.
    * @param {number} id The id of the proxy object.
    * @param {string} eventHandlerName The name of the event handler to be called.
    */
    extension.callOriginProxyObjectEventHandler = function (typeName, id, eventHandlerName) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            parentObject[typeName]._cocoonjs_proxy_type_data.callProxyObjectEventHandler(id, eventHandlerName);
        }
    };

    /**
    * Calls the origin proxy object when all the event listeners related to a specific event need to be updated/called from the destination environment.
    * @function callOriginProxyObjectEventListeners
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The type name of the proxified type.
    * @param {number} id The id of the proxy object.
    * @param {string} eventTypeName The name of the event type to call the listeners related to it.
    */
    extension.callOriginProxyObjectEventListeners = function (typeName, id, eventTypeName) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            parentObject[typeName]._cocoonjs_proxy_type_data.callProxyObjectEventListeners(id, eventTypeName);
        }
    };

    /**
    * Setups all the structures that are needed to proxify a destination type to an origin type.
    * @function setupDestinationProxyType
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type to be proxified.
    * @param {array} eventHandlerNames An array with al the event handlers to be proxified. Needed in order to be able to create callbacks for all the event handlers
    * and call to the CocoonJS counterparts accordingly.
    */
    extension.setupDestinationProxyType = function (typeName, eventHandlerNames) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;

            // Add a cocoonjs structure to the destination proxified type to store some useful information like all the proxy instances that are created, plus the id counter 
            // and the names of all the event handlers and some utility functions.
            parentObject[typeName]._cocoonjs_proxy_type_data =
            {
                nextId:0,
                proxyObjects:{},
                eventHandlerNames:eventHandlerNames
            }
        }
    };

    /**
    * Takes down the proxy type at the destination environment. Just removes the data structure related to proxies that was added to the type when proxification tool place.
    * @function takedownDestinationProxyType
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type to take the proxification down.
    */
    extension.takedownDestinationProxyType = function (typeName) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            if (parent[typeName] && parentObject[typeName]._cocoonjs_proxy_type_data) {
                delete parentObject[typeName]._cocoonjs_proxy_type_data;
            }
        }
    };

    /**
    * Creates a new destination object instance and generates a id to reference it from the original environment.
    * @function newDestinationProxyObject
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type to be proxified and to generate an instance.
    * @return The id to be used from the original environment to identify the corresponding destination object instance.
    */
    extension.newDestinationProxyObject = function (typeName) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;

            var proxyObject = new parentObject[typeName]();
            // Also store some additional information in the proxy object
            proxyObject._cocoonjs_proxy_object_data = {};
            // Like the type name, that could be useful late ;)
            proxyObject._cocoonjs_proxy_object_data.typeName = typeName;
            // Caculate the id for the object. It will be returned to the origin environment so this object can be referenced later
            var proxyObjectId = parentObject[typeName]._cocoonjs_proxy_type_data.nextId;
            // Store the created object in the structure defined in the setup of proxification with an id associated to it
            parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[proxyObjectId] = proxyObject;
            // Also store the id inside the proxy object itself
            proxyObject._cocoonjs_proxy_object_data.id = proxyObjectId;
            // Calculate a new id for the next object.
            parentObject[typeName]._cocoonjs_proxy_type_data.nextId++;

            // Setup all the event handlers.
            for (var i = 0; i < parentObject[typeName]._cocoonjs_proxy_type_data.eventHandlerNames.length; i++) {
                (function (eventHandlerName) {
                    proxyObject[eventHandlerName] = function (event) {
                        var proxyObject = this; // event.target;
                        // var eventHandlerName = Cocoon.getKeyForValueInDictionary(proxyObject, this); // Avoid closures ;)
                        var jsCode = "Cocoon.App.callOriginProxyObjectEventHandler(" + JSON.stringify(proxyObject._cocoonjs_proxy_object_data.typeName) + ", " + proxyObject._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(eventHandlerName) + ");";
                        Cocoon.App.forwardAsync(jsCode);
                    };
                })(parentObject[typeName]._cocoonjs_proxy_type_data.eventHandlerNames[i]);
            }

            // Add the dictionary where the event listeners (callbacks) will be added.
            proxyObject._cocoonjs_proxy_object_data.eventListeners = {};

            return proxyObjectId;
        }
    };

    /**
    * Calls a function of a destination object idetified by it's typeName and id.
    * @function callDestinationProxyObjectFunction
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type of the proxy.
    * @param {number} id The id of the proxy object.
    * @param {string} functionName The name of the function to be called.
    * @return Whatever the function call returns.
    */
    extension.callDestinationProxyObjectFunction = function (typeName, id, functionName) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            var argumentsArray = Array.prototype.slice.call(arguments);
            argumentsArray.splice(0, 3);
            var proxyObject = parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];
            var result = proxyObject[functionName].apply(proxyObject, argumentsArray);
            return result;
        }
    };

    /**
    * Sets a value to the corresponding attributeName of a proxy object represented by it's typeName and id.
    * @function setDestinationProxyObjectAttribute
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type of the proxy.
    * @param {number} id The id of the proxy object.
    * @param {string} attributeName The name of the attribute to be set.
    * @param {unknown} attributeValue The value to be set to the attribute.
    */
    extension.setDestinationProxyObjectAttribute = function (typeName, id, attributeName, attributeValue) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            var proxyObject = parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];
            proxyObject[attributeName] = attributeValue;
        }
    };

    /**
    * Retrieves the value of the corresponding attributeName of a proxy object represented by it's typeName and id.
    * @function getDestinationProxyObjectAttribute
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type of the proxy.
    * @param {number} id The id of the proxy object.
    * @param {string} attributeName The name of the attribute to be retrieved.
    */
    extension.getDestinationProxyObjectAttribute = function (typeName, id, attributeName) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            var proxyObject = parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];
            return proxyObject[attributeName];
        }
    };

    /**
    * Deletes a proxy object identifying it using it's typeName and id. Deleting a proxy object mainly means to remove the instance from the global structure
    * that hold all the instances.
    * @function deleteDestinationProxyObject
    * @memberof Cocoon.Proxify
    * @private
    * @param {string} typeName The name of the type of the proxy.
    * @param {number} id The id of the proxy object.
    */
    extension.deleteDestinationProxyObject = function (typeName, id) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            delete parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];
        }
    };

    /**
    * @function addDestinationProxyObjectEventListener
    * @memberof Cocoon.Proxify
    * @private
    */
    extension.addDestinationProxyObjectEventListener = function (typeName, id, eventTypeName) {
        if (Cocoon.App.nativeAvailable) {
            var parentObject = window;
            // Look for the proxy object
            var proxyObject = parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];

            var callback = function (event) {
                var proxyObject = this; // event.target;
                // var eventTypeName = Cocoon.getKeyForValueInDictionary(proxyObject._cocoonjs_proxy_object_data.eventListeners, this); // Avoid closures ;)
                // TODO: Is there a way to retrieve the callbackId without a closure?
                var jsCode = "Cocoon.Proxify.callOriginProxyObjectEventListeners(" + JSON.stringify(proxyObject._cocoonjs_proxy_object_data.typeName) + ", " + proxyObject._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(eventTypeName) + ");";
                Cocoon.App.forwardAsync(jsCode);
            };

            proxyObject._cocoonjs_proxy_object_data.eventListeners[eventTypeName] = callback;

            // Finally add the event listener callback to the proxy object
            proxyObject.addEventListener(eventTypeName, callback);
        }
    };

    /**
    * Proxifies the XMLHttpRequest type for the environment where this call is made. After calling this function, all the new objects
    * of XMLHttpRequest that are instantiated, will be proxified objects that will make calls to the counterparts in the other environment (CocoonJS <-> WebView viceversa).
    * IMPORTANT NOTE: Remember to take down the proxification once you are done or to delete proxy objects whenever they are not needed anymore or memory leaks may occur.
    * @function xhr
    * @memberof Cocoon.Proxify
    * @example
    * Cocoon.Proxify.xhr();
    */
    extension.xhr = function () {
        var ATTRIBUTE_NAMES =
            [
                "timeout",
                "withCredentials",
                "upload",
                "status",
                "statusText",
                "responseType",
                "response",
                "responseText",
                "responseXML",
                "readyState"
            ];
        var FUNCTION_NAMES =
            [
                "open",
                "setRequestHeader",
                "send",
                "abort",
                "getResponseHeader",
                "getAllResponseHeaders",
                "overrideMimeType"
            ];
        var EVENT_HANDLER_NAMES =
            [
                "onloadstart",
                "onprogress",
                "onabort",
                "onerror",
                "onload",
                "ontimeout",
                "onloadend",
                "onreadystatechange"
            ];
        Cocoon.Proxify.setupOriginProxyType("XMLHttpRequest", ATTRIBUTE_NAMES, FUNCTION_NAMES, EVENT_HANDLER_NAMES);
    };

    /**
    * Proxifies the Audio type for the environment where this call is made. After calling this function, all the new objects
    * of Audio that are instantiated, will be proxified objects that will make calls to the counterparts in the other environment (CocoonJS <-> WebView viceversa).
    * IMPORTANT NOTE: Remember to take down the proxification once you are done or to delete proxy objects whenever they are not needed anymore or memory leaks may occur.
    * @function audio
    * @memberof Cocoon.Proxify
    * @example
    * Cocoon.Proxify.audio();
    */
    extension.audio = function () {
        var ATTRIBUTE_NAMES =
            [
                "src",
                "loop",
                "volume",
                "preload"
            ];
        var FUNCTION_NAMES =
            [
                "play",
                "pause",
                "load",
                "canPlayType"
            ];
        var EVENT_HANDLER_NAMES =
            [
                "onended",
                "oncanplay",
                "oncanplaythrough",
                "onerror"
            ];
        Cocoon.Proxify.setupOriginProxyType("Audio", ATTRIBUTE_NAMES, FUNCTION_NAMES, EVENT_HANDLER_NAMES);
    };


    /**
    * This function allows to forward console messages from the WebView to the CocoonJS
    * debug console. What it does is to change the console object for a new one
    * with all it's methods (log, error, info, debug and warn) forwarding their
    * messages to the CocoonJS environment.
    * The original console object is stored in the Cocoon.originalConsole property.
    * @function console
    * @memberof Cocoon.Proxify
    * @example
    * Cocoon.Proxify.console();
    */
    extension.console = function() 
    {
        if (!Cocoon.nativeAvailable) return;

        if (typeof Cocoon.originalConsole === 'undefined')
        {
            Cocoon.originalConsole = window.console;
        }
        var functions = ["log", "error", "info", "debug", "warn"];

        var newConsole = {};
        for (var i = 0; i < functions.length; i++)
        {
            newConsole[functions[i]] = function(functionName)
            {
                return function(message)
                {
                    try{
                        var jsCode = "Proxified log: " + JSON.stringify(message);
                        Cocoon.originalConsole.log(jsCode);
                        ext.IDTK_APP.makeCallAsync("forward", jsCode);
                    }catch(e){
                        console.log("Proxified log: " + e);
                    }
                };
            }(functions[i]);
        }
        if (!newConsole.assert) {
            newConsole.assert = function assert() {
                if (arguments.length > 0 && !arguments[0]) {
                    var str = 'Assertion failed: ' + (arguments.length > 1 ? arguments[1] : '');
                    newConsole.error(str);
                }
            }
        }        
        window.console = newConsole;
    };

    /**
    * This function restores the original console object and removes the proxified console object.
    * @function deproxifyConsole
    * @memberof Cocoon.Proxify
    * @example
    * Cocoon.Proxify.deproxifyConsole();
    */
    extension.deproxifyConsole = function()
    {
        if (window.navigator.isCocoonJS || !Cocoon.nativeAvailable) return;
        if (typeof Cocoon.originalConsole !== 'undefined')
        {
            window.console = Cocoon.originalConsole;
            Cocoon.originalConsole = undefined;
        }
    };

    return extension;

});