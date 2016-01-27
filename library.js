(function(module) {
  "use strict";
  var anon = {},
    settings = {},
    banList = [],
    alredyPublished = [],
    breakLine = '\r\n\r\n',
    signTitle = '###### sign: ',
    crypto = require('crypto'),
    regexPhrase = /\[\[anon\]\]/i,
    meta = module.parent.require('./meta'),
    winston = module.parent.require('winston');

    anon.init = function(params, callback) {
      var router = params.router,
        hostMiddleware = params.middleware;

      router.get('/admin/plugins/anon', hostMiddleware.admin.buildHeader, render);
      router.get('/api/admin/plugins/anon', render);

      loadSettings()
        .then(function() {
          if (settings.timeToClearPublishedList) {
            setInterval(clearAlredyPublishedList, settings.timeToClearPublishedList * 36e5);
          }
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

        if (!existInBanList(sign) || !hasAccessCategory(data.cid) || isAlredyPublish(sign)) {
          return callback(new Error('[[error:no-privileges]]'))
        }

        alredyPublished.push(sign);

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

  function clearAlredyPublishedList() {
    alredyPublished = [];
  }

  function isAlredyPublish(sign) {
    return alredyPublished.indexOf(sign) !== -1;
  }

  function hasAccessCategory(cid) {
    var accessArrayCategory = settings.accessCategory.split(', ');
    return accessArrayCategory.indexOf(cid.toString()) !== -1;
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