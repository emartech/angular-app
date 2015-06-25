'use strict';

var EventEmitter = require('events').EventEmitter;

module.exports = function(angular) {

  return class App {

    constructor (angularApp, config) {
      this._name = config.name;
      this._cssUrl = config.cssUrl;
      this._angularApp = angularApp;
      this._eventEmitter = new EventEmitter();
      this._api = null;

      this._angularApp.on('started', (api) => {
        this._api = api;
        this._eventEmitter.emit('initialized', api);
      });
    }


    runAngularApp() {
      this._angularApp.registerModules();
      this._inject();
      this._bootstrap();
    }


    _inject() {
      this._injectHtml(`<app id="${this._name}"></app>`);
      this._injectCss(this._cssUrl);
    }


    _bootstrap() {
      angular.bootstrap(document.getElementById(this._name), [this._name]);
    }


    getApi() {
      return this._api;
    }


    on(name, cb) {
      this._eventEmitter.on(name, cb);
    }


    _injectHtml(content) {
      angular.element(document.body).append(content);
    }


    _injectCss(path) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.setAttribute('href', path);
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      head.appendChild(link);
    }

  }

};
