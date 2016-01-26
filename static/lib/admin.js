'use strict';

define('admin/plugins/anon', ['settings'], function(Settings) {

  var ACP = {};

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
  };

  return ACP;
});