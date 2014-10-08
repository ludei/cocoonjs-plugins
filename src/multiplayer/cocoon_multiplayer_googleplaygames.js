/**
 *
 * <div class="alert alert-success">
 *   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Multiplayer">Multiplayer demo</a>.
 *</div>
 * 
 * <div class="alert alert-warning">
 *    <strong>Warning!</strong> This JavaScript extension requires some configuration parameters on the <a href="https://ludei.zendesk.com/hc/en-us">cloud compiler</a>!
 * </div>
 * @namespace Cocoon.Multiplayer.GooglePlayGames
 * @example 
 * var GooglePlayGames = Cocoon.Multiplayer.GooglePlayGames;
 * var SocialGooglePlay = GooglePlayGames.getSocialInterface();
 * var MultiplayerGooglePlay = GooglePlayGames.getMultiplayerInterface();
 * 
 * SocialGooglePlay.login(function(loggedIn, error) {
 * 	if(loggedIn){
 * 		var request = new Cocoon.Multiplayer.MatchRequest(2,2);
 * 		var handleMatch = function(match, error){
 * 		
 * 		}
 * 		...
 * 		MultiplayerGooglePlay.findMatch(request, handleMatch);
 * 		...
 * 	}
 * });
 */
Cocoon.define("Cocoon.Multiplayer" , function(extension){

    extension.GooglePlayGames = new Cocoon.Multiplayer.MultiplayerService("IDTK_SRV_MULTIPLAYER_GPG", "Multiplayer.GooglePlayGames");
	
    /**
     * Presents a system View for the matchmaking and creates a new Match.
     * @function findMatch
     * @memberOf Cocoon.Multiplayer.GooglePlayGames
     * @param {Cocoon.Multiplayer.MatchRequest} matchRequest The parameters for the match.
     * @param {Function} callback The callback function. It receives the following parameters: 
     * - {@link Cocoon.Multiplayer.Match}. 
     * - Error. 
     */

     /**
     * Sends an automatch request to join the authenticated user to a match. It doesn't present a system view while waiting to other players.
     * @function findAutoMatch
     * @memberOf Cocoon.Multiplayer.GooglePlayGames 
     * @param  {Cocoon.Multiplayer.MatchRequest} matchRequest The parameters for the match.
     * @param {Function} callback The callback function. It receives the following parameters: 
     * - {@link Cocoon.Multiplayer.Match}. 
     * - Error.
     */

     /**
	 * Cancels the ongoing automatch request.
	 * @function cancelAutoMatch
	 * @memberOf Cocoon.Multiplayer.GooglePlayGames
	 */

	 /**
     * Automatically adds players to an ongoing match owned by the user.
     * @function addPlayersToMatch
     * @memberOf Cocoon.Multiplayer.GooglePlayGames
     * @param {Cocoon.Multiplayer.MatchRequest} matchRequest The parameters for the match.
     * @param {Cocoon.Multiplayer.Match} matchRequest The match where new players will be added.
     * @param {Function} callback The callback function. Response parameters: error.
     */

     /**
     * Get the current match reference.
     * @function getMatch
     * @memberOf Cocoon.Multiplayer.GooglePlayGames
     * @return {Cocoon.Multiplayer.Match} The current match reference.
     */

	return extension;
});
