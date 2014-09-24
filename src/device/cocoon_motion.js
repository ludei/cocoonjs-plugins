Cocoon.define("Cocoon.Motion" , function(extension){
    "use strict";
    /**
    * All functions related to the Accelerometer and Gyroscope.
    * @namespace Cocoon.Motion
    */
    extension.nativeAvailable = Cocoon.nativeAvailable;

    /**
     * Setups the update interval in seconds (1 second / X frames) to receive the accelerometer updates.
     * It defines the rate at which the devicemotion events are updated.
     * @function setAccelerometerInterval
     * @memberOf Cocoon.Motion
     * @param {number} seconds The update interval in seconds to be set.
     * @example
     * Cocoon.Motion.setAccelerometerInterval(2);
     */
    extension.setAccelerometerInterval = function (updateIntervalInSeconds) {
        if (Cocoon.Motion.nativeAvailable) {
            return window.ext.IDTK_APP.makeCall("setAccelerometerUpdateIntervalInSeconds", updateIntervalInSeconds);
        }
    };

    /**
     * Returns the update interval in seconds that is currently set for accelerometer related events.
     * @function getAccelerometerInterval
     * @memberOf Cocoon.Motion
     * @return {number} The update interval in seconds that is currently set for accelerometer related events.
     * @example
     * console.log(Cocoon.Motion.getAccelerometerInterval());
     */
    extension.getAccelerometerInterval = function () {
        if (Cocoon.Motion.nativeAvailable) {
            return window.ext.IDTK_APP.makeCall("getAccelerometerUpdateIntervalInSeconds");
        }
    };

    /**
     * Setups the update interval in seconds (1 second / X frames) to receive the gyroscope updates.
     * It defines the rate at which the devicemotion and deviceorientation events are updated.
     * @function setGyroscopeInterval
     * @memberOf Cocoon.Motion
     * @param {number} seconds The update interval in seconds to be set.
     * @example
     * Cocoon.Motion.setGyroscopeInterval(2);
     */
    extension.setGyroscopeInterval = function (updateIntervalInSeconds) {
        if (Cocoon.Motion.nativeAvailable) {
            return window.ext.IDTK_APP.makeCall("setGyroscopeUpdateIntervalInSeconds", updateIntervalInSeconds);
        }
    };

    /**
     * Returns the update interval in seconds that is currently set for gyroscope related events.
     * @function getGyroscopeInterval
     * @memberOf Cocoon.Motion
     * @return {number} The update interval in seconds that is currently set for gyroscope related events.
     * @example
     * console.log(Cocoon.Motion.getGyroscopeInterval());
     */
    extension.getGyroscopeInterval = function () {
        if (Cocoon.Motion.nativeAvailable) {
            window.ext.IDTK_APP.makeCall("getGyroscopeUpdateIntervalInSeconds");
        }
    };

    return extension;

});