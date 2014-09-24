/**
 * This namespace provides an abstraction API for all the Social Services.
 * Each Social service has it's own official API but can also be used within this API interface.<br/>
 * Note that this javascript extension can be used to manage <b>Leaderboards and Achievements.</b> <br/>
 * In order to understand how to use the social javascript extension refer to the social service you would like to to use:
 * - <a href="Cocoon.Social.Facebook.html">Facebook</a>
 * - <a href="Cocoon.Social.GooglePlayGames.html">Google Play Games</a>
 * - <a href="Cocoon.Social.GameCenter.html">Game Center</a>
 * @namespace Cocoon.Social
 */
Cocoon.define("Cocoon.Social" , function(extension){

    /**
    * This interface provides an abstraction API for all the Social Services, this is an interface and never should be call directly. 
    * Each Social service has it's own official API but can also be used within this API interface. In order to use this 
    * interface you should call the method getSocialInterface(); that is available in the following classes:
    * - <a href="Cocoon.Social.Facebook.html">Facebook</a>
    * - <a href="Cocoon.Social.GooglePlayGames.html">Google Play Games</a>
    * - <a href="Cocoon.Social.GameCenter.html">Game Center</a>
    * @namespace Cocoon.Social.Interface
    * @example 
    * // You can use one of these 3 services with the same API.
    * // In this example we'll use Facebook
    * var service = Cocoon.Social.Facebook;
    * //var service = Cocoon.Social.GameCenter;
    * //var service = Cocoon.Social.GooglePlayGames;
    * 
    * // Each service has it's own init method,
    * // Refer to each service API to know how to initialize it.
    * service.init({
    *     appId: "XXXXXXXXXXXXXXXXXXXXX",
    *     channelUrl: "//connect.facebook.net/en_US/all.js"
    * });
    * 
    * var socialService = service.getSocialInterface();
    *  
    * function loginFacebook() {
    *   if (!socialService.isLoggedIn()) {
    *       socialService.login(function(loggedIn, error) {
    *           if (error) {
    *               console.error("login error: " + error.message);
    *           }
    *           else if (loggedIn) {
    *               var message = new Cocoon.Social.Message(
    *                   "Hello from the CocoonJS Launcher App! Are you a HTML5 game developer? Come and check out CocoonJS!",
    *                   "https://cocoonjsadmin.ludei.com/static/images/cocoon_logo.png",
    *                   "http://ludei.com",
    *                   "Ludei & CocoonJS",
    *                   "We love HTML5 games!");
    *
    *               socialService.publishMessageWithDialog(message, function(error) {
    *                   if (error) {
    *                       console.error("Error publishing message: " + error.message);
    *                   }
    *               });
    *            }
    *            else {
    *               console.log("login cancelled");
    *            }
    *       });
    *   }
    * }   
    * loginFacebook(); 
    */
    extension.Interface = function() {

        this.onLoginStatusChanged = new Cocoon.EventHandler("", "dummy", "onLoginStatusChanged");
        
        var signal = new Cocoon.Signal.createSignal();
        signal.register("loginStatusChanged", this.onLoginStatusChanged);
        this.on = signal.expose();

        return this;
    };

    extension.Interface.prototype = {
     
        /**
        * Checks if the user is logged in.
        * @return {boolean} true if the user is still logged in, false otherwise.
        * @function isLoggedIn
        * @memberOf Cocoon.Social.Interface
        */
        isLoggedIn: function() {
             return false;
        },

        /**
        * Authenticates the user.
        * @function login     
        * @memberOf Cocoon.Social.Interface
        * @param {function} callback The callback function. Response params: loggedIn(boolean) and error
        * @example
        * var fb = Cocoon.Social.Facebook;
        *
        * fb.init({
        *     appId: "XXXXXXXXXXXXXXXXXXXXX",
        *     channelUrl: "//connect.facebook.net/en_US/all.js"
        * });
        * 
        * var socialService = fb.getSocialInterface();
        * var loggedIn = socialService.isLoggedIn();
        *
        * function loginFacebook() {
        *   if (!socialService.isLoggedIn()) {
        *       socialService.login(function(loggedIn, error) {
        *            if (error) {
        *               console.error("login error: " + error.message);
        *            }
        *            else if (loggedIn) {
        *               console.log("login succeeded");
        *            }
        *            else {
        *               console.log("login cancelled");
        *            }
        *       });
        *   }
        * }
        * loginFacebook();
        */
        login : function(callback) {
            if (callback)
                callback(false, {message:"Not implemented!"});
        },

        /**
        * Logs the user out of your application.
        * @function logout     
        * @memberOf Cocoon.Social.Interface        
        * @param {function} [callback] The callback function. Response params: error.
        * @example
        * var fb = Cocoon.Social.Facebook;
        *
        * fb.init({
        *     appId: "XXXXXXXXXXXXXXXXXXXXX",
        *     channelUrl: "//connect.facebook.net/en_US/all.js"
        * });
        * 
        * var socialService = fb.getSocialInterface();
        *
        * socialService.logout(function(error){
        *
        * });
        */
        logout: function(callback) {
            if (callback)
                callback({message:"Not implemented!"});
        },

        /**
        * Returns the information of the currently logged in user.
        * @function getLoggedInUser     
        * @memberOf Cocoon.Social.Interface             
        * @return {@link Cocoon.Social.User}
        */
        getLoggedInUser : function() {
            return null;
        },

        /**
        * Checks if the current logged in user has publish permissions.
        * @function hasPublishPermissions     
        * @memberOf Cocoon.Social.Interface          
        * @param callback The callback function. Response params: permissions granted and error
        */
        hasPublishPermissions: function(callback) {
            callback(true);
        },

        /**
        * Requests publish permissions for the current logged in user.
        * @function requestPublishPermissions     
        * @memberOf Cocoon.Social.Interface            
        * @param callback The callback function.  It receives the following parameters: granted and error
        */
        requestPublishPermissions: function(callback) {
            if (callback)
                callback(true, null);
        },

        /**
        * Retrieves user information for a specific user ID.
        * @function requestUser     
        * @memberOf Cocoon.Social.Interface       
        * @param {function} callback - The callback function.  It receives the following parameters: 
        * - {@link Cocoon.Social.User}.
        * - Error.
        * @param {string} userID - The id of the user to retrieve the information from. If no userID is specified, the currently logged in user is assumed.
        * @example
        * var fb = Cocoon.Social.Facebook;
        *
        * fb.init({
        *     appId: "XXXXXXXXXXXXXXXXXXXXX",
        *     channelUrl: "//connect.facebook.net/en_US/all.js"
        * });
        * 
        * var socialService = fb.getSocialInterface();
        * var loggedIn = socialService.isLoggedIn();
        * 
        * if (loggedIn) {
        *   socialService.requestUser(function(user, error) {
        *        if (error) {
        *            console.error("requestUser error: " + error.message);
        *       }
        *       else {
        *           console.log(user.userName);
        *        }
        *   }, userID);
        * }
        */
        requestUser: function(callback, userID) {
            callback(null, {message:"Not implemented!"});
        },
        
        /**
        * Requests to retrieve the profile image of a user.
        * @function requestUserImage     
        * @memberOf Cocoon.Social.Interface         
        * @param {function} callback The callback function. It receives the following parameters: 
        * - ImageURL. 
        * - Error.
        * @param {string} userID The id of the user to get the image for. If no userID is specified, the currently logged user is used.
        * @param {Cocoon.Social.ImageSize} imageSize The desired size of the image. Default value: SMALL.
        */        
        requestUserImage: function(callback, userID, imageSize) {
            callback("", {message:"Not implemented!"})
        },

        /**
        * Retrieves user friends for a specific user ID.
        * @function requestFriends     
        * @memberOf Cocoon.Social.Interface          
        * @param {function} callback - The callback function. It receives the following parameters: 
        * - Array of {@link Cocoon.Social.User}. 
        * - Error.
        * @param {string} userID - The id of the user to retrieve the information from. If no userID is specified, the currently logged in user is assumed.
        * @example
        * var fb = Cocoon.Social.Facebook;
        *
        * fb.init({
        *     appId: "XXXXXXXXXXXXXXXXXXXXX",
        *     channelUrl: "//connect.facebook.net/en_US/all.js"
        * });
        * 
        * var socialService = fb.getSocialInterface();
        *
        * var loggedIn = socialService.isLoggedIn();
        * 
        * if (loggedIn) {
        *   socialService.requestFriends(function(friends, error) {
        *        if (error) {
        *            console.error("requestFriends error: " + error.message);
        *       }
        *       else {
        *          console.log("You have " + friends.length + " friends.");
        *        }
        *   });
        * }
        */
        requestFriends: function(callback, userID) {
            callback([], {message:"Not implemented!"});
        },

        /**
        * Shares a message without the intervention of the user.
        * This action might require publish permissions. If the user has not publish permissions they are automatically requested.
        * @function publishMessage   
        * @memberOf Cocoon.Social.Interface            
        * @param {Cocoon.Social.Message} message A object representing the information to be published.
        * @param {function} [callback] The callback function.  It receives the following parameters: error.
        * @example
        * var fb = Cocoon.Social.Facebook;
        *
        * fb.init({
        *     appId: "XXXXXXXXXXXXXXXXXXXXX",
        *     channelUrl: "//connect.facebook.net/en_US/all.js"
        * });
        * 
        * var socialService = fb.getSocialInterface();
        * var loggedIn = socialService.isLoggedIn();
        * 
        * if (loggedIn) {
        *     var message = new Cocoon.Social.Message(
        *     "Hello from the CocoonJS Launcher App! Are you a HTML5 game developer? Come and check out CocoonJS!",
        *     "https://cocoonjsadmin.ludei.com/static/images/cocoon_logo.png",
        *     "http://ludei.com",
        *     "Ludei & CocoonJS",
        *     "We love HTML5 games!");
        *
        *     socialService.publishMessage(message, function(error) {
        *          if (error) {
        *              console.error("Error publishing message: " + error.message);
        *          }
        *      });
        * }
        */
        publishMessage: function(message, callback) {
            callback({message:"Not implemented!"});
        },

        /**
        * Presents a native/web dialog that allows the user to share a message.
        * @function publishMessageWithDialog   
        * @memberOf Cocoon.Social.Interface         
        * @param {Cocoon.Social.Message} message A object representing the information to be published
        * @param {function} callback The callback function.  It receives the following parameters: error
        * @example 
        * var fb = Cocoon.Social.Facebook;
        *
        * fb.init({
        *     appId: "XXXXXXXXXXXXXXXXXXXXX",
        *     channelUrl: "//connect.facebook.net/en_US/all.js"
        * });
        * 
        * var socialService = fb.getSocialInterface();
        * var loggedIn = socialService.isLoggedIn();
        * 
        * if (loggedIn) {
        *     var message = new Cocoon.Social.Message(
        *     "Hello from the CocoonJS Launcher App! Are you a HTML5 game developer? Come and check out CocoonJS!",
        *     "https://cocoonjsadmin.ludei.com/static/images/cocoon_logo.png",
        *     "http://ludei.com",
        *     "Ludei & CocoonJS",
        *     "We love HTML5 games!");
        *
        *     socialService.publishMessageWithDialog(message, function(error) {
        *          if (error) {
        *              console.error("Error publishing message: " + error.message);
        *          }
        *      });
        * }   
        */        
        publishMessageWithDialog: function(message, callback) {
            callback({message:"Not implemented!"});
        }
    }


    extension.SocialGamingService = function() {
        Cocoon.Social.SocialGamingService.superclass.constructor.call(this);
        return this;
    }

    extension.SocialGamingService.prototype = {

        _cachedAchievements: null,
        _achievementsMap: null,
        _leaderboardsTemplate: null,
        _achievementsTemplate: null,
      
        requestScore: function(callback, params) {
            callback(null, {message:"Not implemented!"})
        },

        submitScore: function(score, callback, params ) {
            if (callback)
                callback({message:"Not implemented!"})
        },

        showLeaderboard : function(callback, params) {
            if (callback)
                callback({message:"Not implemented!"})
        },

        requestAllAchievements : function(callback) {
            callback([], {message:"Not implemented!"})
        },

        requestAchievements : function(callback, userID) {
            callback([], {message:"Not implemented!"})
        },

        submitAchievement: function(achievementID, callback) {
            if (callback)
                callback({message:"Not implemented!"})
        },
        
        resetAchievements : function(callback) {
            if (callback)
                callback([], {message:"Not implemented!"})
        },
        
        showAchievements : function(callback) {
            if (!this._achievementsTemplate)
                throw "Please, provide a html template for achievements with the setTemplates method";
            var dialog = new Cocoon.Widget.WebDialog();
            var callbackSent = false;
            dialog.show(this._achievementsTemplate, function(error) {
                dialog.closed = true;
                if (!callbackSent && callback)
                    callback(error);
            });
            var me = this;
            this.requestAchievements(function(achievements, error){
                if (dialog.closed)
                    return;
                if (error) {
                    callbackSent = true;
                    if (callback)
                        callback(error);
                    return;
                }

                var achs = [];
                if (me._cachedAchievements) {
                    for (var i = 0; i < me._cachedAchievements.length; ++i) {
                        var ach = me._cachedAchievements[i];
                        achs.push(ach);
                        if (achievements && achievements.length) {
                            for (var j = 0; j< achievements.length; ++j) {
                                if (achievements[j].achievementID === ach.achievementID) {
                                    ach.achieved = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                var js = "addAchievements(" + JSON.stringify(achs) + ");";
                dialog.eval(js);
            });
        },

        setAchievementsMap: function(map) {
            this._achievementsMap = map;
            if (this._cachedAchievements) {
               this.syncAchievementsMap(this._cachedAchievements);
            }
        },

        setTemplates: function(leaderboardsTemplate, achievementsTemplate) {
            this._leaderboardsTemplate = leaderboardsTemplate;
            this._achievementsTemplate = achievementsTemplate;
        },

        setCachedAchievements: function(achievements) {
            this._cachedAchievements = achievements;
            if (achievements && this._achievementsMap) {
                this.syncAchievementsMap(this._cachedAchievements);
            }
        },

        findAchievement: function(id) {
            if (!this._cachedAchievements)
                return null;
            for (var i = 0; i < this._cachedAchievements.length; ++i) {
                if (id === this._cachedAchievements[i].achievementID) {
                    return this._cachedAchievements[i];
                }
            }
            return null;
        },

        translateAchievementID: function(id) {
            if (this._achievementsMap) {
                for (var customID in this._achievementsMap) {
                    if (customID == id) { //important: compare with double equal, because id can be numeric
                        return this._achievementsMap[customID];
                    }
                }
            }
            return id;
        },
        
        syncAchievementsMap: function(achievements) {
            if (!this._achievementsMap)
                return;
            for (var i = 0; i< achievements.length; ++i) {
                for (var customID in this._achievementsMap) {
                     if (this._achievementsMap[customID] === achievements[i].achievementID) {
                         achievements[i].customID = customID;
                     }
                }
            }
        }
    }

    
    Cocoon.extend(extension.SocialGamingService, extension.Interface);

    /**
    * This object represents the possible images that can be obtained for a user in the social gaming extension.
    * @memberof Cocoon.Social  
    * @name Cocoon.Social.ImageSize
    * @property {object} Cocoon.Social.ImageSize - The object itself
    * @property {string} Cocoon.Social.ImageSize.THUMB Represent a thumbnail like image size.
    * @property {string} Cocoon.Social.ImageSize.SMALL Represents the small image size.
    * @property {string} Cocoon.Social.ImageSize.MEDIUM Represents the medium image size.
    * @property {string} Cocoon.Social.ImageSize.LARGE Represents the large image size.
    */   
    extension.ImageSize =
    {
    
        THUMB : "thumb",
    
        SMALL : "small",
    
        MEDIUM : "medium",
    
        LARGE : "large"
    };

    /**
    * The object that represents the information of a user inside the social gaming extension.
    * @memberof Cocoon.Social  
    * @name Cocoon.Social.User
    * @property {object} Cocoon.Social.User - The object itself
    * @property {string} Cocoon.Social.User.userID The id of the user.
    * @property {string} Cocoon.Social.User.userName The user name of the user.
    * @property {string} Cocoon.Social.User.userImage If the image URL is not provided by default, fetch it using requestUserImage method.
    */  
    extension.User = function(userID, userName, userImage)
    {
        
        this.userID = userID;
        
        this.userName = userName;

        this.userImage = userImage;

        return this;
    };

    /**
    * This object represents a message to be published.
    * @memberof Cocoon.Social  
    * @name Cocoon.Social.Message
    * @property {object} Cocoon.Social.Message - The object itself
    * @property {string} Cocoon.Social.Message.message  The message to be published.
    * @property {string} Cocoon.Social.Message.mediaURL An URL to a media (image, video, ...). 
    * @property {string} Cocoon.Social.Message.linkURL An URL to add to the message so the user can click on that link to get more information.
    * @property {string} Cocoon.Social.Message.linkText The text that will appear in the message link.
    * @property {string} Cocoon.Social.Message.linkCaption The text caption that will appear in the message link.
    */  
    extension.Message = function(message, mediaURL, linkURL, linkText, linkCaption)
    {
        
        this.message = message;
        
        this.mediaURL = mediaURL;
        
        this.linkURL = linkURL;
        
        this.linkText = linkText;
        
        this.linkCaption = linkCaption;

        return this;
    };

    /**
    * This object that represents the information of the user score in the application.
    * @memberof Cocoon.Social  
    * @name Cocoon.Social.Score
    * @property {object} Cocoon.Social.Score - The object itself
    * @property {string} Cocoon.Social.Score.userID The user id.
    * @property {number} Cocoon.Social.Score.score The score of the user.
    * @property {string} Cocoon.Social.Score.userName The name of the user.
    * @property {string} Cocoon.Social.Score.imageURL imageURL The url of the user image.
    * @property {number} Cocoon.Social.Score.leaderboardID The id of the leaderboard the score belongs to.
    */  
    extension.Score = function(userID, score, userName, imageURL, leaderboardID)
    {
        
        this.userID = userID;
        
        this.score = score || 0;
        
        this.userName = userName;
        
        this.imageURL = imageURL;
        
        this.leaderboardID = leaderboardID;

        return this;
    };

    /**
    * The object that represents params to retrieve or submit scores.
    * @memberof Cocoon.Social  
    * @name Cocoon.Social.ScoreParams
    * @property {object} Cocoon.Social.ScoreParams - The object itself
    * @property {string} Cocoon.Social.ScoreParams.userID The user id. If no userID is specified the current logged in user is assumed.
    * @property {number} Cocoon.Social.ScoreParams.leaderboardID The leaderboard ID. If no leaderboard is specified the default leaderboard is assumed.
    * @property {boolean} Cocoon.Social.ScoreParams.friends If enabled the query will get only scores from friends in the social network.
    * @property {Cocoon.Social.TimeScope} Cocoon.Social.ScoreParams.timeScope  The time scope for the scores.
    */ 
    extension.ScoreParams = function(userID, leaderboardID, friends, timeScope) {

        this.userID = userID;

        this.leaderboardID = leaderboardID;

        this.friends = !!friends;

        this.timeScope = timeScope || 2;
    }

    /**
    * This object represents the possible Time Scopes for a leaderboard query.
    * @memberof Cocoon.Social  
    * @name Cocoon.Social.TimeScope
    * @property {object} Cocoon.Social.TimeScope - The object itself
    * @property {string} Cocoon.Social.TimeScope.ALL_TIME All registered time.
    * @property {string} Cocoon.Social.TimeScope.WEEK A week.
    * @property {string} Cocoon.Social.TimeScope.TODAY Today.
    */ 
    extension.TimeScope =
    {
        ALL_TIME: 0,
        WEEK: 1,
        TODAY:2
    };

    /**
    * This object represents the possible Time Scopes for a leaderboard query.
    * @memberof Cocoon.Social  
    * @name Cocoon.Social.Achievement
    * @property {object} Cocoon.Social.Achievement - The object itself
    * @property {string} Cocoon.Social.Achievement.achievementID The id of the achievement info.
    * @property {string} Cocoon.Social.Achievement.customID The optional custom id of the achievement defined by the user.
    * @property {string} Cocoon.Social.Achievement.title The title of the achievement.
    * @property {string} Cocoon.Social.Achievement.description The description of the achievement.
    * @property {string} Cocoon.Social.Achievement.imageURL The url to the image representing the achievement.
    * @property {number} Cocoon.Social.Achievement.points The points value of the achievement.
    */ 
    extension.Achievement = function(achievementID, title, description, imageURL, points)
    {

        this.achievementID = achievementID;

        this.customID = achievementID;

        this.title = title;

        this.description = description;

        this.imageURL = imageURL;

        this.points = points || 0;

        return this;
    };

    /**
    * Opens a given share native window to share some specific text content in 
    * any system specific social sharing options. For example, Twitter, Facebook, SMS, Mail, ...
    * @memberOf Cocoon.Social
    * @function Share
    * @param textToShare {string} textToShare The text content that will be shared.
    * @example
    * Cocoon.Social.share("I have scored more points on Flappy Submarine!! Chooo choooo");
    */
    extension.share = function(textToShare) {
        if (Cocoon.nativeAvailable){
            return Cocoon.callNative("IDTK_APP", "share", arguments, true);
        }
        else {
            // TODO: Is there something we could do to share in a browser?
        }
    };

    return extension;
});