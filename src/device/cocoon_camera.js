Cocoon.define("Cocoon.Camera" , function(extension) {

    /**
    * This namespace represents the CocoonJS camera extension API.
    *
    * <div class="alert alert-success">
	*   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Camera/videopuzzle">Videopuzzle demo</a>.
	*</div>
    *   
    * @namespace Cocoon.Camera
    * @example
    * Cocoon.Camera.start({
    * success : function(stream){
    *     ctx.fillRect(0, 0, w, h);
    *     ctx.drawImage(stream, 0, 0, w, h);
    * },
    * error : function(){
    *   console.log("Error", arguments);
    * }
    * });
    */

    navigator.getUserMedia_ = ( navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia);
    
    /**
    * 
    * @namespace 
    */

    /**
     * The predefined possible camera types.
     * @memberof Cocoon.Camera
     * @name Cocoon.Camera.CameraType
     * @property {object} Cocoon.Camera.CameraType - The object itself
     * @property {string} Cocoon.Camera.CameraType.FRONT - Represents the front camera on the device.
     * @property {string} Cocoon.Camera.CameraType.BACK - Represents the back camera on the device.
     */
	extension.CameraType = {
	    FRONT : "FRONT",
	    BACK : "BACK"
	};

    /**
     * The predefined possible camera video capturing image format types.
     * @memberof Cocoon.Camera
     * @name Cocoon.Camera.CaptureFormatType
     * @property {string} Cocoon.Camera.CaptureFormatType - The object itself
     * @property {string} Cocoon.Camera.CaptureFormatType.JPEG 
     * @property {string} Cocoon.Camera.CaptureFormatType.RGB_565 
     * @property {string} Cocoon.Camera.CaptureFormatType.NV21 
     * @property {string} Cocoon.Camera.CaptureFormatType.NV16 
     * @property {string} Cocoon.Camera.CaptureFormatType.YUY2 
     * @property {string} Cocoon.Camera.CaptureFormatType.YV12 
     * @property {string} Cocoon.Camera.CaptureFormatType.BGRA32 
     */
	extension.CaptureFormatType = {
	    JPEG : "JPEG",
	    RGB_565 : "RGB_565",
	    NV21 : "NV21", 
	    NV16 : "NV16",
	    YUY2 : "YUY2",
	    YV12 : "YV12",
	    BGRA32 : "32BGRA"
	};

	/**
     * The object that represents the information of a camera. It includes all the information to be able to setup a camera to capture video or to take pictures.
     * @memberof Cocoon.Camera
     * @name Cocoon.Camera.CameraInfo
     * @property {string} Cocoon.Camera.CameraInfo - The object itself
     * @property {string} Cocoon.Camera.CameraInfo.cameraIndex The index of the camera.
     * @property {Cocoon.Camera.CameraType} Cocoon.Camera.CameraType The type of the camera among the possible values in {@link Cocoon.Camera.CameraType}.
     * @property {string} Cocoon.Camera.CameraInfo.supportedVideoSizes An array of {@link Cocoon.Size} values that represent the supported video sizes for the camera.
     * @property {string} Cocoon.Camera.CameraInfo.supportedVideoFrameRates An array of numbers that represent the supported video frame rates for the camera.
     * @property {string} Cocoon.Camera.CameraInfo.supportedImageFormats An array of {@link Cocoon.Camera.CaptureFormatType} values that represent the supported video format types for the camera.
     */
	extension.CameraInfo =  {

		cameraIndex : 0,

		cameraType : extension.CameraType.BACK,

		supportedVideoSizes : [],

		supportedVideoFrameRates : [],

		supportedVideoCaptureImageFormats : []
	};

	/**
	* Returns the number of available camera in the platform/device.
	* @memberof Cocoon.Camera
	* @function getNumberOfCameras
	* @returns {number} The number of cameras available in the platform/device.
	* @example
	* console.log(Cocoon.Camera.getNumberOfCameras());
	*/
	extension.getNumberOfCameras = function()
	{
		if (Cocoon.nativeAvailable && navigator.isCocoonJS)
		{
			return Cocoon.callNative("IDTK_SRV_CAMERA", "getNumberOfCameras", arguments);
		}else{
			return (navigator.getUserMedia_) ? 1 : 0;
		}
	};

	/**
	* Returns an array of {@link Cocoon.Camera.CameraInfo} objects representing all the information of all the cameras available in the platform/device.
	* @memberof Cocoon.Camera
	* @function getAllCamerasInfo
	* @returns {Array} An array of {@link Cocoon.Camera.CameraInfo} objects.
	* @example
	* console.log(JSON.stringify(Cocoon.Camera.getAllCamerasInfo()));
	*/
	extension.getAllCamerasInfo = function()
	{
		if (Cocoon.nativeAvailable && navigator.isCocoonJS)
		{
			return Cocoon.callNative("IDTK_SRV_CAMERA", "getAllCamerasInfo", arguments);
		}
	};

	/**
	* Returns the {@link Cocoon.Camera.CameraInfo} object that represents all the information of the specified camera index in the platform/device.
	* @memberof Cocoon.Camera
	* @function getCameraInfoByIndex
	* @param {number} cameraIndex The index of the camera to get the info from. The index should be between 0 and N (Being N the value returned by {@link Cocoon.Camera.getNumberOfCameras}).
	* @returns {Cocoon.Camera.CameraInfo} The {@link Cocoon.Camera.CameraInfo} of the given camera index.
	* @example
	* console.log(JSON.stringify(Cocoon.Camera.getCameraInfoByIndex(0)));
	*/
	extension.getCameraInfoByIndex = function(cameraIndex)
	{
		if (Cocoon.nativeAvailable && navigator.isCocoonJS)
		{
			return Cocoon.callNative("IDTK_SRV_CAMERA", "getCameraInfoByIndex", arguments);
		}
	};

	/**
	* Returns the {@link Cocoon.Camera.CameraInfo} object that represents all the information of the first camera of the specified type found in the platform/device.
	* @memberof Cocoon.Camera
	* @function getCameraInfoByType
	* @param {Cocoon.Camera.CameraType} cameraType The type of the camera to get the info from. 
	* @returns {Cocoon.Camera.CameraInfo} The {@link Cocoon.Camera.CameraInfo} of the first camera of the given camera type that has been found in the platform/device.
	*/
	extension.getCameraInfoByType = function(cameraType)
	{
		if (Cocoon.nativeAvailable && navigator.isCocoonJS)
		{
			return Cocoon.callNative("IDTK_SRV_CAMERA", "getCameraInfoByType", arguments);
		}
	};
	
	/**
	* Starts a camera to capture video. The developer must specify at least the index of the camera to be used. Some other setup parameters can also be passed to control the video capture. An image object
	* that will be automatically updated with the captured frames is returned so the developer just need to draw the image in every frame. A null image object is returned if the setup did not work or there is
	* no available camera.
	* @memberof Cocoon.Camera
	* @function start
	* @param {object} params - The object itself
	* @param {number} params.cameraIndex The index of the camera to start video capture with.
	* @param {number} params.captureWidth The hozirontal size of the video capture resolution. If the value does not correspond to any of the sizes supported by the camera, the closest one is used. See {@link Cocoon.Camera.CameraInfo}.
	* If no value is given, the maximum size available is used.
	* @param {number} params.captureHeight The vertical size of the video capture resolution. If value does not correspond to any of the sizes supported by the camera, the closest one is used. See {@link Cocoon.Camera.CameraInfo}.
	* If no value is given, the maximum size available is used.
	* @param {number} params.captureFrameRate The frame rate to capture the video at. If the value does not correspond to any of the frame rates supported by the camera, the closest one is used. See {@link Cocoon.Camera.CameraInfo}.
	* If no value is given, the maximum frame rate available is used.
	* @param {value} params.captureImageFormat A value from the available {@link Cocoon.Camera.CaptureFormatType} formats to specify the format of the images that will be captured. See {@link Cocoon.Camera.CameraInfo}.
	* If no value is given, the first available capture image format is used.
	* @returns {image} An image object that will automatically update itself with the captured frames or null if the camera capture could not start.
	* @example
	* 	Cocoon.Camera.start({
	* 	  success : function(stream){
	* 	      ctx.fillRect(0, 0, w, h);
	* 	      ctx.drawImage(stream, 0, 0, w, h);
	* 	  },
	* 	  error : function(){
	* 	    console.log("Error", arguments);
	* 	  }
	* 	});
	*/
	extension.start = function(params) {

		if( !((Boolean(params.success)) && (Boolean(params.error))) ) throw new Error("Missing callbacks for Cocoon.Camera.start();");

		if (Cocoon.nativeAvailable)
		{
			var properties = {
				cameraIndex : 0, 
				width : 50, 
				height : 50,
				frameRate : 25
			};

			var args = Cocoon.clone(properties,params);
			var img = Cocoon.callNative("IDTK_SRV_CAMERA", "startCapturing", args);
			
			if(Boolean(img)) { params.success(img); }else{ params.error(false); }
            
		}else{
			navigator.getUserMedia_( {
              video:true, audio:false
            },    
            function(stream) {
                params.success(stream);
            },
            function(error) {
                params.error(error);
            });

		}
	};

	/**
	* Stops a camera that is already started capturing video.
	* @memberof Cocoon.Camera
	* @function stop
	* @param cameraIndex The index of the camera to stop capturing video.
	*/
	extension.stop = function(cameraIndex)
	{
		if (Cocoon.nativeAvailable && navigator.isCocoonJS)
		{
			return Cocoon.callNative("IDTK_SRV_CAMERA", "stopCapturing", arguments);
		}
	};

	/**
	* Indicates if a camera is capturing video or not.
	* @memberof Cocoon.Camera
	* @function isCapturing
	* @param cameraIndex The index of the camera to check if is capturing video or not.
	* @returns {boolean} A flag indicating if the given camera (by index) is capturing video (true) or not (false).
	*/
	extension.isCapturing = function(cameraIndex)
	{
		if (Cocoon.nativeAvailable && navigator.isCocoonJS)
		{
			return Cocoon.callNative("IDTK_SRV_CAMERA", "isCapturing", arguments);
		}
	};

	return extension;
});