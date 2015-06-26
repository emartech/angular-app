'use strict';

var EventEmitter = require('events').EventEmitter;

module.exports = function(angular) {

  var App = function(angularApp, config) {
    this._name = config.name;
    this._cssUrl = config.cssUrl;
    this._angularApp = angularApp;
    this._eventEmitter = new EventEmitter();
    this._api = null;

    this._angularApp.on('started', function(api) {
      this._api = api;
      this._eventEmitter.emit('initialized', api);
    }.bind(this));
  };


  App.prototype = {

    runAngularApp: function() {
      this._angularApp.registerModules();
      this._inject();
      this._bootstrap();
    },


    _inject: function() {
      this._injectHtml('<app id="' + this._name + '"></app>');
      this._injectCss(this._cssUrl);
    },


    _bootstrap: function() {
      angular.bootstrap(document.getElementById(this._name), [this._name]);
    },


    getApi: function() {
      return this._api;
    },


    on: function(name, cb) {
      this._eventEmitter.on(name, cb);
    },


    _injectHtml: function(content) {
      angular.element(document.body).append(content);
    },


    _injectCss: function(path) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.setAttribute('href', path);
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      head.appendChild(link);
    }

  };

  return App;

};
