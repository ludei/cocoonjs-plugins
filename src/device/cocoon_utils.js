/**
 * This namespace holds different utilities.
 * @namespace Cocoon.Utils
 */
Cocoon.define("Cocoon.Utils" , function(extension){
    "use strict";

    /**
    * Prints in the console the memory usage of the currently alive textures.
    * @function logMemoryInfo
    * @memberOf Cocoon.Utils
    * @example
    * Cocoon.Utils.logMemoryInfo();
    */
    extension.logMemoryInfo = function()
    {
        if (Cocoon.nativeAvailable && navigator.isCocoonJS)
        {
            return Cocoon.callNative("IDTK_APP", "logMemoryInfo", arguments);
        }
    };

    /**
    * Sets the texture reduction options. The texture reduction is a process that allows big images to be reduced/scaled down when they are loaded.
    * Although the quality of the images may decrease, it can be very useful in low end devices or those with limited amount of memory.
    * The function sets the threshold on image size (width or height) that will be used in order to know if an image should be reduced or not.
    * It also allows to specify a list of strings to identify in which images file paths should be applied (when they meet the size threshold requirement) 
    * The developer will still think that the image is of the original size. CocoonJS handles all of the internals to be able to show the image correctly.
    * IMPORTANT NOTE: This function should be called when the application is initialized before any image is set to be loaded for obvious reasons ;).
    * and in which sould be forbid (even if they meet the threshold requirement).
    * @function setTextureReduction
    * @memberOf Cocoon.Utils
    * @param {number} sizeThreshold This parameter specifies the minimun size (either width or height) that an image should have in order to be reduced.
    * @param {string|array} applyTo This parameter can either be a string or an array of strings. It's purpose is to specify one (the string) or more (the array) substring(s) 
    * that will be compared against the file path of an image to be loaded in order to know if the reduction should be applied or not. If the image meets the
    * threshold size requirement and it's file path contains this string (or strings), it will be reduced. This parameter can also be null.
    * @param {string|array} forbidFor This parameter can either be a string or an array of strings. It's purpose is to specify one (the string) or more (the array) substring(s) 
    * that will be compared against the file path of an image to be loaded in order to know if the reduction should be applied or not. If the image meets the
    * threshold size requirement and it's file path contains this string (or strings), it won't be reduced. This parameter should be used in order to mantain the 
    * quality of some images even they meet the size threshold requirement.
    * @example
    * Cocoon.Utils.textureReduction(64);
    */
    extension.textureReduction = function(sizeThreshold, applyTo, forbidFor)
    {
        if (Cocoon.nativeAvailable && navigator.isCocoonJS)
        {
            return Cocoon.callNative("IDTK_APP", "setDefaultTextureReducerThreshold", arguments);
        }
    };

    /**
    * Marks a audio file to be used as music by the system. Cocoon, internally, differentiates among music files and sound files.
    * Music files are usually bigger in size and longer in duration that sound files. There can only be just one music file 
    * playing at a specific given time. The developer can mark as many files as he/she wants to be treated as music. When the corresponding
    * HTML5 audio object is used, the system will automatically know how to treat the audio resource as music or as sound.
    * Note that it is not mandatory to use this function. The system automatically tries to identify if a file is suitable to be treated as music
    * or as sound by checking file size and duration thresholds. It is recommended, though, that the developer specifies him/herself what he/she considers
    * to be music.
    * @function markAsMusic
    * @param {string} filePath File path to be marked as music
    * @memberOf Cocoon.Utils
    * @example
    * Cocoon.Utils.markAsMusic("path/to/file.mp3");
    */
    extension.markAsMusic = function(audioFilePath)
    {
        if (Cocoon.nativeAvailable)
        {
           return Cocoon.callNative("IDTK_APP", "addForceMusic", arguments);
        }
    };

    /**
     * Captures a image of the screen synchronously and saves it to a file. Sync mode allows to capture the screen in the middle of a frame rendering.
     * @function captureScreen
     * @memberof Cocoon.Utils
     * @param {string} fileName Desired file name and format (png or jpg). If no value is passed, "capture.png" value is used by default
     * @param {Cocoon.App.StorageType} storageType The developer can specify the storage where it is stored. If no value is passed, the {@link Cocoon.Utils.StorageType.TMP_STORAGE} value is used by default.
     * @param {Cocoon.Utils.CaptureType} captureType Optional value to choose capture type. See {@link Cocoon.Utils.CaptureType}.
     * - 0: Captures everything.
     * - 1: Only captures cocoonjs surface.
     * - 2: Only captures system views.
     * @param {boolean} saveToGallery Optional value to specify if the capture image should be stored in the device image gallery or not.
     * @throws exception if the image fails to be stored or there is another error.
     * @return The URL of the saved file.
     * @example
     * Cocoon.Utils.captureScreen("myScreenshot.png");
     */
    extension.captureScreen = function (fileName, storageType, captureType, saveToGallery) {
        if (Cocoon.nativeAvailable) {
            return Cocoon.callNative("IDTK_APP", "captureScreen", arguments);
        }
    };

     /**
     * Captures a image of the screen asynchronously and saves it to a file.
     * Async mode captures a final frame as soon as possible.
     * @function captureScreenAsync
     * @memberof Cocoon.Utils
     * @param {string} fileName Desired file name and format (png or jpg). If no value is passed, "capture.png" value is used by default
     * @param {Cocoon.App.StorageType} storageType The developer can specify the storage where it is stored. If no value is passed, the {@see Cocoon.Utils.StorageType.TMP_STORAGE} value is used by default.
     * @param {Cocoon.Utils.CaptureType} captureType Optional value to choose capture type. See {@link Cocoon.Utils.CaptureType}.
     * - 0: Captures everything.
     * - 1: Only captures cocoonjs surface.
     * - 2: Only captures system views.
     * @param {boolean} saveToGallery Optional value to specify if the capture image should be stored in the device image gallery or not.
     * @param {function} callback Response callback, check the error property to monitor errors. Check the 'url' property to get the URL of the saved Image
     * @example
     * Cocoon.Utils.captureScreenAsync("myScreenshot.png", Cocoon.Utils.StorageType.TMP_STORAGE, false, Cocoon.Utils.CaptureType.EVERYTHING, function(){
     * ...
     * });
     */
    extension.captureScreenAsync = function (fileName, storageType, captureType, saveToGallery, callback) {
        if (Cocoon.nativeAvailable) {
            Cocoon.callNative("IDTK_APP", "captureScreen", arguments, true);
        }
    };

    /**
    * Activates or deactivates the antialas functionality from the Cocoon rendering.
    * @function setAntialias
    * @memberOf Cocoon.Utils
    * @param {boolean} enable A boolean value to enable (true) or disable (false) antialias.
    * @example
    * Cocoon.Utils.setAntialias(true);
    */
    extension.setAntialias = function(enable)
    {
        if (Cocoon.nativeAvailable && navigator.isCocoonJS)
        {
           return Cocoon.callNative("IDTK_APP", "setDefaultAntialias", arguments);
        }
    };

    /**
    * Activates or deactivates the webgl functionality from the Cocoon Canvas+ rendering.
    * @function setWebGLEnabled
    * @memberOf Cocoon.Utils
    * @param {boolean} enabled A boolean value to enable (true) or disable (false) webgl in Canvas+.
    * @example
    * Cocoon.Utils.setWebGLEnabled(true);
    */
    extension.setWebGLEnabled = function(enabled)
    {
        if (Cocoon.nativeAvailable)
        {
           return Cocoon.callNative("IDTK_APP", "setDefaultAntialias", arguments);
        }
    };

    /**
     * Enables NPOT (not power of two) textures in Canvas+. 
     * Canvas+ uses POT (power of two) textures by default. Enabling NPOT improves memory usage but may affect performance on old GPUs.
     * @function setNPOTEnabled
     * @memberof Cocoon.Utils
     * @param {boolean} enabled true to enable NPOT Textures
     * @example
     * Cocoon.Utils.setNPOTEnabled(true);
     */
    extension.setNPOTEnabled = function (enabled) {
        if (Cocoon.nativeAvailable && navigator.isCocoonJS) {
            return window.ext.IDTK_APP.makeCall("setNPOTEnabled", enabled);
        }
    };

    /**
     * Sets a max memory threshold in Canvas+ for canvas2D contexts.
     * If the maxMemory is enabled, CocoonJS checks the total amount of texture sizes (images and canvases). 
     * When the memory size reaches the max memory threshold CocoonJS disposes least recently used textures until the memory fits the threshold. 
     * It disposes textures used for JS Image objects (which can be reloaded later if needed).
     * It doesn't dispose canvas objects because they cannot be reconstructed if they are used again in a render operation.
     * @function setMaxMemory
     * @memberof Cocoon.Utils
     * @param {number} memoryInMBs max memory in megabytes
     * @example
     * Cocoon.Utils.setMaxMemory(75);
     */
    extension.setMaxMemory = function (memoryInMBs) {
        if (Cocoon.nativeAvailable && navigator.isCocoonJS) {
            return window.ext.IDTK_APP.makeCall("setMaxMemory", memoryInMBs);
        }
    };

    /**
    * 
    * @memberof Cocoon.Utils
    * @name Cocoon.Utils.CaptureType
    * @property {string} Cocoon.Utils.CaptureType - The base object
    * @property {string} Cocoon.Utils.CaptureType.EVERYTHING - Captures everything, both the CocoonJS GL hardware accelerated surface and the system views (like the WebView).
    * @property {string} Cocoon.Utils.CaptureType.COCOONJS_GL_SURFACE - Captures just the CocoonJS GL hardware accelerated surface.
    * @property {string} Cocoon.Utils.CaptureType.JUST_SYSTEM_VIEWS - Captures just the sustem views (like the webview)
    */
    extension.CaptureType = {
        EVERYTHING:0,
        COCOONJS_GL_SURFACE:1,
        JUST_SYSTEM_VIEWS:2
    };

    /**
    * Queries if a file exists in the specified path and storage type. If none or unknown storage type is specified, the TEMPORARY_STORAGE is used as default.
    * @function existsPath
    * @memberof Cocoon.Utils
    * @param {string} path The relative path to look for inside the storage of the underlying system.
    * @param {Cocoon.App.StorageType} storageType The storage type where to look for the specified path inside the system.
    * @example
    * console.log(Cocoon.Utils.existsPath("file.txt"));
    */
    extension.existsPath = function(path, storageType) {
        if (Cocoon.nativeAvailable){
            return Cocoon.callNative("IDTK_APP", "existsPath", arguments);
        }
        return false;
    }

    /**
    * Setups the internal text texture cache size.
    * In order to improve the performance of fill and stroke operations, a text texture cache is used internally. Once a text is drawn
    * a texture is stored that matches that text and that text configuration. If the same text is called to 
    * be drawn, this cached texture would be used. 
    * This function allows to set the size of the cache. A value of 0 would mean that no cache
    * will be used. 
    * @function setTextCacheSize
    * @memberof Cocoon.Utils
    * @param size {number} The size of the text cache.
    * @example
    * Cocoon.Utils.setTextCacheSize(32);
    */
    extension.setTextCacheSize = function (size) {
        if (Cocoon.nativeAvailable && navigator.isCocoonJS) {
            return Cocoon.callNative("IDTK_APP", "setTextCacheSize", arguments);
        }
    }

    return extension;

});