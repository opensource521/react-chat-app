'use strict';

if (typeof window !== 'undefined' && typeof exports === 'undefined') {
    if (typeof window.utils !== 'object') window.utils = {};
}

if (typeof exports !== 'undefined') {
    var _ = require('underscore');
}

(function(exports) {
    //
    // Message Text Formatting
    //
    exports.format = function(text, extras) {
        var imagePattern = /^\s*((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;'"!()]*[-A-Z0-9+&@#\/%=~_|][.](jpe?g|png|gif))\s*$/i,
            linkPattern = /((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;'"!()]*[-A-Z0-9+&@#\/%=~_|])/ig,
            mentionPattern = /\B@(\w+)(?!@)\b/g;
        text = text.trim();
        text = text.replace(mentionPattern, '<strong>@$1</strong>');
        if (imagePattern.test(text)) {
            text = text.replace(imagePattern, function(url) {
                url = _.escape(url);
                return '<a class="thumbnail" href="' + url + '" target="_blank"><img src="' + url + '" alt="Pasted Image" /></a>'
            });
        } else {
            text = text.replace(linkPattern, function(url) {
                url = _.escape(url);
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            });
        }
        _.each(extras.emotes, function(emote) {
            var regex = new RegExp('\\B(:' + emote.emote + ':?)[\\b]?', 'i');
            text = text.replace(regex, function() {
                return '<img class="emote" src="' + _.escape(emote.image) + '" title=":'+ _.escape(emote.emote) + ':" alt=":' + _.escape(emote.emote) + ':" width="50" height="50" />';
            });
        });
        _.each(extras.replacements, function(replacement) {
            text = text.replace(new RegExp(replacement.regex, 'ig'), replacement.template);
        });
        return text;
    }
})(typeof exports === 'undefined' ? window.utils.message = {} : exports);