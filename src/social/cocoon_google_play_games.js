/**
 * This namespace represents all the basic functionalities available in the CocoonJS extension API.
 *
 * <div class="alert alert-success">
 *   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/Google%20Play%20Games">Google Play Games demo</a>.
 *</div>
 *
 * <div class="alert alert-warning">
 *    <strong>Warning!</strong> This JavaScript extension requires some configuration parameters on the <a href="https://ludei.zendesk.com/hc/en-us">cloud compiler</a>!
 * </div>
 * The following example shows the full process of how to publish a message using GooglePlay extension.The following image illustrates how the result should look like.  
 * <div><br/><img src="img/cocoon-socialgp-publish3.png" heigh="50%" width="55%"/> </div>
 * @namespace Cocoon.Social.GooglePlayGames
 * @example
 * var gp =  Cocoon.Social.GooglePlayGames;
 *
 * var iosClientId = "Your iOS Client ID"; //clientId is not required in android
 * var webClientId = "Your Web Client ID";
 *
 * gp.init({
 *     clientId: webClientId,
 *     defaultLeaderboard:"Your leaderboard ID"
 * });
 *
 * var socialService = gp.getSocialInterface();
 *     
 * function loginGP() {
 *  if (!socialService.isLoggedIn()) {
 *      socialService.login(function(loggedIn, error) {
 *          if (error) {
 *              console.error("login error: " + error.message);
 *          }
 *          else if (loggedIn) {
 *              var message = new Cocoon.Social.Message(
 *                  "Hello from the CocoonJS Launcher App! Are you a HTML5 game developer? Come and check out CocoonJS!",
 *                  "Ludei - We love HTML5 games!");
 *   
 *              socialService.publishMessageWithDialog(message, function(error) {
 *                  if (error) {
 *                      console.error("Error publishing message: " + error.message);
 *                  }
 *              });
 *          }
 *          else {
 *              console.log("login cancelled");
 *          }
 *      });
 *  }
 * }
 *
 * loginGP();  
 *
 */
