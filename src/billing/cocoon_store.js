Cocoon.define("Cocoon.Store" , function(extension){
    "use strict";

    /**
    * This namespace represents the In-app purchases extension API.
    * <div class="alert alert-success">
	*   Here you will find a demo about this namespace: <a href="https://github.com/ludei/cocoonjs-demos/tree/master/Store-skeleton">Store-skeleton demo</a>.
	*</div>
	*
    * <div class="alert alert-warning">
	*    <strong>Warning!</strong> This JavaScript extension requires some configuration parameters on the <a href="https://ludei.zendesk.com/hc/en-us">cloud compiler</a>!
	* </div>
    * @namespace Cocoon.Store
    * @example
    * // Basic usage, register callbacks first
	* Cocoon.Store.on("purchase",{
	* 	started: function(){ ... },
	* 	success: function(purchaseInfo){ console.log( JSON.stringify(purchaseInfo) ) },
	* 	error: function(productId, err){ ... }
	* });
    * Cocoon.Store.on("load",{
	* 	started: function(){ ... },
	*	success: function(products){
    *		for (var i = 0; i < products.length; i++) {
    *			Cocoon.Store.addProduct(products[i]);
    *			console.log("Adding product to the local database: " + JSON.stringify(products[i]));
    *		};
    *	},
	* 	error: function(errorMessage){ ... }
	* });
	* // Initialize store service
	* Cocoon.Store.initialize({
	*     sandbox: false,
	*     managed: true
	* });
	* // Fetch the products from the store
	* // The callbacks for this event are set in the Cocoon.Store.on("load"); event handler.
    * Cocoon.Store.loadProducts(["magic.sword", "health.potion"]);
    */

    extension.nativeAvailable = (!!Cocoon.nativeAvailable) && (!!window.ext.IDTK_SRV_STORE);

	/**
	* The object that represents the information of a product in the store.
	* @memberof Cocoon.Store
	* @name Cocoon.Store.ProductInfo
	* @property {object} Cocoon.Store.ProductInfo - The object itself
	* @property {string} Cocoon.Store.ProductInfo.productId The id of the product.
	* @property {string} Cocoon.Store.ProductInfo.productAlias The alias of the product.
	* @property {Cocoon.Store.ProductType} Cocoon.Store.ProductInfo.productType The product type.
	* @property {string} Cocoon.Store.ProductInfo.title The title of the product.
	* @property {string} Cocoon.Store.ProductInfo.description The description of the product.
	* @property {string} Cocoon.Store.ProductInfo.price The price of the product.
	* @property {string} Cocoon.Store.ProductInfo.localizedPrice The localized price of the product.
	* @property {string} Cocoon.Store.ProductInfo.downloadURL The URL of the asset to be downloaded for this purchase.
	*/
	extension.ProductInfo = {
		productId : "productId",

		productAlias : "productAlias",

		productType : "productType",

		title : "title",

		description : "description",

		price : "price",

		localizedPrice : "localizedPrice",

		downloadURL : "downloadURL"
	};

	/**
	* The predefined possible states of product types.
	* @memberof Cocoon.Store
	* @name Cocoon.Store.ProductType
	* @property {object} Cocoon.Store.ProductType - The object itself
	* @property {string} Cocoon.Store.ProductType.CONSUMABLE A consumable product. See platform documentation for further information.
	* @property {string} Cocoon.Store.ProductType.NON_CONSUMABLE See platform documentation for further information.
	* @property {string} Cocoon.Store.ProductType.AUTO_RENEWABLE_SUBSCRIPTION An auto-renewable subscription. See platform documentation for further information.
	* @property {string} Cocoon.Store.ProductType.FREE_SUBSCRIPTION A free subscription. See platform documentation for further information.
	* @property {string} Cocoon.Store.ProductType.NON_RENEWABLE_SUBSCRIPTION A non-renewable subscription. See platform documentation for further information.
	*/
	extension.ProductType = 
	{

	    CONSUMABLE : 0,

	    NON_CONSUMABLE : 1,

	    AUTO_RENEWABLE_SUBSCRIPTION : 2,

	    FREE_SUBSCRIPTION : 3,

	    NON_RENEWABLE_SUBSCRIPTION : 4
	};

	/**
	* The predefined possible store types.
	* @memberof Cocoon.Store
	* @name Cocoon.Store.StoreType
	* @property {object} Cocoon.Store.StoreType - The object itself
	* @property {string} Cocoon.Store.StoreType.APP_STORE Apple AppStore.
	* @property {string} Cocoon.Store.StoreType.PLAY_STORE Android Play Store.
	* @property {string} Cocoon.Store.StoreType.MOCK_STORE Mock Store (Used for testing).
	* @property {string} Cocoon.Store.StoreType.CHROME_STORE Chrome AppStore.
	* @property {string} Cocoon.Store.StoreType.AMAZON_STORE Amazon AppStore.
	* @property {string} Cocoon.Store.StoreType.NOOK_STORE Nook Store.
	*/
	extension.StoreType = 
	{

	    APP_STORE : 0,

	    PLAY_STORE : 1,

		MOCK_STORE : 2,

	    CHROME_STORE : 3,

	    AMAZON_STORE : 4,

	    NOOK_STORE : 5
	};

	/**
	* The object that represents the information of a purchase.
	* @memberof Cocoon.Store
	* @name Cocoon.Store.PurchaseInfo
	* @property {object} Cocoon.Store.PurchaseInfo - The object itself
	* @property {string} Cocoon.Store.PurchaseInfo.transactionId The transaction id of a purchase.
	* @property {string} Cocoon.Store.PurchaseInfo.purchaseTime The time when the purchase was done in seconds since 1970.
	* @property {Cocoon.Store.PurchaseState} Cocoon.Store.PurchaseInfo.purchaseState The state of the purchase.
	* @property {string} Cocoon.Store.PurchaseInfo.productId The product id related to this purchase.
	* @property {string} Cocoon.Store.PurchaseInfo.quantity The number of products of the productId kind purchased in this transaction.
	*/
	extension.PurchaseInfo = function(transactionId, purchaseTime, purchaseState, productId, quantity)
	{
		this.transactionId = transactionId;

		this.purchaseTime = purchaseTime;

		this.purchaseState = purchaseState;

		this.productId = productId;

		this.quantity = quantity;

		return this;
	};

	/**
    * The predefined possible states of a purchase.
	* @memberof Cocoon.Store
	* @name Cocoon.Store.PurchaseState
	* @property {object} Cocoon.Store.PurchaseState - The object itself
	* @property {string} Cocoon.Store.PurchaseState.PURCHASED The product has been successfully purchased. The transaction has ended successfully.
	* @property {string} Cocoon.Store.PurchaseState.CANCELED The purchase has been canceled.
	* @property {string} Cocoon.Store.PurchaseState.REFUNDED The purchase has been refunded.
	* @property {string} Cocoon.Store.PurchaseState.EXPIRED The purchase (subscriptions only) has expired and is no longer valid.
    */
	extension.PurchaseState = 
	{

	    PURCHASED : 0,

	    CANCELED : 1,

	    REFUNDED : 2,

	    EXPIRED : 3
	};

	/**
	* Gets the name of the native store implementation. 
	* @memberof Cocoon.Store
	* @function getStoreType
	* @returns {Cocoon.Store.StoreType} The store type.
	* @example
	* console.log(Cocoon.Store.getStoreType());
	*/
	extension.getStoreType = function()
	{
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "getStoreType", arguments);
		}
		else{
			return false;
		}
	};

	/**
	* Starts the Store Service. This will make the system to initialize the 
	* Store Service and probably Store callbacks will start to be received 
	* after calling this method. Because of this, you should have set your event handler 
	* before calling this method, so you don't lose any callback.
	* @memberof Cocoon.Store
	* @function initialize
	* @example
	* Cocoon.Store.initialize();
	*/
	extension.initialize = function(params) 
	{
	    params = params || {};

	    Cocoon.Store.requestInitialization(params);
	    Cocoon.Store.start();  
	};

	/**
	* @memberof Cocoon.Store
	* @function requestInitialization
	* @private
	*/
	extension.requestInitialization = function(parameters) {
        if (typeof parameters === "undefined") 
        {
            parameters = {};
        }
        else
        {
        	if (parameters['managed'] !== undefined) parameters['remote'] = parameters['managed'];
        	if (parameters['sandbox'] !== undefined) parameters['debug'] = parameters['sandbox'];
        }

		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "requestInitialization", arguments, true);
		}
	};

	/**
	* @memberof Cocoon.Store
	* @function start
	* @private
	*/
	extension.start = function() {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "start", arguments);
		}
	};

	/**
	* This method allows you to check is the  Store service is available in this platform. 
	* Not all iOS and Android devices will have the Store service 
	* available so you should check if it is before calling any other method.
	* @memberof Cocoon.Store
	* @function canPurchase
	* @returns {boolean} True if the service is available and false otherwise.
	*/
	extension.canPurchase = function() {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "canPurchase", arguments);
		}else{
			return false;
		}
	};

	/**
	* Fetches the products from the CocoonJS Cloud Compiling service store configuration. 
	* The request is monitored using the "load" signal events.
	* @memberof Cocoon.Store
	* @function fetchProductsFromServer
	* @private
	* @example
	* // First register callbacks
    * Cocoon.Store.on("load",{
    * 	started: function(){ ... },
    * 	success: function(products){ ... },
    * 	error: function(errorMessage){ ... }
    * });
    * // Then call the fetch method
    * Cocoon.Store.fetchProductsFromServer();
	*/
	extension.fetchProductsFromServer = function() {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "fetchProductsFromServer", arguments, true);
		}
	};

	/**
	* Fetches the products information from the Store. 
	* The request is monitored using the "load" signal events.
	* @memberof Cocoon.Store
	* @function loadProducts
	* @example
	* // First register callbacks
    * Cocoon.Store.on("load",{
    * 	started: function(){ ... },
    * 	success: function(products){ ... },
    * 	error: function(errorMessage){ ... }
    * });
    * // Then call the fetch method
    * Cocoon.Store.loadProducts(["magic.sword", "health.potion"]);
	*/
	extension.loadProducts = function(productIds) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "fetchProductsFromStore", arguments, true);
		}
	};

	/**
	* Finishes a purchase transaction and removes the transaction from the transaction queue. 
	* This method must be called after a purchase finishes successfully and the "success" 
	* event inside of the "on purchase products" callback has been received. 
	* If the purchase includes some asset to download from an external server this method must be called after the asset has been successfully downloaded. 
	* If you do not finish the transaction because the asset has not been correctly downloaded the {@link Cocoon.Store.onProductPurchaseStarted} method will be called again later on.
	* @memberof Cocoon.Store
	* @function finish
	* @param {string} transactionId The transactionId of the purchase to finish.
	*/ 
	extension.finish = function(transactionId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "finishPurchase", arguments, true);
		}
	};

	/**
	* Consumes a purchase. This makes that product to be purchasable again. 
	* @memberof Cocoon.Store
	* @function consume
	* @param {string} transactionId The transaction Id of the purchase to consume.
	* @param {string} productId The product Id of the product to be consumed.
	* @example
    * Cocoon.Store.on("consume",{
    * 	started: function(transactionId){ ... },
    * 	success: function(transactionId){ ... },
    * 	error: function(transactionId, err){ ... }
    * });
	* Cocoon.Store.consume("magic.sword");
	*/ 
	extension.consume = function(transactionId, productId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "consumePurchase", arguments, true);
		}
	};

	/**
	* Requests a product purchase given it's product id. 
	* @memberof Cocoon.Store
	* @function purchase
	* @param {string} productId The id or alias of the product to be purchased.
	* @example
    * Cocoon.Store.on("purchase",{
    * 	started: function(productId){ ... },
    * 	success: function(purchaseInfo){ ... },
    * 	verification: function(productId,data){ ... }, // This callback will be fired only when using "unmanaged" mode
    * 	error: function(productId, err){ ... }
    * });
	* Cocoon.Store.purchase("magic.sword");
	*/ 
	extension.purchase = function(productId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "purchaseFeature", arguments, true);
		}
	};

	/**
	* Requests a product purchase given it's product id showing a modal progress dialog. 
	* @memberof Cocoon.Store
	* @function puchaseProductModal
	* @param {string} productId The id or alias of the product to be purchased.
	* @private
	* @example
    * Cocoon.Store.on("purchase",{
    * 	started: function(productId){ ... },
    * 	success: function(purchaseInfo){ ... },
    * 	verification: function(productId,data){ ... }, // This callback will be fired only when using "unmanaged" mode
    * 	error: function(productId, err){ ... }
    * });
	* Cocoon.Store.puchaseProductModal("magic.sword");
	*/ 
	extension.puchaseProductModal = function(productId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "purchaseFeatureModal", arguments, true);
		}
	};

	/**
	* Requests a product purchase given it's product id showing a modal progress dialog. 
	* @memberof Cocoon.Store
	* @function purchaseProductModalWithPreview
	* @param {string} productId The id or alias of the product to be purchased.
	* @private
	* @example
    * Cocoon.Store.on("purchase",{
    * 	started: function(productId){ ... },
    * 	success: function(purchaseInfo){ ... },
    * 	verification: function(productId,data){ ... }, // This callback will be fired only when using "unmanaged" mode
    * 	error: function(productId, err){ ... }
    * });
	* Cocoon.Store.purchaseProductModalWithPreview("magic.sword");
	*/ 
	extension.purchaseProductModalWithPreview = function(productId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "purchaseFeatureModalWithPreview", arguments, true);
		}
	};

	/**
	* Returns if a product has been already purchased or not. 
	* @memberof Cocoon.Store
	* @function isProductPurchased
	* @param {string} productId The product id or alias of the product to be checked.
	* @returns {boolean} A boolean that indicates whether the product has been already purchased.
	*/
	extension.isProductPurchased = function(productId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "isFeaturePurchased", arguments);
		}
	};

	/**
	* Restores all the purchases from the platform's market. 
	* For each already purchased product the event "restore" will be called.
	* @memberof Cocoon.Store
	* @function restore
	* @example
    * Cocoon.Store.on("restore",{
    * 	started: function(){ ... },
    * 	success: function(){ ... },
    * 	error: function(errorMessage){ ... }
    * });
	* Cocoon.Store.restore();
	*/
	extension.restore = function() {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "restorePurchases", arguments, true);
		}
	};

	/**
	* @memberof Cocoon.Store
	* @private
	* @function restore
	* @example
    * Cocoon.Store.on("restore",{
    * 	started: function(){ ... },
    * 	success: function(){ ... },
    * 	error: function(errorMessage){ ... }
    * });
	* Cocoon.Store.restorePurchasesModal();
	*/
	extension.restorePurchasesModal = function() {
		if (Cocoon.Store.nativeAvailable)
		{
		return Cocoon.callNative("IDTK_SRV_STORE", "restorePurchasesModal", arguments, true);
		}
	};

	/**
	* Returns all the locally stored products.
	* @memberof Cocoon.Store
	* @function getProducts
	* @returns {Cocoon.Store.ProductInfo} An array with all the objects available for purchase.
	*/
	extension.getProducts = function() {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "getProducts", arguments);
		}
	};

	/**
	* Adds a product to the products local DB. 
	* @memberof Cocoon.Store
	* @function addProduct
	* @param {Cocoon.Store.ProductInfo} product The product to be added to the local products DB.
	*/
	extension.addProduct = function(product) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "addProduct", arguments);
		}
	};

	/**
	* Removes a product from the products local DB given its productId. 
	* @memberof Cocoon.Store
	* @function removeProduct
	* @param {string} productId The product or alias of the product to be removed from the local products DB.
	*/
	extension.removeProduct = function(productId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "removeProduct", arguments);
		}
	};

	/**
	* Returns all the locally stored purchases.
	* @memberof Cocoon.Store
	* @function getPurchases
	* @returns {Cocoon.Store.PurchaseInfo} An array with all the completed purchases.
	*/
	extension.getPurchases = function() {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "getPurchases", arguments);
		}
	};

	/**
	* Adds a purchase to the local purchases DB. 
	* @memberof Cocoon.Store
	* @function addPurchase
	* @param {Cocoon.Store.PurchaseInfo} purchase The purchase to be added.
	*/
	extension.addPurchase = function(purchase) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "addPurchase", arguments);
		}
	};

	/**
	* Removes a purchase from the local purchases DB given it's transaction id. 
	* @memberof Cocoon.Store
	* @function removePurchase
	* @param {string} transactionId The id of the transaction to be removed.
	*/ 
	extension.removePurchase = function(transactionId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "removePurchase", arguments);
		}
	};

	/**
	* (TESTING ONLY) Simulate a purchase cancel. 
	* This method is not allowed in production services and will only work in Mocks. 
	* @private
	* @memberof Cocoon.Store
	* @function cancelPurchase
	* @param {string} transactionId The transactionId of the purchase to be canceled.
	*/
	extension.cancelPurchase = function(transactionId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "cancelPurchase", arguments);
		}
	};

	/**
	* (TESTING ONLY) Simulates a purchase refundment. 
	* This method is not allowed in production services and will only work in Mocks.
	* @private
	* @memberof Cocoon.Store
	* @function refundPurchase
	* @param {string} transactionId The transactionId of the purchase to be refunded.
	*/
	extension.refundPurchase = function(transactionId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "refundPurchase", arguments);
		}
	};

	/**
	* (TESTING ONLY) Simulates a purchase expiration. 
	* This method is not allowed in production services and will only work in Mocks.
	* @private
	* @memberof Cocoon.Store
	* @function expirePurchase
	* @param {string} transactionId The transactionId of the purchase to be expired.
	*/
	extension.expirePurchase = function(transactionId) {
		if (Cocoon.Store.nativeAvailable)
		{
			return Cocoon.callNative("IDTK_SRV_STORE", "expirePurchase", arguments);
		}
	};

	extension.onProductsFetchStarted = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onProductsFetchStarted");

	extension.onProductsFetchCompleted = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onProductsFetchCompleted"); 

	extension.onProductsFetchFailed = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onProductsFetchFailed"); 

	extension.onProductPurchaseStarted = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onProductPurchaseStarted"); 

	extension.onProductPurchaseVerificationRequestReceived = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onProductPurchaseVerificationRequestReceived");

	extension.onProductPurchaseCompleted = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onProductPurchaseCompleted"); 

	extension.onProductPurchaseFailed = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onProductPurchaseFailed"); 

	extension.onRestorePurchasesStarted = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onRestorePurchasesStarted"); 

	extension.onRestorePurchasesCompleted = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onRestorePurchasesCompleted"); 

	extension.onRestorePurchasesFailed = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onRestorePurchasesFailed");

	extension.onConsumePurchaseStarted = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onConsumePurchaseStarted"); 

	extension.onConsumePurchaseCompleted = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onConsumePurchaseCompleted"); 

	extension.onConsumePurchaseFailed = new Cocoon.EventHandler("IDTK_SRV_STORE", "Store", "onConsumePurchaseFailed");
	
	var signal = new Cocoon.Signal.createSignal();
	
	/**
     * Allows to listen to events about the loading process. 
     * - The callback 'started' receives no parameters when the products fetch has started.
     * - The callback 'success' receives a parameter with the valid products array when the products fetch has completed.
     * - The callback 'error' receives an error message as a parameter when the products fetch has failed.
     * @event On load products callbacks
     * @memberof Cocoon.Store
     * @example
     * Cocoon.Store.on("load",{
     * 	started: function(){ ... },
     * 	success: function(products){ ... },
     * 	error: function(errorMessage){ ... }
     * });
     */
	signal.register("load", {
		started : extension.onProductsFetchStarted,
		success : extension.onProductsFetchCompleted,
		error : extension.onProductsFetchFailed
	});

	/**
     * Allows to listen to events about the purchasing process.
     * - The callback 'started' receives a parameters with the product id of the product being purchased when the purchase of a product starts.
	 * - The callback 'success' receives as parameter the information of the purchase {@link Cocoon.Store.PurchaseInfo} when the purchase of a product succeeds.     
     * - The callback 'verification' receives two parameters, one with the productId of the purchased product and another one with a JSON object containing the data to be verified when a request for purchase verification has been received from the Store. 
     * In Android this JSON object will containt two keys: signedData and signature. You will need that information to verify the purchase against the backend server.
	 * - The callback 'error' receives a parameters with the product id and an error message when the purchase of a product fails.
     * @event On purchase products callbacks
     * @memberof Cocoon.Store
     * @example
     * Cocoon.Store.on("purchase",{
     * 	started: function(productId){ ... },
     * 	success: function(purchaseInfo){ ... },
     * 	verification: function(productId,data){ ... }, // This callback will be fired only when using "unmanaged" mode
     * 	error: function(productId, err){ ... }
     * });
     */
	signal.register("purchase", {
		started : extension.onProductPurchaseStarted,
		success : extension.onProductPurchaseCompleted,
		verification : extension.onProductPurchaseVerificationRequestReceived,
		error : extension.onProductPurchaseFailed
	});

	/**
     * Allows to listen to events about the consuming process.
     * - The callback 'started' receives a parameters with the transaction id of the purchase being consumed when the consume purchase operation has started.
     * - The callback 'success' receives a parameters with the transaction id of the consumed purchase when the consume purchase operation has completed.
     * - The callback 'error' receives a parameters with the transaction id  of the purchase that couldn't be consumed and the error message when the consume purchase operation has failed.
     * @event On consume products callbacks
     * @memberof Cocoon.Store
     * @example
     * Cocoon.Store.on("consume",{
     * 	started: function(transactionId){ ... },
     * 	success: function(transactionId){ ... },
     * 	error: function(transactionId, err){ ... }
     * });
     */
	signal.register("consume", {
		started : extension.onConsumePurchaseStarted,
		success : extension.onConsumePurchaseCompleted,
		error : extension.onConsumePurchaseFailed
	});

	/**
     * Allows to listen to events about the restoring process.
     * - The callback 'started' receives no parameters when the restore purchases operation has started.
     * - The callback 'success' receives no parameters when the restore purchases operation has completed.
     * - The callback 'error' receives an error message as a parameter when the restore purchases operation has failed.
     * @event On restore products callbacks
     * @memberof Cocoon.Store
     * @example
     * Cocoon.Store.on("restore",{
     * 	started: function(){ ... },
     * 	success: function(){ ... },
     * 	error: function(errorMessage){ ... }
     * });
     */
	signal.register("restore", {
		started : extension.onRestorePurchasesStarted,
		success : extension.onRestorePurchasesCompleted,
		error : extension.onRestorePurchasesFailed
	});

	extension.on = signal.expose();

	return extension;
});