CocoonJS Plugins
================

Ludei's plugins (also called extensions) are multiplatform Javascript APIs, that work in any of the three environments of CocoonJS: Canvas+, WebView+ and System webview.

Visit [http://doc.ludei.com/latest/](http://doc.ludei.com/latest/) where you'll find detailed documentation for all of the CocoonJS javascript plugins.

You can find the final, minified files in the **"build/"** directory.

Here is a list of the most common APIs you'd be interested in:

* Ads (Mopub, Chartboost, AdMob, etc...)
* Camera (Access to the camera raw data)
* Device (Device APIs to control things like the orientation of your app)
* Dialog (Native prompt and confirm dialogs)
* Motion ( Gyroscope and Accelerometer APIs)
* Multiplayer (Game Center and Google Play Games)
* Notification (Push and local notifications)
* Social ( Facebook, Google Play, Game Center)
* Store
* Touch
* WebView

We hope you find everything you need to get going here, but if you stumble on any problems with the docs or the extensions, just drop us a line at our forum (support.ludei.com) and we'll do our best to help you out.

How to build this project
--------------------
Clone this repo and run the following command.

 `$ npm install`  
 `$ grunt && grunt jsdoc`

This command will create a folder called build/ that will contain cocoon.js and cocoon.min.js.

Useful links
--------------------
How to use: https://www.ludei.com/cocoonjs/how-to-use/  
Documentation: http://doc.ludei.com/latest/  
Cloud compiler: http://cloud.ludei.com
