/**
 * This namespace represents all the basic functionalities available in the CocoonJS extension API.
 *
 * <div class="alert alert-success">
 *   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/Multiplayer">Multiplayer demo</a>.
 *</div>
 *
 * <div class="alert alert-warning">
 *    <strong>Warning!</strong> This JavaScript extension requires some configuration parameters on the <a href="https://ludei.zendesk.com/hc/en-us">cloud compiler</a>!
 * </div>
 * @namespace Cocoon.Social.GameCenter
 */
Cocoon.define("Cocoon.Social" , function(extension){

    extension.GameCenterExtension = function() {
        this.nativeExtensionName = "IDTK_SRV_GAMECENTER";
        this.extensionName = "Social.GameCenter";
        this.nativeAvailable =  (!!window.ext) && (!!window.ext[this.nativeExtensionName]);

        var me = this;
        if (this.nativeAvailable) {
            this.onGameCenterLoginStateChanged = new Cocoon.EventHandler(this.nativeExtensionName, this.extensionName, "onGameCenterLoginStateChanged");

            this.onGameCenterLoginStateChanged.addEventListener(function(localPlayer,error){
                me._currentPlayer = localPlayer;
            });
        }
        return this;
    };

    extension.GameCenterExtension.prototype = {

        _currentPlayer: null,

        /**
         * This namespace represents all the basic functionalities available in the CocoonJS extension API.
         * <div class="alert alert-warning">
         *    <strong>Warning!</strong> This JavaScript extension requires some configuration parameters on the <a href="https://ludei.zendesk.com/hc/en-us">cloud compiler</a>!.
         * </div>
         */

         /**
         * Returns a Cocoon Social Interface for the Game Center Extension.
         * You can use the Game Center extension in two ways, with 1:1 official API equivalent or with the CocoonJS API abstraction.
         * @function getSocialInterface
         * @memberOf Cocoon.Social.GameCenter
         * @see Cocoon.Social.Interface
         * @returns {Cocoon.Social.Interface}
         */
        getSocialInterface: function() {
            if (!this._socialService) {
                this._socialService = new Cocoon.Social.SocialGamingServiceGameCenter(this);
            }
            return this._socialService;
        },

        /**
         * Returns a Cocoon Multiplayer interface for the Game Center Service.
         * @function getMultiplayerInterface
         * @memberOf Cocoon.Social.GameCenter
         * @returns {Cocoon.Multiplayer.MultiplayerService}
         */
        getMultiplayerInterface: function() {
            return Cocoon.Multiplayer.GameCenter;
        },

        isLoggedIn: function() {
            return this._currentPlayer && this._currentPlayer.isAuthenticated;
        },

        /**
         * Authenticates the user.
         * @function login
         * @memberOf Cocoon.Social.GameCenter          
         * @params {function} callback The callback function. Response params: Cocoon.Social.GameCenter.LocalPlayer and error.
         */
        login: function(callback) {
            var me = this;
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "login", [function(response, error) {
                    me._currentPlayer = response;
                    if (callback) {
                        callback(response,error);
                    }
                }], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Synchronous accessor for the current authResponse.
         * @function getLocalPlayer
         * @memberOf Cocoon.Social.GameCenter             
         * @returns {Cocoon.Social.GameCenter.LocalPlayer} Current Local Player data.
         */
        getLocalPlayer: function() {
            if (this._currentPlayer)
                return this._currentPlayer;
            if (this.nativeAvailable) {
                this._currentPlayer = Cocoon.callNative(this.nativeExtensionName, "getLocalPlayer", []);
                return this._currentPlayer;
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Loads the players of the provided identifiers.
         * @function loadPlayers
         * @memberOf Cocoon.Social.GameCenter          
         * @param {array} playerIDs Array of player identifiers.
         * @param {function} callback The callback function. It receives the following parameters: 
         * - Array of {@link Cocoon.Social.GameCenter.Player}. 
         * - Error.
         */
        loadPlayers: function(playerIDs, callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "loadPlayers", [playerIDs, callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Loads the friends of the current logged in user.
         * @function loadFriends
         * @memberOf Cocoon.Social.GameCenter          
         * @param {function} callback The callback function. It receives the following parameters: 
         * - Array of {@link Cocoon.Social.GameCenter.Player}. 
         * - Error. 
         */
        loadFriends: function(callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "loadFriends", [callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Loads the earned achievements for the current logged in user.
         * @function loadAchievements
         * @memberOf Cocoon.Social.GameCenter 
         * @param {function} callback The callback function. It receives the following parameters: 
         * - Array of {@link Cocoon.Social.GameCenter.Achievement}. 
         * - Error.
         */
        loadAchievements: function(callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "loadAchievements", [callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Loads the application achievement descriptions.
         * @function loadAchievementDescriptions
         * @memberOf Cocoon.Social.GameCenter         
         * @param {function} callback The callback function. It receives the following parameters: 
         * - Array of {@link Cocoon.Social.GameCenter.Achievement}. 
         * - Error.
         */
        loadAchievementDescriptions: function(callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "loadAchievementDescriptions", [callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Load the application achievement descriptions.
         * @function loadScores
         * @memberOf Cocoon.Social.GameCenter           
         * @param {function} callback The callback function. It receives the following parameters: 
         * - {@link Cocoon.Social.GameCenter.Leaderboard}. 
         * - Error. 
         * @param {Cocoon.Social.GameCenter.Leaderboard} [query] Optional query parameters.
         */
        loadScores: function(callback, query) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "loadScores", [query,callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Report user score to the server.
         * @function submitScore
         * @memberOf Cocoon.Social.GameCenter          
         * @param {Cocoon.Social.GameCenter.Score} score Definition of the score and it's category (leaderboardID).
         * If no category is specified the default one is used.
         * @param {function} callback The callback function. Response params: error.
         */
        submitScore: function(score, callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "submitScore", [score,callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Reports user earned achievements to the server.
         * @function submitAchievements
         * @memberOf Cocoon.Social.GameCenter          
         * @param {array} achievements - Array of {@link Cocoon.Social.GameCenter.Achievement} objects.
         * @param {function} callback The callback function. Response params: error.
         */
        submitAchievements: function(achievements, callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "submitAchievements", [achievements,callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Resets all the achievements of the current logged in user.
         * @function resetAchievements
         * @memberOf Cocoon.Social.GameCenter  
         * @param {function} [callback] The callback function. Response params: error.
         */
        resetAchievements : function(callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "resetAchievements", [callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Shows a native view with the standard user interface for achievements.
         * @function showAchievements
         * @memberOf Cocoon.Social.GameCenter
         * @param {function} callback The callback function when the view is closed by the user. Response params: error
         */
        showAchievements: function(callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "showAchievements", [callback], true);
            }
            else {
                throw "Game Center not available";
            }
        },

        /**
         * Shows a native view with the standard user interface for leaderboards.
         * @function showLeaderboards
         * @memberOf Cocoon.Social.GameCenter
         * @param {function} callback The callback function when the view is closed by the user. Response params: error
         * @param {Cocoon.Social.GameCenter.Leaderboard} [query] Optional parameters
         */
        showLeaderboards: function(callback, query) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "showLeaderboards", [query, callback], true);
            }
            else {
                throw "Game Center not available";
            }
        }
    };

    extension.GameCenter = new extension.GameCenterExtension();

    /**
    * The object that represents the information of a Game Center player.
    * @memberof Cocoon.Social.GameCenter
    * @name Cocoon.Social.GameCenter.Player
    * @property {object} Cocoon.Social.GameCenter.Player - The object itself
    * @property {string} Cocoon.Social.GameCenter.Player.playerID The identifier of the player.
    * @property {string} Cocoon.Social.GameCenter.Player.alias The alias of the player.
    * @property {boolean} Cocoon.Social.GameCenter.Player.isFriend True if the user is friend of the local player.
    */
    extension.GameCenter.Player = function() {

        this.playerID = "";

        this.alias = "";

        this.isFriend = false;
    }

    /**
    * The object that represents the information of a Game Center local player.
    * @memberof Cocoon.Social.GameCenter
    * @name Cocoon.Social.GameCenter.LocalPlayer
    * @property {object} Cocoon.Social.GameCenter.LocalPlayer - The object itself
    * @property {string} Cocoon.Social.GameCenter.LocalPlayer.playerID The identifier of the player.
    * @property {string} Cocoon.Social.GameCenter.LocalPlayer.alias The alias of the player.
    * @property {boolean} Cocoon.Social.GameCenter.LocalPlayer.isAuthenticated Indicates the authentication state of the current player.
    */
    extension.GameCenter.LocalPlayer = function() {

        this.playerID = "";

        this.alias = "";

        this.isAuthenticated = false;
    }

    /**
    * The object that represents an earned achievement by the user.
    * @memberof Cocoon.Social.GameCenter
    * @name Cocoon.Social.GameCenter.Achievement
    * @property {object} Cocoon.Social.GameCenter.Achievement - The object itself
    * @property {string} Cocoon.Social.GameCenter.Achievement.identifier The id of the achievement.
    * @property {number} Cocoon.Social.GameCenter.Achievement.percentComplete Percentage of achievement complete (from 0 to 100).
    * @property {number} Cocoon.Social.GameCenter.Achievement.lastReportedDate Date the achievement was last reported (unix time).
    */
    extension.GameCenter.Achievement = function(identifier, percentComplete) {

        this.identifier = identifier;

        this.percentComplete = percentComplete;

        this.lastReportedDate = 0;
    }

    /**
    * The object that represents an earned achievement by the user.
    * @memberof Cocoon.Social.GameCenter
    * @name Cocoon.Social.GameCenter.AchievementDescription
    * @property {object} Cocoon.Social.GameCenter.AchievementDescription - The object itself
    * @property {string} Cocoon.Social.GameCenter.AchievementDescription.identifier The identifier of the achievement.
    * @property {string} Cocoon.Social.GameCenter.AchievementDescription.title The title of the achievement.
    * @property {string} Cocoon.Social.GameCenter.AchievementDescription.achievedDescription The description for an achieved achievement.
    * @property {string} Cocoon.Social.GameCenter.AchievementDescription.unachievedDescription The description for an unachieved achievement.
    * @property {number} Cocoon.Social.GameCenter.AchievementDescription.maximumPoints The maximum points of the achievement.
    */
    extension.GameCenter.AchievementDescription = function() {

        this.identifier = "";

        this.title = "";

        this.achievedDescription = "";

        this.unachievedDescription = "";

        this.maximumPoints = 0;
    }

    /**
    * The object that represents a score in the leaderboards.
    * @memberof Cocoon.Social.GameCenter
    * @name Cocoon.Social.GameCenter.Score
    * @property {object} Cocoon.Social.GameCenter.Score - The object itself
    * @property {string} Cocoon.Social.GameCenter.Score.userID The identifier of the player that recorded the score.
    * @property {number} Cocoon.Social.GameCenter.Score.score The score value as a 64bit integer.
    * @property {string} Cocoon.Social.GameCenter.Score.userName The name of the user.
    * @property {string} Cocoon.Social.GameCenter.Score.imageURL imageURL The url of the user image.
    * @property {string} Cocoon.Social.GameCenter.Score.leaderboardID Leaderboard category.
    * @property {number} Cocoon.Social.GameCenter.Score.rank The rank of the player within the leaderboard.
    */
    extension.GameCenter.Score = function(userID, score, userName, imageURL, leaderboardID, originalScoreObject)
    {

        this.userID = userID;

        this.score = score || 0;

        this.userName = userName;

        this.imageURL = imageURL;

        this.leaderboardID = leaderboardID;

        this.rank = originalScoreObject.rank;

        this.originalScoreObject = originalScoreObject;

        return this;
    };


    /**
    * The object that represents the set of high scores for the current game.
    * @memberof Cocoon.Social.GameCenter
    * @name Cocoon.Social.GameCenter.Leaderboard
    * @property {object} Cocoon.Social.GameCenter.Leaderboard - The object itself
    * @property {string} Cocoon.Social.GameCenter.Leaderboard.category The category of the leaderboard (query parameter).
    * @property {array} Cocoon.Social.GameCenter.Leaderboard.playerIDs Player identifiers array (query parameter).
    * @property {Cocoon.Social.GameCenter.TimeScope} Cocoon.Social.GameCenter.Leaderboard.timeScope Time scope (query parameter).
    * @property {Cocoon.Social.GameCenter.PlayerScope} Cocoon.Social.GameCenter.Leaderboard.playerScope Player scope (query parameter).
    * @property {number} Cocoon.Social.GameCenter.Leaderboard.rangeStart Leaderboards start at index 1 and the length should be less than 100 (query parameter).
    * @property {number} Cocoon.Social.GameCenter.Leaderboard.rangeLength Leaderboards start at index 1 and the length should be less than 100 (query parameter).
    * @property {array} Cocoon.Social.GameCenter.Leaderboard.scores Scores array (response parameter).
    * @property {Cocoon.Social.GameCenter.Score} Cocoon.Social.GameCenter.Leaderboard.localPlayerScore Local player score (response parameter).
    * @property {string} Cocoon.Social.GameCenter.Leaderboard.localizedTitle Localized category title.
    */
    extension.GameCenter.Leaderboard = function(category, playerIDs, timeScope, playerScope, rangeStart, rangeLength) {
        
        this.category = category;
       
        this.playerIDs = playerIDs;
        
        this.timeScope = timeScope;
    
        this.playerScope = playerScope;

        this.rangeStart = rangeStart;

        this.rangeLength = rangeLength;

        this.scores = [];

        this.localPlayerScore = [];

        this.localizedTitle = localizedTitle;
    }

    /**
    * This object represents the possible Time Scopes for a leaderboard query.
    * @memberof Cocoon.Social.GameCenter
    * @name Cocoon.Social.GameCenter.TimeScope
    * @property {object} Cocoon.Social.GameCenter.TimeScope - The object itself
    * @property {string} Cocoon.Social.GameCenter.TimeScope.TODAY Today.
    * @property {string} Cocoon.Social.GameCenter.TimeScope.WEEK A week.
    * @property {string} Cocoon.Social.GameCenter.TimeScope.ALL_TIME All registered time.
    */
    extension.GameCenter.TimeScope =
    {
        TODAY: 0,
        WEEK: 1,
        ALL_TIME:2
    };

    /**
    * This object represents the possible Player Scopes for a leaderboad query.
    * @memberof Cocoon.Social.GameCenter
    * @name Cocoon.Social.GameCenter.PlayerScope
    * @property {object} Cocoon.Social.GameCenter.PlayerScope - The object itself
    * @property {string} Cocoon.Social.GameCenter.PlayerScope.GLOBAL Global.
    * @property {string} Cocoon.Social.GameCenter.PlayerScope.FRIENDS Friends.
    */
    extension.GameCenter.PlayerScope =
    {
        GLOBAL: 0,
        FRIENDS: 1
    };


    //Social API Interface
    extension.SocialGamingServiceGameCenter = function(gcExtension) {
        Cocoon.Social.SocialGamingServiceGameCenter.superclass.constructor.call(this);
        this.gc = gcExtension;
        var me = this;
        this.gc.onGameCenterLoginStateChanged.addEventListener(function(localPlayer, error){
            me.onLoginStatusChanged.notifyEventListeners(localPlayer.isAuthenticated,error);
        });
        return this;
    }

    extension.SocialGamingServiceGameCenter.prototype =  {

        _cachedAchievements: null,

        isLoggedIn: function() {
            return this.gc.isLoggedIn();
        },
        login : function(callback) {
            this.gc.login(function(localPlayer, error){
                if (callback)
                    callback(localPlayer.isAuthenticated, error);
            });
        },
        logout: function(callback) {
            if (callback)
                callback({message:"User has to logout from the Game Center APP"});
        },
        getLoggedInUser : function() {
            return fromGCPLayerToCocoonUser(this.gc._currentPlayer ? this.gc._currentPlayer : this.gc.getLocalPlayer());
        },

        requestUser: function(callback, userId) {
            if (userId) {
                this.gc.loadPlayers([userId], function(response, error) {
                    var user = response && response.length ? fromGCPLayerToCocoonUser(response[0]) : null;
                    callback(user, error);
                });
            }
            else {
                var me = this;
                setTimeout(function(){
                    callback(me.getLoggedInUser());
                })
            }
        },
        requestFriends: function(callback, userId) {
            this.gc.loadFriends(function(friends, error){
                var users = [];
                if (friends && friends.length) {
                    for (var i= 0; i< friends.length; ++i) {
                        users.push(fromGCPLayerToCocoonUser(friends[i]));
                    }
                }
                callback(users, error);
            });
        },
        requestScore: function(callback, params) {
            var query = {};
            var options = params || {};
            if (options.leaderboardID)
                query.category = options.leaderboardID;
            query.playerIDs = [options.userID || this.getLoggedInUser().userID];

            this.gc.loadScores(function(response, error) {
                var gcScore = null;
                if (options.userID && response && response.scores && response.scores.length)
                    gcScore = response.scores[0];
                else if (response && response.localPlayerScore)
                    gcScore = response.localPlayerScore;
                var loadedScore = gcScore ? new Cocoon.Social.GameCenter.Score(gcScore.playerID, gcScore.value, "","", gcScore.category, gcScore) : null;
                callback(loadedScore,error);
            }, query);
        },
        submitScore: function(score, callback, params) {
            var options = params || {};
            this.gc.submitScore({value:score, category:options.leaderboardID || ""}, function(error){
                if (callback)
                    callback(error);
            });
        },
        showLeaderboard : function(callback, params) {
            var options = params || {};
            this.gc.showLeaderboards(function(error){
                if (callback)
                    callback(error);
            }, {category:options.leaderboardID || ""});
        },
        //internal utility function
        prepareAchievements: function(reload, callback) {

            if (!this._cachedAchievements || reload) {
                var me = this;
                this.gc.loadAchievementDescriptions(function(response, error){
                    if (error) {
                        callback([],error);
                    }
                    else {
                       var achievements = [];
                       if (response && response.length) {
                           for (var i = 0; i < response.length; i++) {
                               achievements.push(fromGCAchievementDescriptionToCocoonAchievement(response[i]))
                           }
                       }
                       me.setCachedAchievements(achievements);
                       callback(achievements, null);
                    }

                });
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
                me.gc.loadAchievements(function(response, error){
                    if (!error) {
                        var achievements = [];
                        if (response && response.length) {
                            for (var i = 0; i < response.length; i++) {
                                var ach = me.findAchievement(response[i].identifier);
                                if (ach)
                                    achievements.push(ach);
                            }
                        }
                        callback(achievements, null);
                    }
                    else {
                        callback([], response.error);
                    }

                });
            });
        },
        submitAchievement: function(achievementID, callback) {
            if (achievementID === null || typeof achievementID === 'undefined')
                throw "No achievementID specified";
            var achID = this.translateAchievementID(achievementID);
            this.gc.submitAchievements([{identifier:achID, percentComplete:100}], callback);
        },
        resetAchievements : function(callback) {
            this.gc.resetAchievements(callback);
        },
        showAchievements : function(callback) {
            this.gc.showAchievements(function(error){
                if (callback)
                    callback(error);
            });
        }
    };

    Cocoon.extend(extension.SocialGamingServiceGameCenter, extension.SocialGamingService);


    function fromGCPLayerToCocoonUser(player){
        return new Cocoon.Social.User(player.playerID, player.alias);
    }

    function fromGCAchievementDescriptionToCocoonAchievement(ach) {
        return new Cocoon.Social.GameCenter.Achievement(ach.identifier,ach.title, ach.achievedDescription,"", ach.maximumPoints);
    }
    
    return extension;
});
