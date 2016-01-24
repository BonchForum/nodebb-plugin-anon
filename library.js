(function(module) {
  "use strict";
  var anon = {},
    ssettings = {},
    winston = module.parent.require('winston');

  anon.init = function(params, callback) {
    var router = params.router,
      hostMiddleware = params.middleware;

    router.get('/admin/plugins/anon', hostMiddleware.admin.buildHeader, render);
    router.get('/api/admin/plugins/anon', render);

    callback();
  }

  anon.filter = function(data, callback) {
    winston.info('[nodebb-plugin-anon] ' + data);
    console.log(data);

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

  function render(req, res) {
    res.render('admin/plugins/anon', {});
  }

  function saveSettings() {

  }

  function loadSettings() {
    
  }

  module.exports = anon;
}(module));