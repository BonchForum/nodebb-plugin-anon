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
      banList.signs.push($('#banSignField').val())
      $('#banSignField').val('');

      socket.emit('admin.settings.set', {
        hash: 'anon-banlist',
        values: banList
      }, function() {
        app.alert({
          type: 'success',
          alert_id: 'anon-saved',
          title: 'Sign add to ban',
          message: 'Please reload your NodeBB to apply these settings',
          clickfn: function() {
            socket.emit('admin.reload');
          }
        });
      });
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
      if (banList.sign == null) {
        banList.signs = new Array();
      }
    });
  };

  return ACP;
});