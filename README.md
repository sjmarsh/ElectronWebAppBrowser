# Electron Web App Browser

This is an electron application which is designed to act as a cross-platform container/browser for a specifed self-hosted web application, eg. a self-hosted .Net Blazor application.  The aim is to make the web application appear to be running as a desktop application. While it would be possible to configure your web application to run as a Progressive Web Application (PWA), that approach still needs some trigger to start the background hosting application.  With this applicaiton you can specify the location of your web app executable and have it launch at the same time you open this (electron) application.  It will even wait for the specified url for your web app to be available before attempting to render the page.  

### App details
Created using [Electron Forge](https://www.electronforge.io/). 
Use `npm start` to run in dev or the `npm package/make/publish` options to create a package for your required operating systems (only Windows and Linux have been tested).

The application output is written to a log file, `app.log` located in the root path of the electron app.

### Settings
Settings for the executable location, url and icon can be accessed using a UI settings sreen (press the F11 key to access) or directly by adding/editing a settings.json file located in the root path of the electron app.

### Screenshots
<img alt="Settings Screen" src="https://github.com/sjmarsh/ElectronWebAppBrowser/blob/main/resources/Settings%20Screenshot.png?raw=true" />

<img alt="Settings Screen" src="https://github.com/sjmarsh/ElectronWebAppBrowser/blob/main/resources/Windows%20Screenshot.png?raw=true" />

<img alt="Settings Screen" src="https://github.com/sjmarsh/ElectronWebAppBrowser/blob/main/resources/Linux%20Screenshot.png?raw=true" />

