//
// Files Controller
//

'use strict';

var multer = require('multer'),
    settings = require('./../config').files;

module.exports = function() {

    if (!settings.enable) {
        return;
    }

    var app = this.app,
        core = this.core,
        middlewares = this.middlewares,
        models = this.models,
        Room = models.room;

    core.on('files:new', function(file, room, user) {
        var fil = file.toJSON();
        fil.owner = user;
        fil.room = room;

        app.io.room(room._id)
              .broadcast('files:new', fil);
    });

    var fileUpload = multer({
        limits: {
            files: 1
        }
    });

    //
    // Routes
    //
    app.route('/files')
        .all(middlewares.requireLogin)
        .get(function(req, res) {
            req.io.route('files:list');
        })
        .post(fileUpload, function(req, res) {
            req.io.route('files:create');
        });

    app.route('/rooms/:room/files')
        .all(middlewares.requireLogin, middlewares.roomRoute)
        .get(function(req, res) {
            req.io.route('files:list');
        })
        .post(fileUpload, function(req, res) {
            req.io.route('files:create');
        });

    if (settings.provider === 'local') {

        app.route('/files/:id/:name')
            .all(middlewares.requireLogin)
            .get(function(req, res) {
                models.file.findById(req.params.id, function(err, file) {
                    if (err) {
                        // Error
                        return res.send(400);
                    }

                    res.contentType(file.type);
                    res.sendfile(settings.local.upload_dir + '/' + file._id);
                });
            });
    }

    //
    // Sockets
    //
    app.io.route('files', {
        create: function(req) {
            if (!req.files || !req.files.file) {
                return req.io.sendStatus(400);
            }

            var data = req.data || req.body,
                options = {
                    owner: req.user._id,
                    room: data.room,
                    file: req.files.file
                };

            core.files.create(options, function(err, file) {
                if (err) {
                    console.log(err);
                    return req.io.sendStatus(400);
                }
                req.io.status(201).respond(file);
            });
        },
        list: function(req) {
            var data = req.data || req.query,
                options = {
                    room: data.room || null
                };

            core.files.list(options, function(err, files) {
                if (err) {
                    return req.io.sendStatus(400);
                }
                req.io.respond(files.reverse());
            });
        }
    });

};
