/**
 * 
 *
 * <div class="alert alert-success">
 *   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Multiplayer">Multiplayer demo</a>.
 *</div>
 * 
 * <div class="alert alert-warning">
 *    <strong>Warning!</strong> This JavaScript extension requires some configuration parameters on the <a href="https://ludei.zendesk.com/hc/en-us">cloud compiler</a>!
 * </div>
 * @namespace Cocoon.Multiplayer
 */
Cocoon.define("Cocoon.Multiplayer" , function(extension){

	extension.MultiplayerService = function(nativeExtensionName, extensionName)
	{
		this.nativeExtensionName = nativeExtensionName;
		this.extensionName = extensionName;
	    this.nativeAvailable = (!!window.ext) && (!!window.ext[this.nativeExtensionName]);

        var me = this;

        this.onInvitationReceived = new Cocoon.EventHandler(this.nativeExtensionName, this.extensionName, "onInvitationReceived");

        this.onInvitationLoaded = new Cocoon.EventHandler(this.nativeExtensionName, this.extensionName, "onInvitationLoaded", function(sourceListener, args){
            var matchID = args[0];
            var error = args[1];
            if (matchID && !error) {
                me.currentMatch =  new Cocoon.Multiplayer.Match(me.nativeExtensionName, me.extensionName, matchID);
                sourceListener(me.currentMatch, null)
            }
            else {
                sourceListener(null, error);
            }
        });

        var signal = new Cocoon.Signal.createSignal();

        signal.register("invitation", {
            received : this.onInvitationReceived,
            loaded : this.onInvitationLoaded,
        });

        this.on = signal.expose();

        return this;
	};


	extension.MultiplayerService.prototype = {

        currentMatch: null,

        /**
         * Presents a system View for the matchmaking and creates a new Match.
         * @function findMatch
         * @memberOf Cocoon.Multiplayer
         * @private
         * @param {Cocoon.Multiplayer.MatchRequest} matchRequest The parameters for the match.
         * @param {Function} callback The callback function. It receives the following parameters: 
         * - {@link Cocoon.Multiplayer.Match}. 
         * - Error. 
         */
        findMatch : function(matchRequest, callback)  {
            var me = this;
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "findMatch", [matchRequest, function(matchID,error) {
                    if (matchID && !error) {
                        me.currentMatch =  new Cocoon.Multiplayer.Match(me.nativeExtensionName, me.extensionName, matchID);
                        callback(me.currentMatch, null)
                    }
                    else {
                        callback(null, error);
                    }
                }], true);
            }
        },

        /**
         * Sends an automatch request to join the authenticated user to a match. It doesn't present a system view while waiting to other players.
         * @function findAutoMatch
         * @memberOf Cocoon.Multiplayer   
         * @private      
         * @param  {Cocoon.Multiplayer.MatchRequest} matchRequest The parameters for the match.
         * @param {Function} callback The callback function. It receives the following parameters: 
         * - {@link Cocoon.Multiplayer.Match}. 
         * - Error.
         */
        findAutoMatch : function(matchRequest, callback) {
            var me = this;
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "findAutoMatch", [matchRequest, function(matchID, error){
                    if (matchID && !error) {
                        me.currentMatch =  new Cocoon.Multiplayer.Match(me.nativeExtensionName, me.extensionName, matchID);
                        callback(me.currentMatch, null)
                    }
                    else {
                        callback(null, error);
                    }
                }], true);
            }
        },

        /**
         * Cancels the ongoing automatch request.
         * @function cancelAutoMatch
         * @memberOf Cocoon.Multiplayer    
         * @private        
         */
        cancelAutoMatch : function() {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "cancelAutoMatch", [], true);
            }
        },

        /**
         * Automatically adds players to an ongoing match owned by the user.
         * @function addPlayersToMatch
         * @memberOf Cocoon.Multiplayer 
         * @private         
         * @param {Cocoon.Multiplayer.MatchRequest} matchRequest The parameters for the match.
         * @param {Cocoon.Multiplayer.Match} matchRequest The match where new players will be added.
         * @param {Function} callback The callback function. Response parameters: error.
         */
        addPlayersToMatch : function(matchRequest, match, callback) {
            if (this.nativeAvailable) {
                Cocoon.callNative(this.nativeExtensionName, "addPlayersToMatch", [matchRequest, match.matchID, callback], true);
            }
        },

        /**
         * Get the current match reference.
         * @function getMatch
         * @memberOf Cocoon.Multiplayer      
         * @private    
         * @return {Cocoon.Multiplayer.Match} The current match reference.
         */
        getMatch : function() {
            return this.currentMatch;
        }
	};

	/**
	* This type provides a transmission network between a group of users.
	* The match might be returned before connections have been established between players. At this stage, all the players are in the process of connecting to each other.
	* Always check the getExpectedPlayerCount value before starting a match. When its value reaches zero, all expected players are connected, and your game can begin the match.
	* Do not forget to call the start method of the match when your game is ready to process received messages via onMatchDataReceived listener.
    * @constructor Match
    * @memberOf Cocoon.Multiplayer
	* @param {string} nativeExtensionName The name of the native ext object extension property name.
	* @param {string} extensionName The name of the CocoonJS object extension property name.
	* @param {number} matchID The match ID user for native service bridge.
	*/
	extension.Match = function(nativeExtensionName, extensionName, matchID)
	{
		if (typeof nativeExtensionName !== 'string') throw "The given native extension name '" + nativeExtensionName + "' is not a string.";
		if (typeof extensionName !== 'string') throw "The given extension name '" + nativeExtensionName + "' is not a string.";

		this.nativeExtensionName = nativeExtensionName;
		this.extensionName = extensionName;
	    this.nativeAvailable = Cocoon.nativeAvailable && typeof window.ext[nativeExtensionName] !== 'undefined';
	    this.matchID = matchID;
	    var me = this;

	    this.onMatchDataReceived = new Cocoon.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchDataReceived", function(sourceListener, args) {
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1], args[2]);
	    		}
	    	});

	    this.onMatchStateChanged = new Cocoon.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchStateChanged", function(sourceListener, args) {
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1], args[2]);
	    		}
	    	});

	    this.onMatchConnectionWithPlayerFailed = new Cocoon.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchConnectionWithPlayerFailed", function(sourceListener, args) {
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1], args[2]);
	    		}
	    	});

	    this.onMatchFailed = new Cocoon.EventHandler(this.nativeExtensionName, this.extensionName, "onMatchFailed", function(sourceListener, args) {
	    		if (me.matchID === args[0]) {
	    			sourceListener(me, args[1]);
	    		}
	    	});



        var signal = new Cocoon.Signal.createSignal();

        /**
        * Allows to listen to events about the restoring process.
        * - The callback 'dataReceived' 
        * - The callback 'stateChanged' 
        * - The callback 'connectionWithPlayerFailed' allows listening to events called when a netowrk connection with a player fails
        * - The callback 'failed' allows listening to events called when the match fails.
        * @event On restore products callbacks
        * @memberof Cocoon.Multiplayer.Match
        * @example
        * Cocoon.Store.on("restore",{
        *  dataReceived: function(match, data, playerId){ ... },
        *  stateChanged: function(match, playerId, connectionState){ ... },
        *  connectionWithPlayerFailed: function(match, playerId, errorMsg){ ... }
        *  failed: function(match, errorMsg){ ... }
        * });
        */
        signal.register("match", {
            dataReceived : this.onMatchDataReceived,
            stateChanged : this.onMatchStateChanged,
            connectionWithPlayerFailed : this.onMatchConnectionWithPlayerFailed,
            failed : this.onMatchFailed
        });

        this.on = signal.expose();
	};

	extension.Match.prototype = {

		/**
		* Starts processing received messages. The user must call this method when the game is ready to process messages. Messages received before being prepared are stored and processed later.
        * @function start
        * @memberOf Cocoon.Multiplayer.Match
		*/
		start : function() {
			if (this.nativeAvailable) {
				Cocoon.callNative(this.nativeExtensionName, "startMatch", [this.matchID], true);
			}
		},

		/**
		* Transmits data to all players connected to the match. The match queues the data and transmits it when the network becomes available.
        * @function sendDataToAllPlayers
        * @memberOf Cocoon.Multiplayer.Match		
		* @param {string} data The data to transmit.
		* @param {Cocoon.Multiplayer.SendDataMode} [sendMode] The optional {@link Cocoon.Multiplayer.SendDataMode} value. The default value is RELIABLE.
		* @return {boolean} TRUE if the data was successfully queued for transmission; FALSE if the match was unable to queue the data.
		*/
		sendDataToAllPlayers : function(data, sendMode) {
			if (this.nativeAvailable) {
				return Cocoon.callNative(this.nativeExtensionName, "sendDataToAllPlayers", [this.matchID, data, sendMode]);
			}
		},

		/**
		* Transmits data to a list of connected players. The match queues the data and transmits it when the network becomes available.
        * @function sendData
        * @memberOf Cocoon.Multiplayer.Match		
		* @param {string} data The data to transmit
		* @param {array} playerIDs An array containing the identifier strings for the list of players who should receive the data.
		* @param {Cocoon.Multiplayer.SendDataMode} [sendMode] The optional {@link Cocoon.Multiplayer.SendDataMode} value. The default value is RELIABLE.
		* @return {boolean} TRUE if the data was successfully queued for transmission; FALSE if the match was unable to queue the data.
		*/
		sendData : function(data, playerIDs,  sendMode) {
			if (this.nativeAvailable) {
				return Cocoon.callNative(this.nativeExtensionName, "sendData", [this.matchID, data, playerIDs, sendMode]);
			}
		},
	
		/**
		* Disconnects the local player from the match and releases the match. Calling disconnect notifies other players that you have left the match.
        * @function disconnect
        * @memberOf Cocoon.Multiplayer.Match			
		*/
		disconnect : function() {
			if (this.nativeAvailable) {
				return Cocoon.callNative(this.nativeExtensionName, "disconnect", [this.matchID], true);
			}
		},
		
		/**
		* Requests additional information of the current players in the match.
        * @function requestPlayersInfo
        * @memberOf Cocoon.Multiplayer.Match        
        * @param {Function} callback The callback function. Response params: players array and error
		*/
		requestPlayersInfo : function(callback) {
			if (this.nativeAvailable){
				return Cocoon.callNative(this.nativeExtensionName, "requestPlayersInfo", [this.matchID, callback], true);
			}
		},

		/**
		* Returns the remaining players count who have not yet connected to the match.
		* @function getExpectedPlayerCount
        * @memberOf Cocoon.Multiplayer.Match 		
		* @return {number} The remaining number of players who have not yet connected to the match.
		*/
		getExpectedPlayerCount : function() {
			if (this.nativeAvailable) {
				return Cocoon.callNative(this.nativeExtensionName, "getExpectedPlayerCount", [this.matchID]);
			}
		},

		/**
		* Returns an array with all the player identifiers taking part in the match.
		* @function getPlayerIDs
        * @memberOf Cocoon.Multiplayer.Match 				
		* @return {array} The player identifiers for the players in the match.
		*/
		getPlayerIDs : function() {
			if (this.nativeAvailable){
				return Cocoon.callNative(this.nativeExtensionName, "getPlayerIDs", [this.matchID]);
			}
		},

        /**
        * Gets the local playerID taking part in the match.
		* @function getLocalPlayerID
        * @memberOf Cocoon.Multiplayer.Match 	         
        * @return {string} the playerID attached to the match manager.
        */
        getLocalPlayerID : function() {
            if (this.nativeAvailable) {
                return Cocoon.callNative(this.nativeExtensionName, "getLocalPlayerID", [this.matchID]);
            }
            return "";
        },

	};

    /**
    * This object represents the modes to send data.
    * @memberof Cocoon.Multiplayer 
    * @name Cocoon.Multiplayer.SendDataMode
    * @property {object} Cocoon.Multiplayer.SendDataMode - The object itself
    * @property {string} Cocoon.Multiplayer.SendDataMode.RELIABLE The data is sent continuously until it is successfully received by the intended recipients or the connection times out.
    * @property {string} Cocoon.Multiplayer.SendDataMode.UNRELIABLE The data is sent once and is not sent again if a transmission error occurs.
    */  
	extension.SendDataMode =  {

	    RELIABLE : 0,

	    UNRELIABLE : 1
	};

    /**
    * This object represents the connection state of a player.
    * @memberof Cocoon.Multiplayer 
    * @name Cocoon.Multiplayer.ConnectionState
    * @property {object} Cocoon.Multiplayer.ConnectionState - The object itself
    * @property {string} Cocoon.Multiplayer.ConnectionState.UNKNOWN The connection is in unknown state.
    * @property {string} Cocoon.Multiplayer.ConnectionState.CONNECTED The connection is in connected state.
    * @property {string} Cocoon.Multiplayer.ConnectionState.DISCONNECTED The connection is in disconnected state.    
    */ 
	extension.ConnectionState = {

	    UNKNOWN : 0,

	    CONNECTED : 1,

	    DISCONNECTED : 2
	};

    /**
    * The object that represents the information of a player inside a multiplayer match.
    * @memberof Cocoon.Multiplayer 
    * @name Cocoon.Multiplayer.PlayerInfo
    * @property {object} Cocoon.Multiplayer.PlayerInfo - The object itself
    * @property {string} Cocoon.Multiplayer.PlayerInfo.userID The id of the user.
    * @property {string} Cocoon.Multiplayer.PlayerInfo.userName The name of the user.
    */
	extension.PlayerInfo = function(userID, userName) {

		this.userID = userID;

		this.userName = userName;
	};

    /**
    * This object is used to specify the parameters for a new multiplayer match.
    * @memberof Cocoon.Multiplayer 
    * @name Cocoon.Multiplayer.MatchRequest
    * @property {object} Cocoon.Multiplayer.MatchRequest - The object itself
    * @property {number} Cocoon.Multiplayer.MatchRequest.minPlayers The minimum number of players that may join the match.
    * @property {number} Cocoon.Multiplayer.MatchRequest.maxPlayers The maximum number of players that may join the match.
	* @property {array} [Cocoon.Multiplayer.MatchRequest.playersToInvite] Optional list of player identifers for players to invite to the match.
    * @property {number} [Cocoon.Multiplayer.MatchRequest.playerGroup] Optional number identifying a subset of players allowed to join the match.
    * @property {number} [Cocoon.Multiplayer.MatchRequest.playerAttributes] Optional mask that specifies the role that the local player would like to play in the game.
    */
	extension.MatchRequest = function(minPlayers, maxPlayers, playersToInvite, playerGroup, playerAttributes) {

		this.minPlayers = minPlayers;

		this.maxPlayers = maxPlayers;

		this.playersToInvite = playersToInvite;

		this.playerGroup = playerGroup;

		this.playerAttributes = playerAttributes;

		return this;
	};
	
	return extension;
});