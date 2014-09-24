/**
 * 
 * @private
 * @namespace Cocoon.Social.Manager
 */
Cocoon.define("Cocoon.Social" , function(extension){

    extension.ManagerService = function() {
       this.services = [];
    }

    extension.ManagerService.prototype = {

        services:null,

        registerSocialService : function(service) {
            this.services.push(service);
        },

        submitAchievement : function(achievementID) {
            for (var i = 0; i < this.services.length; ++i) {
                var service = this.services[i];
                if (!service.readOnlyHint && service.isLoggedIn())  {
                    service.submitAchievement(achievementID, function(error) {
                        if (error)
                            console.error("Error submitting achievement: " + error.message);
                    });
                }
            }
        },

        submitScore : function(score, params) {
            for (var i = 0; i < this.services.length; ++i) {
                var service = this.services[i];
                if (!service.readOnlyHint && service.isLoggedIn())  {
                    service.submitScore(score, function(error) {
                        if (error)
                            console.error("Error submitting score: " + error.message);
                    }, params);
                }
            }
        },

        getLoggedInServices : function() {
            var result= [];

            for (var i = 0; i < this.services.length; ++i) {
                var service = this.services[i];
                if (!service.fakeSocialService &&  service.isLoggedIn())  {
                    result.push(service);
                }
            }
            return result;
        },

        isLoggedInAnySocialService : function() {
            return this.getLoggedInServices().length > 0;
        }
    }

    extension.Manager = new extension.ManagerService();
    
    return extension;
});