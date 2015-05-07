Cocoon.define("Cocoon.Ad" , function(extension){
    "use strict";

    /**
    * This namespace represents the Cocoon Advertisement extension API.
    *
    * <div class="alert alert-success">
	*   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Ads">Ads demo</a>.
	*</div>
    *
	* <div class="alert alert-warning">
	*    <strong>Warning!</strong> This JavaScript extension requires some configuration parameters on the <a href="https://ludei.zendesk.com/hc/en-us">cloud compiler</a>!
	* </div>
    * @namespace Cocoon.Ad
    * @example
    * // This example shows how to integrate ads in your game
    * Cocoon.Ad.banner.on("shown" , function(){
    * 	console.log("Banner shown!");
    * });
    * Cocoon.Ad.banner.on("ready" , function(){
    * 	Cocoon.Ad.setBannerLayout(Cocoon.Ad.BannerLayout.BOTTOM_CENTER);
    * 	Cocoon.Ad.showBanner();
    * });
    * Cocoon.Ad.banner.on("hidden" , function(){
    * 	console.log("Banner hidden!");
    * });
    * // Fetch a banner, the above callbacks will handle it.
    * Cocoon.Ad.loadBanner();
    */

    extension.nativeAvailable = (!!Cocoon.nativeAvailable) && (!!window.ext.IDTK_SRV_AD);

    /**
    * The predefined possible layouts for a banner ad.
	* @name Cocoon.Ad.BannerLayout
	* @memberOf Cocoon.Ad
	* @property {string} TOP_CENTER  Specifies that the banner must be shown in the top of the screen and vertically centered.
	* @property {string} BOTTOM_CENTER  Specifies that the banner must be shown in the bottom of the screen and vertically centered.
	*/
	extension.BannerLayout = 
	{

	    TOP_CENTER      : "TOP_CENTER",

	    BOTTOM_CENTER   : "BOTTOM_CENTER"
	};
	
	/**
    * A rectangle object that contains the banner dimensions
	* @memberOf Cocoon.Ad
	* @function Rectangle
	* @private
	* @param {number} x The top lef x coordinate of the rectangle
	* @param {number} y The top lef y coordinate of the rectangle
	* @param {number} width The rectangle width
	* @param {number} height The rectangle height
	* @example
	* var rect = new Cocoon.Ad.Rectangle(0,0,300,300);
	*/
	extension.Rectangle = function(x, y, width, height) 
	{
	
	    this.x = x;

	    this.y = y;

	    this.width = width;

	    this.height = height;
	};

	extension.Banner = function(id)
	{
		if (typeof id !== 'number') throw "The given ad ID is not a number.";

		this.id = id;
		var me = this;

		this.onBannerShown = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onbannershow", function(sourceListener, args)
    	{
    		if (me.id === args[0]) 
    		{
    			sourceListener();
    		}
    	});

		this.onBannerHidden = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onbannerhide", function(sourceListener, args)
    	{
    		if (me.id === args[0]) 
    		{
    			sourceListener();
    		}
    	});

		this.onBannerReady = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onbannerready", function(sourceListener, args)
    	{
    		if (me.id === args[0]) 
    		{
    			sourceListener(args[1], args[2]);
    		}
    	});

    	var signal = new Cocoon.Signal.createSignal();

		signal.register("ready", this.onBannerReady);

		signal.register("shown", this.onBannerShown);

		signal.register("hidden", this.onBannerHidden);

		this.on = signal.expose();
	};

	extension.Banner.prototype = {

		showBanner : function()
		{
			if (Cocoon.Ad.nativeAvailable)
			{
				Cocoon.callNative("IDTK_SRV_AD", "showBanner", [this.id], true);
			}
		},

		hideBanner : function()
		{
			if (Cocoon.Ad.nativeAvailable)
			{
				Cocoon.callNative("IDTK_SRV_AD", "hideBanner", [this.id], true);
			}
		},

		load : function()
		{
			if (Cocoon.Ad.nativeAvailable)
			{
				Cocoon.callNative("IDTK_SRV_AD", "refreshBanner", [this.id], true);
			}
		},

		getRectangle : function()
		{
			if (Cocoon.Ad.nativeAvailable)
			{
				return Cocoon.callNative("IDTK_SRV_AD", "getRectangle", [this.id]);
			}
		},

		setRectangle : function(rect)
		{
			if (Cocoon.Ad.nativeAvailable)
			{
				return Cocoon.callNative("IDTK_SRV_AD", "setRectangle", [this.id, rect]);
			}
		},

		setBannerLayout : function(bannerLayout)
		{
			if (Cocoon.Ad.nativeAvailable)
			{
				return Cocoon.callNative("IDTK_SRV_AD", "setBannerLayout", [this.id, bannerLayout]);
			}
		}
	};

	extension.Interstitial = function(id)
	{
		if (typeof id !== 'number') throw "The given ad ID is not a number.";

		this.id = id;
		var me = this;

		this.onFullScreenShown = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenshow", function(sourceListener, args)
    	{
    		if (me.id === args[0]) {
    			sourceListener();
    		}
    	});

    	this.onFullScreenHidden = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenhide", function(sourceListener, args)
    	{
    		if (me.id === args[0]) {
    			sourceListener();
    		}
    	});

    	this.onFullScreenReady = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenready", function(sourceListener, args)
    	{
    		if (me.id === args[0]) {
    			sourceListener();
    		}
    	});

    	var signal = new Cocoon.Signal.createSignal();

		signal.register("ready", this.onFullScreenReady);
		signal.register("shown", this.onFullScreenShown);
		signal.register("hidden", this.onFullScreenHidden);

		this.on = signal.expose();

	};

	extension.Interstitial.prototype = {

		showInterstitial : function()
		{
			if (Cocoon.Ad.nativeAvailable)
			{
				return Cocoon.callNative("IDTK_SRV_AD", "showFullScreen", [this.id], true);
			}
		},

		refreshInterstitial : function()
		{
			if (Cocoon.Ad.nativeAvailable)
			{
				return Cocoon.callNative("IDTK_SRV_AD", "refreshFullScreen", [this.id], true);
			}
		}
	};

	extension.configure = function(parameters)
	{
        if (typeof parameters === "undefined") {
            parameters = {};
        }

		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "requestInitialization", arguments, true);
		}
	};

	extension.createBanner = function(parameters)
	{
		if (typeof parameters === "undefined") {
            parameters = {};
        }

		if (Cocoon.Ad.nativeAvailable)
		{
			var adId = Cocoon.callNative("IDTK_SRV_AD", "createBanner", [parameters]);
			var banner = new extension.Banner(adId);

			return banner;
		}
	};

	extension.releaseBanner = function(banner)
	{
		if (typeof banner === "undefined") {
            throw "The banner ad object to be released is undefined"
        }

		if (Cocoon.Ad.nativeAvailable)
		{
			Cocoon.callNative("IDTK_SRV_AD", "releaseBanner", [banner.id]);
		}
	};

	extension.createInterstitial = function(parameters)
	{
		if (typeof parameters === "undefined") {
            parameters = {};
        }

		if (Cocoon.Ad.nativeAvailable)
		{
			var adId = Cocoon.callNative("IDTK_SRV_AD", "createFullscreen", [parameters]);
			var fullscreen = new Cocoon.Ad.Interstitial(adId);

			return fullscreen;
		}
	};

	extension.releaseInterstitial = function(fullscreen)
	{
		if (!fullscreen) {
            throw "The fullscreen ad object to be released is undefined"
        }

		if (Cocoon.Ad.nativeAvailable)
		{
			Cocoon.callNative("IDTK_SRV_AD", "releaseFullscreen", [fullscreen.id]);
		}
	};

	/**
    * Shows a banner ad if available.
	* @memberOf Cocoon.Ad
	* @function showBanner
	* @example
	* Cocoon.Ad.showBanner();
	*/
	extension.showBanner = function()
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "showBanner", arguments, true);
		}
	};

	/**
    * Hides the banner ad if it was being shown.
	* @memberOf Cocoon.Ad
	* @function hideBanner
	* @example
	* Cocoon.Ad.hideBanner();
	*/
	extension.hideBanner = function()
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "hideBanner", arguments, true);
		}
	};

	/**
    * Loads a new banner ad.
	* @memberOf Cocoon.Ad
	* @function refreshBanner
	* @private
	* @example
	* Cocoon.Ad.refreshBanner();
	*/
	extension.refreshBanner = function()
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "refreshBanner", arguments, true);
		}
	};

	/**
    * Loads a new interstitial ad.
	* @memberOf Cocoon.Ad
	* @function showInterstitial
	* @example
	* Cocoon.Ad.showInterstitial();
	*/
	extension.showInterstitial = function()
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "showFullScreen", arguments, true);
		}
	};

	/**
    * Shows a full screen ad if available.
	* @memberOf Cocoon.Ad
	* @function refreshInterstitial
	* @private
	* @example
	* Cocoon.Ad.refreshInterstitial();
	*/
	extension.refreshInterstitial = function()
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "refreshFullScreen", arguments, true);
		}
	};

	/**
    * Makes a request to preload a banner ad.
	* @memberOf Cocoon.Ad
	* @function loadBanner
	* @example
	* Cocoon.Ad.loadBanner();
	*/
	extension.preloadedBanner = false;
	extension.loadBanner = function()
	{
		if (Cocoon.Ad.nativeAvailable){
			if (Cocoon.Ad.preloadedBanner) {
				return Cocoon.Ad.refreshBanner();
			}else{
				Cocoon.Ad.preloadedBanner = true;
				return Cocoon.callNative("IDTK_SRV_AD", "preloadBanner", arguments, true);
			}
		}
	};

	/**
    * Makes a request to load a full screen ad (interstitial).
	* @memberOf Cocoon.Ad
	* @function loadInterstitial
	* @example
	* Cocoon.Ad.loadInterstitial();
	*/
	extension.preloadedInterstitial = false;
	extension.loadInterstitial = function()
	{
		if (Cocoon.Ad.nativeAvailable){
			if (Cocoon.Ad.preloadedInterstitial) {
				return Cocoon.Ad.refreshInterstitial();
			}else{
				Cocoon.Ad.preloadedInterstitial = true;
				return Cocoon.callNative("IDTK_SRV_AD", "preloadFullScreen", arguments, true);
			}
		}
	};

	/**
    * Sets the rectangle where the banner ad is going to be shown.
	* @memberOf Cocoon.Ad
	* @function setRectangle
	* @private
	* @param {Cocoon.Ad.Rectangle} rect The rectangle representing the banner position and domensions.
	* @example
	* Cocoon.Ad.setRectangle();
	*/
	extension.setRectangle = function()
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "setRectangle", arguments);
		}
	};

	/**
    * Gets the rectangle representing the banner screen position.
	* @memberOf Cocoon.Ad
	* @private
	* @function getRectangle
	* @example
	* Cocoon.Ad.getRectangle();
	*/
	extension.getRectangle = function()
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "getRectangle", arguments);
		}
	};

	/**
    * Sets the rectangle where the banner ad is going to be shown.
	* @memberOf Cocoon.Ad
	* @function setBannerLayout
	* @param {Cocoon.Ad.BannerLayout} bannerLayout The layout where the bannerwill be placed.
	* @example
	* Cocoon.Ad.load();
	*/
	extension.setBannerLayout = function(bannerLayout)
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "setBannerLayout", arguments);
		}
	};

	/**
    * Get the IDFA code in case of being in a iOS platform
	* @memberOf Cocoon.Ad
	* @function getIDFA
	* @return The IDFA identifier or an empty string in case it doens't exist
	* @example
	* Cocoon.Ad.getIDFA();
	*/
	extension.getIDFA = function()
	{
		if (Cocoon.Ad.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_AD", "getIDFA", arguments);
		}
	};

	extension.onBannerShown = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onbannershow");

	extension.onBannerHidden = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onbannerhide"); 

	extension.onBannerReady = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onbannerready"); 

	extension.onFullScreenShown = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenshow"); 

	extension.onFullScreenHidden = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenhide");

	extension.onFullScreenReady = new Cocoon.EventHandler("IDTK_SRV_AD", "Ad", "onfullscreenready"); 

	var signal = new Cocoon.Signal.createSignal();

	/**
     * Allows to listen to events called when a banner is ready.
     * @event On banner ready
     * @memberof Cocoon.Ad
     * @param {number} width The banner width
     * @param {number} height The banner height
     * @example
     * Cocoon.Ad.banner.on("ready", function(width, height){
     *  ...
     * });
     */
	signal.register("ready", extension.onBannerReady);
	/**
     * Allows to listen to events called when a banner is shown.
     * @event On banner shown
     * @memberof Cocoon.Ad
     * @example
     * Cocoon.Ad.banner.on("shown", function(){
     *  ...
     * });
     */
	signal.register("shown", extension.onBannerShown);
	/**
     * Allows to listen to events called when a banner is hidden.
     * @event On banner hidden
     * @memberof Cocoon.Ad
     * @example
     * Cocoon.Ad.banner.on("hidden", function(){
     *  ...
     * });
     */
	signal.register("hidden", extension.onBannerHidden);

	extension.banner = {};
	extension.banner.on = signal.expose();

	var signal = new Cocoon.Signal.createSignal();

	/**
     * Allows to listen to events called when a full screen ad is ready.
     * @event On interstitial ready
     * @memberof Cocoon.Ad
     * @example
     * Cocoon.Ad.interstitial.on("ready", function(){
     *  ...
     * });
     */
	signal.register("ready", extension.onFullScreenReady);
	/**
     * Allows to listen to events called when a full screen ad is shown.
     * @event On interstitial shown
     * @memberof Cocoon.Ad
     * @example
     * Cocoon.Ad.interstitial.on("shown", function(){
     *  ...
     * });
     */
	signal.register("shown", extension.onFullScreenShown);
	/**
     * Allows to listen to events called when a full screen ad is hidden.
     * @event On interstitial hidden
     * @memberof Cocoon.Ad
     * @example
     * Cocoon.Ad.interstitial.on("hidden", function(){
     *  ...
     * });
     */
	signal.register("hidden", extension.onFullScreenHidden);
	
	extension.interstitial = {};
	extension.interstitial.on = signal.expose();

	return extension;
});