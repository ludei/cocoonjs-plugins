Cocoon.define("Cocoon.Device" , function(extension){
    "use strict";
    /**
    * All functions related to the device.
    * @namespace Cocoon.Device
    */

    /**
     * An object that defines the getDeviceInfo returned information.
     * @memberof Cocoon.Device
     * @name DeviceInfo
     * @property {object} Cocoon.Device.DeviceInfo - The object itself
     * @property {string} Cocoon.Device.DeviceInfo.os The operating system name (ios, android,...).
     * @property {string} Cocoon.Device.DeviceInfo.version The operating system version (4.2.2, 5.0,...).
     * @property {string} Cocoon.Device.DeviceInfo.dpi The operating system screen density in dpi.
     * @property {string} Cocoon.Device.DeviceInfo.brand  The device manufacturer (apple, samsung, lg,...).
     * @property {string} Cocoon.Device.DeviceInfo.model The device model (iPhone 4S, SAMSUNG-SGH-I997, SAMSUNG-SGH-I997R, etc).
     * @property {string} Cocoon.Device.DeviceInfo.imei The phone IMEI.
     * <br/>Android: The phone IMEI is returned or null if the device has not telephony.
     * <br/>iOS: null is returned as we cannot get the IMEI in iOS, no public API available for that yet.
     * @property {string} Cocoon.Device.DeviceInfo.platformId The platform Id.
     * @property {string} Cocoon.Device.DeviceInfo.odin The Odin generated id: https://code.google.com/p/odinmobile/
     * @property {string} Cocoon.Device.DeviceInfo.openudid The OpenUDID generated Id: https://github.com/ylechelle/OpenUDID
     */
    extension.DeviceInfo = {
        os:         null,
        version:    null,
        dpi:        null,
        brand:      null,
        model:      null,
        imei:       null,
        platformId: null,
        odin:       null,
        openudid:   null
    };

    /**
    * Returns the device UUID.
    * @function getDeviceId
    * @memberof Cocoon.Device
    * @return {string} The device UUID
    * @example
    * console.log(Cocoon.Device.getDeviceId());
    */
    extension.getDeviceId = function() {
        if (Cocoon.nativeAvailable) {
            return window.ext.IDTK_APP.makeCall("getDeviceId");
        }
    };

    /**
     * Returns the device Info.
     * @function getDeviceInfo
     * @memberof Cocoon.Device
     * @return {Cocoon.Device.DeviceInfo} The device Info
     * @example
     * console.log( JSON.stringify(Cocoon.Device.getDeviceInfo()) );
     */
    extension.getDeviceInfo = function() {
        if (Cocoon.nativeAvailable) {
            return window.ext.IDTK_APP.makeCall("getDeviceInfo");
        }
    };

    /**
    * Retrieves the preferred orientation that has been set in the system.
    * @function getOrientation
    * @memberof Cocoon.Device
    * @return {number} The preferred orientation in the system as a combination of the possible {@link Cocoon.Device.Orientations}.
    * @example
    * console.log(Cocoon.Device.getOrientation());
    */
    extension.getOrientation = function() {
        if (Cocoon.nativeAvailable) {
            return window.ext.IDTK_APP.makeCall("getPreferredOrientation");
        }
        else {
            return 0;
        }
    };

    /**
    * Sets the preferred orientation in the system.
    * @function setOrientation
    * @memberof Cocoon.Device
    * @param {number} preferredOrientation The preferred orientation to be set. A combination of the possible {@link Cocoon.Device.Orientations}.
    * @example
    * Cocoon.Device.setOrientation(Cocoon.Device.Orientations.PORTRAIT);
    */
    extension.setOrientation = function(preferredOrientation) {
        if (Cocoon.nativeAvailable) {
            window.ext.IDTK_APP.makeCall("setPreferredOrientation", preferredOrientation);
        }
    }

    /**
     * The predefined possible orientations. There can be a bit level combination of them using the OR operator.
     * @memberof Cocoon.Device
     * @name Cocoon.Device.Orientations
     * @property {string} Cocoon.Device.Orientations - The base object
     * @property {string} Cocoon.Device.Orientations.PORTRAIT - Portrait
     * @property {string} Cocoon.Device.Orientations.PORTRAIT_UPSIDE_DOWN - Portrait upside-down
     * @property {string} Cocoon.Device.Orientations.LANDSCAPE_LEFT - Landscape left
     * @property {string} Cocoon.Device.Orientations.LANDSCAPE_RIGHT - Landscape right
     * @property {string} Cocoon.Device.Orientations.LANDSCAPE - Landscape
     * @property {string} Cocoon.Device.Orientations.BOTH - Both
     */
    extension.Orientations = {
        PORTRAIT : 1,
        PORTRAIT_UPSIDE_DOWN : 2,
        LANDSCAPE_LEFT : 4,
        LANDSCAPE_RIGHT : 8,
        LANDSCAPE : 4 | 8,
        BOTH : 1 | 2 | 4 | 8
    };

    /**
     * Enables or disables the auto lock to control if the screen keeps on after an inactivity period.
     * When the auto lock is enabled and the application has no user input for a short period, the system puts the device into a "sleep” state where the screen dims or turns off.
     * When the auto lock is disabled the screen keeps on even when there is no user input for long times.
     * @function autoLock
     * @name autoLock
     * @memberof Cocoon.Device
     * @param {Bool} enabled A boolean value that controls whether to enable or disable the auto lock.
     * @example
     * Cocoon.Device.autoLock(false);
     */
    extension.autoLock = function (enabled) {
        if (Cocoon.nativeAvailable) {
            return Cocoon.callNative("IDTK_APP", "setAutoLockEnabled", arguments);
        }
    };

    return extension;

});