/**
 * This namespace represents the Cocoon Notification extension.
 * The following image illustrates how the notification would look like when it arrives to your device. 
 *
 * <div> <img src="img/cocoon-notification.jpg"  height="35%" width="35%"/> <br/> <br/></div>
 * <p>You will find a complete example about how to use this extension in the Local namespace.<p> 
 *
 * <div class="alert alert-success">
 *   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Notifications">Notifications demo</a>.
 * </div>
 * 
 * @namespace Cocoon.Notification
 */
Cocoon.define("Cocoon.Notification" , function(extension){

    extension.nativeAvailable = (!!window.ext) && (!!window.ext.IDTK_SRV_NOTIFICATION);

    /**
	 * This namespace represents the Cocoon Notification extension for local notifications.
	 * @namespace Cocoon.Notification.Local
	 * @example 
	 * Cocoon.Notification.Local.on("notification", {
	 *   received: function(userData){
     * 	      console.log("A local notification has been received: " + JSON.stringify(userData));
     *   }
	 * });
	 *
	 * var notificationConfig = {
	 *	message : "Hi, I am a notification",
	 *	soundEnabled : true,
	 *	badgeNumber : 0,
	 *	userData : {"key1" : "value1", "key2": "value2"},
	 *	contentBody : "",
	 *	contentTitle : "",
	 *	date : new Date().valueOf() + 1000
	 * };
	 *	 
	 * var localNotification = Cocoon.Notification.Local.create(notificationConfig);
	 *
	 * Cocoon.Notification.Local.send(localNotification);
	 * Cocoon.Notification.start();
	 */
    extension.Local = {};
    /**
	 * This namespace represents the Cocoon Notification extension for push notifications.
	 * @namespace Cocoon.Notification.Push
	 */
    extension.Push = {};

    /**
	* Returns an object that represents the information of a local notification.
	* @memberOf Cocoon.Notification.Local
	* @function create
	* @example
	* var notificationConfig = {
	*	message : "Hi, I am a notification",
	*	soundEnabled : true,
	*	badgeNumber : 0,
	*	userData : {"key1" : "value1", "key2": "value2"},
	*	contentBody : "",
	*	contentTitle : "",
	*	date : new Date().valueOf() + 5000 // It will be fired in 5 seconds. 
	* };
	*	 
	* var localNotification = Cocoon.Notification.Local.create(notificationConfig);
    * @param {object} 	params - The object itself
	* @param {string} 	params.message The notification message. By default, it will be empty. 
	* @param {boolean} 	params.soundEnabled A flag that indicates if the sound should be enabled for the notification. By default, it will be true. 
	* @param {number} 	params.badgeNumber The number that will appear in the badge of the application icon in the home screen. By default, it will be 0. 
	* @param {object} 	params.userData The JSON data to attached to the notification. By default, it will be empty. 
	* @param {string} 	params.contentBody The body content to be showed in the expanded notification information. By default, it will be empty. 
	* @param {string} 	params.contentTitle The title to be showed in the expanded notification information. By default, it will be empty. 
	* @param {number} 	params.date Time in millisecs from 1970 when the notification will be fired. By default, it will be 1 second (1000).
    */
	extension.Local.create = function(params)
	{
		var properties = {
			message : "",
			soundEnabled : true,
			badgeNumber : 0,
			userData : {},
			contentBody : "",
			contentTitle : "",
			date : new Date().valueOf() + 1000
		};

		var args = Cocoon.clone(properties,params);

		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "createLocalNotification", args);
		}
	};

	/**
	* Returns an object structure that represents the information of a push notification.
	* @memberOf Cocoon.Notification.Push
	* @function create
	* @example 
	* var notificationConfig = {
	*	message : "Hi, I am a notification",
	*	soundEnabled : true, 
	*	badgeNumber : 0, 
	*	userData : {"key1" : "value1", "key2": "value2"},
	*	channels : "", 
	*	expirationTime : new Date().valueOf() +  3600, // The notification will be no longer valid in a hour. 
	*	expirationTimeInterval :  3600 // The notification will be no longer valid in a hour. 
	* };
	*	 
	* var pushNotification = Cocoon.Notification.Push.create(notificationConfig);
    * @param {object} 	params - The object itself
	* @param {string} 	params.message The notification message. By default, it will be empty. 
	* @param {boolean} 	params.soundEnabled A flag that indicates if the sound should be enabled for the notification. By default, it will be true. 
	* @param {number} 	params.badgeNumber The number that will appear in the badge of the application icon in the home screen.By default, it will be 0. 
	* @param {object} 	params.userData The JSON data to attached to the notification. By default, it will be empty. 
	* @param {array} 	params.channels An array containing the channels names this notification will be delivered to. By default, it will be empty. 
	* @param {number} 	params.expirationTime A time in seconds from 1970 when the notification is no longer valid and will not be delivered in case it has not already been delivered. By default, it will be 0.
	* @param {number} 	params.expirationTimeInterval An incremental ammount of time in from now when the notification is no longer valid and will not be delivered in case it has not already been delivered. By default, it will be 0.
    */
	extension.Push.create = function(params)
	{
		var properties = {
		message : "",
		soundEnabled : true,
		badgeNumber : 0,
		userData : {},
		channels : [],
		expirationTime : 0,
		expirationTimeInterval : 0
		};

		for (var prop in properties) {
			if (!params[prop]) {
				params[prop] = properties[prop];
			}
		}

		return params;
	};

	/**
	* Starts processing received notifications. The user must call this method when the game is ready to process notifications. Notifications received before being prepared are stored and processed later.
	* @memberOf Cocoon.Notification
	* @function start
    */
	extension.start = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "start", arguments);
		}
	};

	/**
	* Registers to be able to receive push notifications.
	* @memberOf Cocoon.Notification.Push
	* @function register
    */
	extension.Push.register = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "registerForPushNotifications", arguments, true);
		}
	};

	/**
	* Unregisters from receiving push notifications.
	* @memberOf Cocoon.Notification.Push
	* @function unregister
    */
	extension.Push.unregister = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "unregisterForPushNotifications", arguments, true);
		}
	};

	/**
	* Cancels the local notification with Id provided.
	* The last sent local notification will be remove from the notifications bar.
	* @memberOf Cocoon.Notification.Local
	* @function cancel
    */
	extension.Local.cancel = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "cancelLocalNotification", arguments);
		}
	};

	/**
	* Cancels the last sent local notification.
	* The last sent local notification will be remove from the notifications bar.
	* @memberOf Cocoon.Notification.Local
	* @function cancelLast
    */
	extension.Local.cancelLast = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "cancelLocalNotification", arguments, true);
		}
	};

	/**
	* Cancels all sent local notifications.
	* All the notifications will ve removed from the notifications bar.
	* @memberOf Cocoon.Notification.Local
	* @function cancelAllNotifications
    */
	extension.Local.cancelAllNotifications = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "cancelAllLocalNotifications", arguments);
		}
	};

	/**
	* Sends a local notification.
	* @memberOf Cocoon.Notification.Local
	* @function send
    */
	extension.Local.send = function(localNotification)
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "sendLocalNotification", arguments, true);
		}
	};

	/**
	* Subscribes to a channel in order to receive notifications targeted to that channel.
	* @memberOf Cocoon.Notification
	* @function subscribe
    */
	extension.subscribe = function(channel)
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "subscribe", arguments, true);
		}
	};

	/**
	* Unsubscribes from a channel in order to stop receiving notifications targeted to it.
	* @memberOf Cocoon.Notification
	* @function unsubscribe
    */
	extension.unsubscribe = function(channel)
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "unsubscribe", arguments, true);
		}
	};

	/**
	* Sends a push notification.
	* @memberOf Cocoon.Notification.Push
	* @function send
    */
	extension.Push.send = function(pushNotification)
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "sendPushNotification", arguments, true);
		}
	};

	/**
	* (iOS only) Sets the badge number for this application.
	* This is useful if you want to modify the badge number set by a notification.
	* @memberOf Cocoon.Notification
	* @function setBadgeNumber
    */
	extension.setBadgeNumber = function(badgeNumber)
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "setBadgeNumber", arguments);
		}
	};

	/**
	* (iOS only) Returns the current badge number.
	* @memberOf Cocoon.Notification
	* @function getBadgeNumber
    */
	extension.getBadgeNumber = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "getBadgeNumber", arguments);
		}
	};

	/**
	* Returns the last received user data from a Local notification.
	* @memberOf Cocoon.Notification.Local
	* @function getLastNotificationData
    */
	extension.Local.getLastNotificationData = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "getLastReceivedLocalNotificationData", arguments);
		}
	};

	/**
	* Returns the last received user data from a Push notification.
	* @memberOf Cocoon.Notification.Push
	* @function getLastNotificationData
    */
	extension.Push.getLastNotificationData = function()
	{
		if (Cocoon.Notification.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_NOTIFICATION", "getLastReceivedPushNotificationData", arguments);
		}
	};

	extension.onRegisterForPushNotificationsSucceed = new Cocoon.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationServiceRegistered");

	extension.onUnregisterForPushNotificationsSucceed = new Cocoon.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationServiceUnregistered");

	extension.onRegisterForPushNotificationsFailed = new Cocoon.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationServiceFailedToRegister");

	extension.onPushNotificationReceived = new Cocoon.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationReceived");

	extension.onLocalNotificationReceived = new Cocoon.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "localNotificationReceived");

	extension.onPushNotificationDeliverySucceed = new Cocoon.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationSuccessfullyDelivered");

	extension.onPushNotificationDeliveryFailed = new Cocoon.EventHandler("IDTK_SRV_NOTIFICATION", "Notification", "pushNotificationDeliveryError");

	var signal = new Cocoon.Signal.createSignal();

	/**
	* Allows to listen  to events called when a local notification is received.
	* - The callback 'received' receives a parameter with the userData of the received notification when a local notification is received.
    * @event On received for local notifications callback  
    * @memberof Cocoon.Notification.Local
	* @example
	* Cocoon.Notification.Local.on("notification", {
    *	received : function(userData){
    * 	 	console.log("A local notification has been received: " + JSON.stringify(userData));
    *	}
	* });
    */
    signal.register("notification", {
    	received : extension.onLocalNotificationReceived
    });

	extension.Local.on = signal.expose();

	var signal = new Cocoon.Signal.createSignal();

	/**
	* Allows to listen to events called about the registration for push notification.
	* - The callback 'success' does not receive any parameter when the registration for push notification succeeds.
	* - The callback 'unregister' does not receive any parameter when the unregistration for push notifications succeeds.
	* - The callback 'error' receives a parameter with error information when the registration for push notifications fails.
    * @event On register for push notifications callbacks
    * @memberof Cocoon.Notification.Push
    * @example
	* Cocoon.Notification.Push.on("register", {
    * 	success : function(){ ... }
    *	unregister : function(){ ... }
    *	error : function(error){ ... }
	* });
    */
    signal.register("register", {
    	success : extension.onRegisterForPushNotificationsSucceed,
    	unregister : extension.onUnregisterForPushNotificationsSucceed,
    	error : extension.onRegisterForPushNotificationsFailed
    });

	/**
	* Allows to listen to events called when a push notification  is received.
	* - The callback 'received' receives a parameter with the userData of the received notification when a push notification is received.
    * @event On received for push notifications callback
    * @memberof Cocoon.Notification.Push
	* @example
	* Cocoon.Notification.Push.on("notification",{
	*	received : function(userData){
    * 		console.log("A push notification has been received: " + JSON.stringify(userData));
    *	}
	* });
    */
    signal.register("notification", {
    	received : extension.onPushNotificationReceived,
    });

	/**
	* Allows to listen to events called about the delivery proccess.
	* - The callback 'success' receives a parameter with the notificationId of the delivered notification when a notification is successfully delivered.
	* - The callback 'error' receives a parameter with error information when the delivery of a push notification fails.
    * @event On deliver for push notifications callbacks
    * @memberof Cocoon.Notification.Push
	* @example 
	* Cocoon.Notification.Push.on("deliver", {
    * 	success : function(notificationId){ ... }
    *	error : function(error){ ... }
	* });
    */
    signal.register("deliver", {
    	success : extension.onPushNotificationDeliverySucceed,
    	error : extension.onPushNotificationDeliveryFailed
    });

	extension.Push.on = signal.expose();

    return extension;

});