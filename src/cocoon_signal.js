Cocoon.define("Cocoon.Signal" , function(extension){
    "use strict";

    /**
    * This namespace is used to create an Event Emitter/Dispatcher that works together.
    * with the Cocoon.EventHandler.
    * @namespace Cocoon.Signal
    * @private
    */

    /**
    * This constructor creates a new Signal that holds and emits different events that are specified inside each extension.
    * @memberof Cocoon.Signal
    * @private
    * @constructs createSignal
    */
    extension.createSignal = function(){
        /** @lends Cocoon.Signal.prototype */
    	this.handle = null;
    	this.signals = {};
    	
        /**
        * Registers a new Signal.
        * @param {string} namespace The name of the signal which will be emitted.
        * @param {object} handle The Cocoon.EventHandler that will handle the signals.
        * @function register
        * @private
        * @example
        * signal.register("banner.ready", new Cocoon.EventHandler);
        */
    	this.register = function(namespace, handle){

            if( (!namespace) && (!handle)) throw new Error("Can't create signal " + (namespace || ""));

            if(handle.addEventListener){
                this.signals[namespace] = handle;
                return true;
            }

            if(!handle.addEventListener){
                this.signals[namespace] = {};
                for (var prop in handle) {
                    if(handle.hasOwnProperty(prop)){
                        this.signals[namespace][prop] = handle[prop];
                    }
                };
                return true;
            }
            
            throw new Error("Can't create handler for " + namespace + " signal.");
            return false;
    	},

        /**
        * Exposes the already defined signals, and can be use to atach a callback to a Cocoon.EventHandler event.
        * @param {string} signal The name of the signal which will be emitted.
        * @param {object} callback The Cocoon.EventHandler that will handle the signals.
        * @param {object} params Optional parameters, example { once : true }
        * @function expose
        * @private
        * @example
        * Cocoon.namespace.on("event",function(){});
        */
    	this.expose = function(){
    		return function(signal, callback, params){
                var once = false;

                if(arguments.length === 1){
                    var that = this;
                    var fnc = function(signal){
                        this.signal = signal;
                    }
                    
                    fnc.prototype.remove = function(functionListener){
                        var handle = that.signals[this.signal];
                        if(handle && handle.removeEventListener) {
                            handle.removeEventListener.apply(that,[functionListener]);
                            that.signals[this.signal] = undefined;
                        }
                    }
                    return new fnc(signal);
                }

                if((params) && (params.once)){
                    once = true;
                }

                if(!this.signals[signal]) throw new Error("The signal " + signal + " does not exists.");
                var handle = this.signals[signal];
                if(handle.addEventListener){
                    if(once){
                        handle.addEventListenerOnce(function(){
                            callback.apply( this || window , arguments);
                        });
                    }else{
                        handle.addEventListener(function(){
                            callback.apply( this || window , arguments);
                        });
                    }
                }

                if(!this.signals[signal].addEventListener){
                    for (var prop in this.signals[signal]) {
                        
                        if(!this.signals[signal].hasOwnProperty(prop)) continue;
                        
                        var handle = this.signals[signal][prop];

                        if(once){
                            handle.addEventListenerOnce(function(){
                                this.clbk[this.name].apply( this || window , arguments);
                            }.bind({ name : prop , clbk : callback }));
                        }else{
                            handle.addEventListener(function(){
                                this.clbk[this.name].apply( this || window , arguments);
                            }.bind({ name : prop , clbk : callback }));
                        }
                        
                    }
                }

    		}.bind(this);
    	}
    }

    return extension;

});