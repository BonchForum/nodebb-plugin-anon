(function(module) {
  "use strict";
  var anon = {},
    settings = {},
    banList = [],
    regexPhrase = /\[\[ANON\]\]/,
    breakLine = '\r\n\r\n',
    signTitle = '###### sign: ',
    winston = module.parent.require('winston'),
    meta = module.parent.require('./meta'),
    crypto = require('crypto');

  anon.init = function(params, callback) {
    var router = params.router,
      hostMiddleware = params.middleware;

    router.get('/admin/plugins/anon', hostMiddleware.admin.buildHeader, render);
    router.get('/api/admin/plugins/anon', render);

    loadSettings()
      .then(function() {
        winston.info('[nodebb-plugin-anon] Settings loaded');
      });

    loadBanList()
      .then(function() {
        winston.info('[nodebb-plugin-anon] Ban list loaded');
      });

    callback();
  }

  anon.filter = function(data, callback) {
    if (settings != null) {
      if (regexPhrase.test(data.content)) {
        var sign = getSign(data.uid.toString());

        if (existInBanList(sign) && hasAccessCategory(data.cid)) {
          return callback(new Error('[[error:no-privileges]]'))
        }

        data.content = data.content.replace(regexPhrase, '') + breakLine + signTitle + sign;
        data.uid = settings.uid;
      }
    }

    return callback(null, data);
  }

  anon.addAdminNavigation = function(header, callback) {
    header.plugins.push({
      route: '/plugins/anon',
      icon: 'fa-tint',
      name: 'Anon'
    });

    callback(null, header);
  }

  function hasAccessCategory(cid) {
    var accessArrayCategory = settings.accessCategory.splice(', ');
    return accessArrayCategory.indexOf(cid);
  }

  function existInBanList(sign) {
    return banList.indexOf(sign) === -1;
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

  function loadBanList() {
    return new Promise(function(res, err) {
      meta.settings.get('anon-banlist', function(err, data) {
        banList = data.signs || [];
        res();
      });
    });
  }

  module.exports = anon;
}(module));