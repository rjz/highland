var handlebars = require('handlebars'),
    scrawl = require('scrawl'),
    path = require('path'),
    fs = require('fs');


var src_file = path.resolve(__dirname, '../highland.js');
var tmpl_file = path.resolve(__dirname, '../docs/templates/base.html');
var out_file = path.resolve(__dirname, '../docs/index.html');


module.exports = function (grunt) {

    grunt.registerTask('docs',
        'Builds HTML documentation', function () {
            var src = fs.readFileSync(src_file).toString();
            var comments = scrawl.parse(src).filter(function (x) {
                return x.api === 'public';
            });

            var sections = {};
            comments.forEach(function (c) {
                if (!sections[c.section]) {
                    sections[c.section] = {
                        name: c.section,
                        items: []
                    };
                }
                sections[c.section].items.push(c);
            });

            var tmpl_src = fs.readFileSync(tmpl_file).toString();
            var tmpl = handlebars.compile(tmpl_src);

            var html = tmpl({
                comments: comments,
                sections: sections
            });

            fs.writeFileSync(out_file, html);
        }
    );

};
