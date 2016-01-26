'use strict';

define('admin/plugins/anon', ['settings'], function(Settings) {

  var ACP = {},
    banList = [];

  ACP.init = function() {
    Settings.load('anon', $('.anon-settings'));

    $('#save').on('click', function() {
      Settings.save('anon', $('.anon-settings'), function() {
        app.alert({
          type: 'success',
          alert_id: 'anon-saved',
          title: 'Settings Saved',
          message: 'Please reload your NodeBB to apply these settings',
          clickfn: function() {
            socket.emit('admin.reload');
          }
        });
      });
    });

    $('#addBanList').on('click', function() {

    });

    socket.emit('admin.settings.get', {
      hash: 'anon-banlist'
    }, function(err, values) {
      // Parse all values. If they are json, return json
      for (var key in values) {
        if (values.hasOwnProperty(key)) {
          try {
            values[key] = JSON.parse(values[key]);
          } catch (e) {
            // Leave the value as is
          }
        }
      }

      banList = values;
    });
  };

  return ACP;
});