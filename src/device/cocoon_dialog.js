/**
* Dialog functions (prompt / confirm).
*
*<div class="alert alert-success">
* <p>Here you will find demos about this namespace: </p> 
* <ul> <li> <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Keyboard">Keyboard demo</a>.</li>
* <li> <a href="https://github.com/ludei/cocoonjs-demos/tree/Vibration">Vibration demo</a>.</li> </ul>
*</div>
* @namespace Cocoon.Dialog
*/
Cocoon.define("Cocoon.Dialog" , function(extension){
    "use strict";

   	/**
     * @property {object} Cocoon.Dialog.keyboardType Types of input keyboard.
     * @property {string} Cocoon.Dialog.keyboardType.TEXT Represents a generic text input keyboard.
     * @property {string} Cocoon.Dialog.keyboardType.NUMBER Represents a number like input keyboard.
     * @property {string} Cocoon.Dialog.keyboardType.PHONE Represents a phone like input keyboard.
     * @property {string} Cocoon.Dialog.keyboardType.EMAIL Represents an email like input keyboard.
     * @property {string} Cocoon.Dialog.keyboardType.URL Represents an URL like input keyboard.
     * @memberOf Cocoon.Dialog
     * @name Cocoon.Dialog.keyboardType
     */
    extension.keyboardType = {

        TEXT:"text",

        NUMBER:"num",

        PHONE:"phone",

        EMAIL:"email",

        URL:"url"
    };

     /**
      * Pops up a text dialog so the user can introduce some text and the application can get it back. It is the first approach CocoonJS has taken to be able to introduce
      * text input in a easy way. The dialog execution events are passed to the application through the {@link Cocoon.Dialog.onTextDialogFinished} and the {@link Cocoon.Dialog.onTextDialogCancelled} event objects.
      * @param {object} param Object information.
      * @param [param.title] {string} The title to be displayed in the dialog.
      * @param [param.message] {string} The message to be displayed in the dialog, next to the text input field.
      * @param [param.text] {string} The initial text to be introduced in the text input field.
      * @param [param.type] {Cocoon.Dialog.keyboardType} Default value is Cocoon.Dialog.keyboardType.TEXT. The keyboard type to be used when the text has to be introduced.
      * @param [param.cancelText] {string} Default value is "Cancel". The text to be displayed in the cancel button of the dialog.
      * @param [param.confirmText] {string} Default value is "Ok". The text to be displayed in the ok button of the dialog.
      * @param {callback} callbacks - <i>success</i> and <i>cancel</i> callbacks called when the user confirms or cancel the dialog.
      * @memberOf Cocoon.Dialog
      * @function prompt
      * @example 
      * Cocoon.Dialog.prompt({ 
      *     title : "title",
      *     message : "message"
      * },{
      *     success : function(text){ ... },
      *     cancel : function(){ ... }
      * });
      */

    extension.prompt = function (params, callbacks) {
        
        if(!callbacks)  throw("Callback missing for Cocoon.Dialog.prompt();");
        var defaultKeyboard = Cocoon.Dialog.keyboardType.TEXT;
        
        switch (params.type){
            case Cocoon.Dialog.keyboardType.TEXT:
                defaultKeyboard = Cocoon.Dialog.keyboardType.TEXT;
            break;
            case Cocoon.Dialog.keyboardType.NUMBER:
                defaultKeyboard = Cocoon.Dialog.keyboardType.NUMBER;
            break;
            case Cocoon.Dialog.keyboardType.PHONE:
                defaultKeyboard = Cocoon.Dialog.keyboardType.PHONE;
            break;
            case Cocoon.Dialog.keyboardType.EMAIL:
                defaultKeyboard = Cocoon.Dialog.keyboardType.EMAIL;
            break;
            case Cocoon.Dialog.keyboardType.URL:
                defaultKeyboard = Cocoon.Dialog.keyboardType.URL;
            break;
        }

        var properties = {
            title : "",
            message : "",
            text : "",
            type : defaultKeyboard,
            cancelText : "Cancel",
            confirmText : "Ok"
        };

        var args = Cocoon.clone(properties,params);

        var succedListener = function(){
            Cocoon.Dialog.onTextDialogCancelled.removeEventListener(errorListener);
            Cocoon.Dialog.onTextDialogFinished.removeEventListener(succedListener);
            callbacks.success.apply(window , Array.prototype.slice.call(arguments));
        };
  
        var errorListener = function(){
            Cocoon.Dialog.onTextDialogCancelled.removeEventListener(errorListener);
            Cocoon.Dialog.onTextDialogFinished.removeEventListener(succedListener);
            callbacks.cancel.apply(window , Array.prototype.slice.call(arguments));
        };

        Cocoon.Dialog.onTextDialogCancelled.addEventListener(errorListener);
        Cocoon.Dialog.onTextDialogFinished.addEventListener(succedListener);

        if (Cocoon.App.nativeAvailable) {
            return Cocoon.callNative("IDTK_APP", "showTextDialog", args, true);
        }else{
            setTimeout(function() {
                var result = prompt(properties.message, properties.text);
                var eventObject = result ? Cocoon.Dialog.onTextDialogFinished : Cocoon.Dialog.onTextDialogCancelled;
                eventObject.notifyEventListeners(result);
            }, 0);
        }
    };

    /**
     * Pops up a message dialog so the user can decide between a yes or no like confirmation.
     * @function
     * @param {object} params
     * @param params.title Default value is "". The title to be displayed in the dialog.
     * @param params.message Default value is "". The message to be displayed in the dialog, next to the text input field.
     * @param params.confirmText Default value is "Ok". The text to be displayed for the confirm button.
     * @param params.cancelText  Default value is "Cancel". The text to be displayed for the deny button.
     * @param {function} callback - Called when the user accepts or cancel the dialog, it receives an argument true/false.
     * @memberOf Cocoon.Dialog
     * @function confirm
     * @example
     * Cocoon.Dialog.confirm({
     *  title : "This is the title",
     *  message : "Awesome message"
     * }, function(accepted){
     *  if(accepted){
     *      alert("The user has accepted the dialog");
     *  }else{
     *      alert("The user has denied the dialog");
     *  }
     * });
     */
    extension.confirm = function (params, callback) {

        if(!callback) throw("Callback missing for Cocoon.Dialog.confirm();");

        var properties = {
            title : "", 
            message : "", 
            cancelText : "Cancel",
            confirmText : "Ok"
        };

        var args = Cocoon.clone(properties,params);

        var succedListener = function(){
            Cocoon.Dialog.onMessageBoxDenied.removeEventListenerOnce(errorListener);
            callback(true);
        };
        
        var errorListener = function(){
            Cocoon.Dialog.onMessageBoxConfirmed.removeEventListenerOnce(succedListener);
            callback(false);
        };

        Cocoon.Dialog.onMessageBoxDenied.addEventListenerOnce(errorListener);
        Cocoon.Dialog.onMessageBoxConfirmed.addEventListenerOnce(succedListener);

        if (Cocoon.nativeAvailable) {
            return Cocoon.callNative("IDTK_APP", "showMessageBox", args, true);
        }else{
            setTimeout(function() {
                var result = confirm(properties.message);
                var eventObject = result ? Cocoon.Dialog.onMessageBoxConfirmed : Cocoon.Dialog.onMessageBoxDenied;
                eventObject.notifyEventListeners();
            }, 0);
        }
    };

    /**
      * Shows a keyboard to receive user input. The developer has to process input events and render the resulting text.
      * @param {object} param Object information.
      * @param [param.type] {Cocoon.Dialog.keyboardType} Default value is Cocoon.Dialog.keyboardType.TEXT. The keyboard type to be used when the text has to be introduced.
      * @param {callback} callbacks - <i>insertText</i>, <i>deleteBackward</i>, <i>done</i>, <i>cancel</i> callbacks called when the user clicks a key, confirms or cancels the keyboard session.
      * @memberOf Cocoon.Dialog
      * @function showKeyboard
      * @example 
      * var text = "";
      * Cocoon.Dialog.showKeyboard({
      *     type: Cocoon.Dialog.keyboardType.TEXT,
      * }, {
      *     insertText: function(inserted) {
      *         text += inserted;
      *         console.log(text);
      *     },
      *     deleteBackward: function() {
      *         text = text.slice(0, text.length - 1);
      *         console.log(text);
      *     },
      *     done: function() {
      *         console.log("user clicked done key");
      *     },
      *     cancel: function() {
      *         console.log("user dismissed keyboard");
      *     }
      * });
      */
    extension.showKeyboard = function(params, callbacks) {
        params = params || {};
        params.type = params.type || Cocoon.Dialog.keyboardType.TEXT;
        var insertCallback = callbacks && callbacks.insertText;
        var deleteCallback = callbacks && callbacks.deleteBackward;
        var doneCallback = callbacks && callbacks.done;
        var cancelCallback =  callbacks && callbacks.cancel;

        if (Cocoon.nativeAvailable) {
            Cocoon.callNative("IDTK_APP", "showKeyboard", 
                [params, insertCallback, deleteCallback, doneCallback, cancelCallback], true);
        }
    };

    /**
      * Dismisses a keyboard which was previusly shown by {@link Cocoon.Dialog.showKeyboard}
      *
      * @memberOf Cocoon.Dialog
      * @function dismissKeyboard
      * @example 
      * var text = "";
      * Cocoon.Dialog.showKeyboard({
      *     type: Cocoon.Dialog.keyboardType.TEXT,
      * }, {
      *     insertText: function(inserted) {
      *         if (inserted === "A") { //Custom keyboard hide
      *             Cocoon.Dialog.dismissKeyboard();
      *         }
      *         text += inserted;
      *         console.log(text);
      *     },
      *     deleteBackward: function() {
      *         text = text.slice(0, text.length - 1);
      *         console.log(text);
      *     },
      *     done: function() {
      *         console.log("user clicked done key");
      *     },
      *     cancel: function() {
      *         console.log("user dismissed keyboard");
      *     }
      * });
      */
    extension.dismissKeyboard = function() {
        if (Cocoon.nativeAvailable) {
            Cocoon.callNative("IDTK_APP", "dismissKeyboard", [], true);
        }
    }

    /**
     * Allows listening to events called when the text dialog is finished by accepting it's content.
     * The callback function's documentation is represented by {@link Cocoon.Dialog.OnTextDialogFinishedListener}
     * @event
     * @static
     * @private
     * @memberOf Cocoon.Dialog
     */
    extension.onTextDialogFinished = new Cocoon.EventHandler("IDTK_APP", "App", "ontextdialogfinish");

    /**
     * Allows listening to events called when the text dialog is finished by dismissing it's content.
     * The callback function does not receive any parameter.
     * @event
     * @static
     * @private
     * @memberOf Cocoon.Dialog
     */
    extension.onTextDialogCancelled = new Cocoon.EventHandler("IDTK_APP", "App", "ontextdialogcancel");

    /**
     * Allows listening to events called when the text dialog is finished by accepting it's content.
     * The callback function does not receive any parameter.
     * @event
     * @static
     * @private
     * @memberOf Cocoon.Dialog
     */
    extension.onMessageBoxConfirmed = new Cocoon.EventHandler("IDTK_APP", "App", "onmessageboxconfirmed");

    /**
     * Allows listening to events called when the text dialog is finished by dismissing it's content.
     * The callback function does not receive any parameter.
     * @event
     * @static
     * @private
     * @memberOf Cocoon.Dialog
     */
    extension.onMessageBoxDenied = new Cocoon.EventHandler("IDTK_APP", "App", "onmessageboxdenied");

    return extension;

});
