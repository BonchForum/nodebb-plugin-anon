(function(module) {
  "use strict";
  var anon = {},
    settings = {},
    blackList = [],
    regexPhrase = /\[\[ANON\]\]/,
    breakLine = '\r\n\r\n',
    winston = module.parent.require('winston'),
    meta = module.parent.require('./meta'),
    crypto = require('crypto');

  anon.init = function(params, callback) {
    var router = params.router,
      hostMiddleware = params.middleware;

    router.get('/admin/plugins/anon', hostMiddleware.admin.buildHeader, render);
    router.get('/api/admin/plugins/anon', render);

    callback();
  }

  anon.filter = function(data, callback) {
    if (regexPhrase.test(data.content)) {
      var sign = getSign(data.uid);
      data.content = data.content.replace(regexPhrase, '') + breakLine + sign;
      data.uid = settings.uid;
    }

    callback(null, data);
  }

  anon.addAdminNavigation = function(header, callback) {
    header.plugins.push({
      route: '/plugins/anon',
      icon: 'fa-tint',
      name: 'Anon'
    });

    callback(null, header);
  }

  function canCreateAnonTopic(sign) {
    return blackList.indexOf(sign) === -1;
  }

  function getSign(uid) {
    return crypto.createHash('sha256').update(uid + settings.salt).digest('base64');
  }

  function render(req, res) {
    res.render('admin/plugins/anon', {});
  }

  function saveSettings() {
    return new Promise(function(res, err) {
      meta.settings.set('anon', settings, function(err, data) {        
        res();
      });
    });
  }

  function loadSettings() {
    return new Promise(function(res, err) {
      meta.settings.get('anon', function(err, data) {
        settings = data;
        res();
      });
    });
  }

  function saveBlackList() {

  }

  function loadBlackList() {

  }


  module.exports = anon;
}(module));