Cocoon.define("Cocoon.Social" , function(extension){

    extension.GooglePlayGamesExtension = function (){
        this.nativeExtensionName = "IDTK_SRV_GOOGLE_PLAY_GAMES";
        this.extensionName = "Social.GooglePlayGames";
        this.nativeAvailable =  Cocoon.nativeAvailable && typeof window.ext[this.nativeExtensionName] !== 'undefined';

        this.auth = new Cocoon.Social.GooglePlayGamesAuthExtension(this);
        this.client = new Cocoon.Social.GooglePlayGamesClientExtension(this);
        this.defaultScopes = ["https://www.googleapis.com/auth/games","https://www.googleapis.com/auth/plus.login"];
        this.gamesAPI = "/games/v1";
        this.plusAPI = "/plus/v1";

        this.onSessionChanged = new Cocoon.EventHandler(this.nativeExtensionName, this.extensionName, "onSessionChanged");

        Cocoon.Social.GooglePlayGames = this; //the object it's being created but the addEventListener needs it now
        var me = this;
        this.onSessionChanged.addEventListener(function(session, error) {
            me.token = fromSessionToAuthTokenObject(session,error);
            if (session && session.access_token) {
                //fetch user data
                me.client.request({path: me.gamesAPI + "/players/me", callback: function(response) {
                    me.currentPlayer = response;
                }});
            }
        });

        return this;
    };

    extension.GooglePlayGamesExtension.prototype = {

        token: null,
        settings: {},
        socialService: null,
        currentPlayer: null,
        initialized: false,

        auth: null,
        client: null,

        /**
         * Initializes the service and tries to restore the last session.
         * @memberof Cocoon.Social.GooglePlayGames
         * @function init
         * @param {Object} params Initialization options.
         * @param {string} params.clientId The application clientID. Omit if its already provided in the native application via cloud configuration.
         * @param {string} params.defaultLeaderboard The default leaderboard ID. You can omit it if you specify the leaderboardID in all the score queries or submits.
         * @param {boolean} params.showAchievementNotifications Enables or disables the native view notifications when an achievement is unlocked.
         */
        init: function(params) {
            if (!params || typeof params !== 'object')
                throw "Invalid params argument";
            this.settings = params;
            this.initialized = true;
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "init", [this.settings.clientId], true);
            }
            else {

                var me = this;
                var initWebAPi = function() {
                    gapi.auth.authorize({immediate: true, scope: me.defaultScopes, client_id:me.settings.clientId},function(response) {
                        me.token = response;
                        if (response && response.access_token) {
                            me.onSessionChanged.notifyEventListeners(response);
                        }
                    })
                }

                if (!window.gapi) {
                    window.onGapiLoadCallback = function() {
                        //initialization timeout recommended by google to avoid some race conditions
                        window.setTimeout(initWebAPi, 1);
                    }
                    var script = document.createElement("script");
                    script.src = "https://apis.google.com/js/client.js?onload=onGapiLoadCallback";
                    document.getElementsByTagName('head')[0].appendChild(script);
                }
                else {
                    initWebAPi();
                }
            }
        },

        /**
         * Returns a Cocoon SocialGaming interface for the Google Play Games Extension.
         * You can use the Google Play Games extension in two ways, with the official SDK API equivalent or with the CocoonJS Social API abstraction.
         * @memberof Cocoon.Social.GooglePlayGames
         * @function getSocialInterface         
         * @see Cocoon.Social.Interface
         * @returns {Cocoon.Social.Interface}
         */
        getSocialInterface: function() {

            if (!this.initialized) {
                throw "You must call init() before getting the Social Interface";
            }
            if (!this.socialService) {
                this.socialService = new Cocoon.Social.SocialGamingServiceGooglePlayGames(this);
            }
            return this.socialService;
        },

        /**
         * Returns a Cocoon Multiplayer interface for the Game Center Extension.
         * @memberof Cocoon.Social.GooglePlayGames
         * @function getMultiplayerInterface         
         * @returns {Cocoon.Multiplayer.MultiplayerService}
         */
        getMultiplayerInterface: function() {
            return Cocoon.Multiplayer.GooglePlayGames;
        },

        /**
         * Return a Cocoon Multiplayer interface for the Game Center Extension.
         * @memberof Cocoon.Social.GooglePlayGames
         * @function getMultiplayerInterface         
         * @returns {Cocoon.Multiplayer.MultiplayerService}
         * @private 
         * @deprecated
         */        
        share: function() {

            window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;

        }

    };

    extension.GooglePlayGamesAuthExtension = function(extension) {
        this.extension = extension;
        return this;
    }

    extension.GooglePlayGamesAuthExtension.prototype = {
        /**
         * Initiates the OAuth 2.0 authorization process.
         * The browser displays a popup window prompting the user authenticate and authorize.
         * After the user authorizes, the popup closes and the callback function fires.
         * @param {object} params A key/value map of parameters for the request (client_id, inmediate, response_type, scope)
         * @param {function} callback The function to call once the login process is complete. The function takes an OAuth 2.0 token object as its only parameter.
         * @private
         */

        authorize: function(params, callback) {
            var me = this;
            if (this.extension.nativeAvailable) {
                Cocoon.callNative(this.extension.nativeExtensionName, "authorize", [params, function(response, error) {
                    me.extension.token = fromSessionToAuthTokenObject(response,error);
                    if (callback) {
                        callback(me.extension.token);
                    }
                }], true);
            }
            else {
                gapi.auth.authorize(params, function(response){
                    me.extension.token = response;
                    me.extension.onSessionChanged.notifyEventListeners(response, response ? response.error : null);
                    if (callback)
                        callback(response);
                });
            }
        },

        /**
         * Logs the user out of the application
         * @param callback
         */
        disconnect: function(callback) {

            if (this.extension.nativeAvailable) {
                Cocoon.callNative(this.extension.nativeExtensionName, "disconnect", [callback], true);
            }
            else {
                //TODO
                if (callback)
                    callback({error: "Not implemented yet"});
            }
        },

        /**
         *  Initializes the authorization feature. Call this when the client loads to prevent popup blockers from blocking the auth window on gapi.auth.authorize calls.
         *  @param {Function} callback A callback to execute when the auth feature is ready to make authorization calls
         */
        init: function(callback) {

            if (this.extension.nativeAvailable) {
                callback();
            }
            else {
                gapi.auth.init(callback);
            }
        },

        /**
         * Retrieves the OAuth 2.0 token for the application.
         */
        getToken: function() {
            if (this.extension.nativeAvailable) {
                return this.extension.token;
            }
            else {
                return gapi.auth.getToken();
            }
        },
        /*
         * Retrieves the OAuth 2.0 token for the application.
         */

        setToken: function(token) {
            if (this.extension.nativeAvailable) {
                this.extension.token = token;
            }
            else {
                gapi.auth.setToken(token);
            }
        }
    }


    extension.GooglePlayGamesClientExtension = function(extension) {
        this.extension = extension;
        return this;
    }

    extension.GooglePlayGamesClientExtension.prototype = {

        /**
         * Sets the API key for the application, which can be found in the Developer Console. Some APIs require this to be set in order to work.
         * @param apiKey The API key to set.
         */
        setApiKey: function(apiKey) {
            if (this.extension.nativeAvailable) {
                Cocoon.callNative(this.extension.nativeExtensionName, "setApiKey", [apiKey],true);
            }
            else {
                gapi.client.setApiKey(apiKey);
            }
        },

        /**
         * Creates a HTTP request for making RESTful requests.
         * @param {object} args (More info: https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientrequest)
         * @return {object} If no callback is supplied, a request object is returned. The request can then be executed using gapi.client.HttpRequest.execute(callback).
         */
        request: function(args) {
            if (this.extension.nativeAvailable) {
                if (args.callback) {
                    Cocoon.callNative(this.extension.nativeExtensionName, "request", [args, function(response,error){
                        var result = response;
                        if (error) {
                            result = response || {};
                            result.error = error;
                        }
                        args.callback(result);
                    }],true);
                    return null;
                }
                else {
                    var me = this;
                    //return a function to mimic the HttpRequest class
                    var httpRequest =  {
                        execute: function(callback) {
                            Cocoon.callNative(me.extension.nativeExtensionName, "request", [args, function(response, error){
                                var result = response;
                                if (error) {
                                    result = response || {};
                                    result.error = error;
                                }
                                callback(result);
                            }],true);
                        }
                    };
                    return httpRequest;
                }
            }
            else {
                return gapi.client.request(args);
            }
        }
    }


    extension.GooglePlayGames = new Cocoon.Social.GooglePlayGamesExtension();

    /**
     * @ignore
     */
    function fromSessionToAuthTokenObject(response, error) {
        var obj = response || {};
        return {
            access_token: response.access_token,
            state: response.state,
            error: error,
            expires_in: response.expirationDate ? response.expirationDate - Date.now() : 0,
            player_id: response.playerId
        }
    }


    extension.SocialGamingServiceGooglePlayGames = function (apiObject) {
        Cocoon.Social.SocialGamingServiceGooglePlayGames.superclass.constructor.call(this);
        this.gapi = apiObject;
        var me = this;

        this.gapi.onSessionChanged.addEventListener(function(session){
            var obj = session || {};
            me.onLoginStatusChanged.notifyEventListeners(!!obj.access_token, obj.error);
        });

        return this;
    }

    extension.SocialGamingServiceGooglePlayGames.prototype =  {

        isLoggedIn: function() {
            return (this.gapi.token && this.gapi.token.access_token) ? true: false;
        },
        login : function(callback) {
            var me = this;
            this.gapi.auth.authorize({client_id:this.gapi.settings.clientId, scope: this.gapi.defaultScopes}, function(response) {
                if (callback) {
                    callback(me.isLoggedIn(),response.error);
                }
            });
        },
        logout: function(callback) {
            this.gapi.auth.disconnect(callback);
        },
        getLoggedInUser : function() {
            return this.gapi.currentPlayer ? fromGPUserToCocoonUser(this.gapi.currentPlayer) : null;
        },
        requestUser: function(callback, userId) {
            var playerId = userId || "me";
            this.gapi.client.request({path: this.gapi.gamesAPI + "/players/" + playerId, callback: function(response) {
                var user = response && !response.error ? fromGPPlayerToCocoonUser(response) : null;
                callback(user, response.error);
            }});
        },
        requestUserImage: function(callback, userID, imageSize) {
            this.requestUser(function(user, error){
                if (user && user.userImage) {
                    var pixelSize = fromImageSizeToGPSize(imageSize || Cocoon.Social.ImageSize.MEDIUM);
                    if (user.userImage.indexOf("sz=") ===  -1) {
                        user.userImage+="?sz=" + pixelSize;
                    }
                    else {
                        user.userImage = user.userImage.replace(/sz=\d+/g,"sz=" + pixelSize);
                    }
                }
                callback(user ? user.userImage : null, error);
            }, userID);

        },
        requestFriends: function(callback, userId) {
            var params = { orderBy: "best"};
            var playerId = userId || "me";
            this.gapi.client.request({path: this.gapi.plusAPI + "/people/" + playerId + "/people/visible", params: params, callback: function(response) {
                if (response && !response.error) {
                    var friends = [];
                    for (var i = 0; i< response.items.length; ++i) {
                        friends.push(fromGPPersonToCocoonUser(response.items[i]));
                    }
                    callback(friends);
                }
                else {
                    callback([], response ? response.error : null);
                }
            }});
        },

        publishMessage: function(message, callback) {
            if (callback)
                callback("Not supported... use publishMessageWithDialog method instead");
        },

        publishMessageWithDialog: function(message, callback) {

            if (this.gapi.nativeAvailable) {
                var params = {
                    prefilledText: message.message,
                    mediaUrl: message.mediaURL,
                    mediaTitle: message.linkCaption,
                    mediaDescription: message.linkText,
                    url: message.linkURL
                }

                Cocoon.callNative(this.gapi.nativeExtensionName, "shareMessage", [params, callback], true)
            }
            else {

                var me = this;
                var share = function() {
                    var options = {
                        contenturl: 'https://plus.google.com/pages/',
                        contentdeeplinkid: '/pages',
                        clientid: me.gapi.settings.clientId,
                        cookiepolicy: 'single_host_origin',
                        prefilltext: message.message,
                        calltoactionlabel: 'CREATE',
                        calltoactionurl: 'http://plus.google.com/pages/create',
                        calltoactiondeeplinkid: '/pages/create'
                    };

                    gapi.interactivepost.render('sharePost', options);
                }

                if (!gapi.interactivepost) {
                    var script = document.createElement('script'); script.type = 'text/javascript'; script.async = true;
                    script.src = 'https://apis.google.com/js/plusone.js';
                    script.onload = function() {
                        share();
                    }
                    document.getElementsByTagName('head')[0].appendChild(script);
                }
                else {
                    share();
                }
            }
        },

        requestScore: function(callback, params) {
            params = params || {};
            var playerId = params.userID || "me";
            var leaderboardID = params.leaderboardID || this.gapi.settings.defaultLeaderboard;
            if (!leaderboardID)
                throw "leaderboardID not provided in the params. You can also set the default leaderboard in the init method";

            this.gapi.client.request({path: this.gapi.gamesAPI + "/players/" + playerId + "/leaderboards/" + leaderboardID + "/scores/ALL_TIME", callback: function(response) {
                if (response && response.error) {
                    callback(null, response.error)
                }
                else if (response && response.items && response.items.length > 0) {
                    var item = response.items[0];
                    var data = new Cocoon.Social.Score(playerId, item.scoreValue,"","", item.leaderboard_id);
                    callback(data, null);
                }
                else {
                    //No score has been submitted yet for the user
                    callback(null,null);
                }
            }});

        },

        submitScore: function(score, callback, params) {
            params = params || {};
            var leaderboardID = params.leaderboardID || this.gapi.settings.defaultLeaderboard;
            if (!leaderboardID)
                throw "leaderboardID not provided in the params. You can also set the default leaderboard in the init method";


            this.gapi.client.request({path: this.gapi.gamesAPI + "/leaderboards/" + leaderboardID + "/scores",
                                      method: "POST", params:{score: score}, callback: function(response) {
                    if (callback) {
                        callback(response ? response.error : null);
                    }
            }});

        },

        showLeaderboard : function(callback, params) {
            params = params || {};
            var leaderboardID = params.leaderboardID || this.gapi.settings.defaultLeaderboard;
            if (!leaderboardID)
                throw "leaderboardID not provided in the params. You can also set the default leaderboard in the init method";

            var ios = /(iPad|iPhone|iPod)/ig.test( navigator.userAgent );
            if (!ios && this.gapi.nativeAvailable) {
                var timeScope = params.timeScope || 0;
                Cocoon.callNative(this.gapi.nativeExtensionName, "showLeaderboard", [leaderboardID, timeScope, callback], true);
            }
            else {
                if (!this._leaderboardsTemplate)
                    throw "Please, provide a html template for leaderboards with the setTemplates method";
                var dialog = new Cocoon.Widget.WebDialog();
                var callbackSent = false;
                dialog.show(this._leaderboardsTemplate, function(error) {
                    dialog.closed = true;
                    if (!callbackSent && callback)
                        callback(error);
                });
                var me = this;
                var collection = params.friends ? "SOCIAL" : "PUBLIC";
                var timeSpan = "ALL_TIME";
                if (params.timeScope === Cocoon.Social.TimeScope.WEEK) {
                    timeSpan = "WEEKLY";
                }
                else if (params.timeScope === Cocoon.Social.TimeScope.TODAY) {
                    timeSpan = "DAILY";
                }
                this.gapi.client.request({path: this.gapi.gamesAPI + "/leaderboards/" + leaderboardID + "/window/" + collection,
                    method: "GET", params:{timeSpan: timeSpan}, callback: function(response) {
                        if (dialog.closed)
                            return;
                        if (response.error) {
                            if (callback) {
                                callbackSent = true;
                                callback(response.error);
                                dialog.close();
                            }
                            return;
                        }
                        var scores = [];
                        var items = [];
                        if (response && response.items) {
                            items = response.items.slice(0);
                        }
                        if (response && response.playerScore) {
                            items.push(response.playerScore);
                        }
                        for (var i = 0; i< items.length; ++i) {
                            var item = items[i];
                            var score = fromGPScoreToCocoonScore(item, leaderboardID);
                            score.imageURL+="?sz=50";
                            score.position = item.scoreRank || i + 1;
                            score.me = false;
                            scores.push(score);
                        }
                        var js = "addScores(" + JSON.stringify(scores) + ")";
                        dialog.eval(js);
                    }});
            }
        },

        //internal utility function
        prepareAchievements: function(reload, callback) {
            if (!this._cachedAchievements || reload) {
                var me = this;
                this.gapi.client.request({path: this.gapi.gamesAPI + "/achievements", callback: function(response) {
                    if (response && !response.error) {
                        var achievements = [];
                        if (response && response.items) {
                            for (var i = 0; i < response.items.length; i++) {
                                achievements.push(fromGPAchievementToCocoonAchievement(response.items[i]))
                            }
                        }
                        me.setCachedAchievements(achievements);
                        callback(achievements, null);
                    }
                    else {
                        callback([], response ? response.error : null);
                    }
                }});
            }
            else {
                callback(this._cachedAchievements, null);
            }
        },

        requestAllAchievements : function(callback) {
            this.prepareAchievements(true, callback);
        },

        requestAchievements : function(callback, userID) {
            var me = this;
            this.prepareAchievements(false, function(allAchievements, error){
                if (error) {
                    callback([], error);
                    return;
                }
                var playerID = userID || "me";
                me.gapi.client.request({path: me.gapi.gamesAPI + "/players/" + playerID + "/achievements",
                                        params: {state: "UNLOCKED"}, callback: function(response) {
                    if (response && !response.error) {
                        var achievements = [];
                        if (response.items) {
                            for (var i = 0; i < response.items.length; i++) {
                                var ach = me.findAchievement(response.items[i].id);
                                if (ach)
                                    achievements.push(ach);
                            }
                        }
                        callback(achievements, null);
                    }
                    else {
                        callback([], response ? response.error : null);
                    }
                }});

            });
        },
        submitAchievement: function(achievementID, callback) {
            if (achievementID === null || typeof achievementID === 'undefined')
                throw "No achievementID specified";
            var achID = this.translateAchievementID(achievementID);
            if (this.gapi.nativeAvailable) {
                //native API allows to show a native notification view. (REST API doesn't)
                var showNotification = !!this.gapi.settings.showAchievementNotifications;
                Cocoon.callNative(this.gapi.nativeExtensionName, "unlockAchievement", [achID, showNotification, callback], true);
            }
            else {
                //REST api
                this.gapi.client.request({path: this.gapi.gamesAPI + "/achievements/" + achID + "/unlock",
                    method: "POST", callback: function(response) {
                        if (callback) {
                            callback(response ? response.error : null);
                        }
                    }});
            }
        },
        resetAchievements : function(callback) {
            this.gapi.client.request({path: "/games/v1management/achievements/reset",
                method: "POST", callback: function(response) {
                    if (callback) {
                        callback(response ? response.error : null);
                    }
                }});
        },
        showAchievements : function(callback) {
            var ios = /(iPad|iPhone|iPod)/ig.test( navigator.userAgent );
            if (!ios && this.gapi.nativeAvailable) {
                Cocoon.callNative(this.gapi.nativeExtensionName, "showAchievements", [callback], true);
            }
            else {
                Cocoon.Social.SocialGamingServiceGooglePlayGames.superclass.showAchievements.call(this);
            }
        }
    }

    Cocoon.extend(Cocoon.Social.SocialGamingServiceGooglePlayGames, Cocoon.Social.SocialGamingService);


    /**
     *@ignore
     */
    function fromGPPlayerToCocoonUser (gpPlayer) {
        return new Cocoon.Social.User (gpPlayer.playerId, gpPlayer.displayName, gpPlayer.avatarImageUrl);
    }
    /**
     *@ignore
     */
    function fromGPPersonToCocoonUser (gpUser) {
        var avatar = gpUser.image ? gpUser.image.url : "";
        avatar = avatar.replace(/sz=\d+/g,"sz=100");
        return new Cocoon.Social.User (gpUser.id, gpUser.displayName, avatar);
    }
    /**
     *@ignore
     */
    function fromImageSizeToGPSize (imageSize) {
        if (imageSize === Cocoon.Social.ImageSize.THUMB) {
            return 100;
        }
        else if (imageSize === Cocoon.Social.ImageSize.MEDIUM) {
            return 200;
        }
        else if (imageSize === Cocoon.Social.ImageSize.LARGE) {
            return 512;
        }
    }
    /**
     *@ignore
     */
    function fromGPAchievementToCocoonAchievement(gpItem) {
        var result = new Cocoon.Social.Achievement (
            gpItem.id,
            gpItem.name,
            gpItem.description,
            gpItem.revealedIconUrl,
            0
        );
        result.gpAchievementData = gpItem;
        return result;
    }
    /**
     *@ignore
     */
    function fromGPScoreToCocoonScore(gpItem, leaderboardID) {
        return new Cocoon.Social.Score(gpItem.player.playerId, gpItem.scoreValue, gpItem.player.displayName, gpItem.player.avatarImageUrl, leaderboardID);
    }
    
    return extension;
});
