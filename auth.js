'use strict';

var session = require('./shared/redisSession');

module.exports = {

    authorizeSocket: function(socket, callback) {

        socket.on('auth', function(data) {

            if(!data.token) {
                return socket.emit('authFail', 'Invalid token "'+data.token+'"');
            }

            session.get(data.token, function(err, sess) {
                if(err) {
                    return callback(err, socket);
                }
                if(!sess) {
                    return callback('no session', socket);
                }

                callback(null, socket, sess);
            });
        });
    }
};