#!/usr/bin/env node

var fs   = require('fs'),
    args = require('optimist').argv,
    hbs  = require('handlebars');
var helpersFile = null;

if (args._.length) {
    try {
        helpersFile = args._[1];
        args = JSON.parse(fs.readFileSync(args._[0]).toString());
    } catch (e) { }
}
else for (var key in args) {
    try {
        args[key] = JSON.parse(args[key]);
    } catch (e) {
    }
}

function addHandlebarsHelpers(file) {
    const handlebarsHelper = require(file);
   
    if (handlebarsHelper && typeof handlebarsHelper.register === 'function') {
        handlebarsHelper.register(hbs);
    } else {
        console.error(`WARNING: ${file} does not export a 'register' function, cannot import`);
    }
}

function readStream(s, done) {
    var bufs = [];
    s.on('data', function(d) {
        bufs.push(d);
    });
    s.on('end', function() {
        done(null, Buffer.concat(bufs));
    });
    s.resume();
}

readStream(process.stdin, function(err, tmpl) {
    if (helpersFile) {
        addHandlebarsHelpers(helpersFile);
    };

    function handle(tmpl, args) {
        hbs.registerHelper('include', function (file, context, opt) {
            var context = null == context ? args : context;
            var f = fs.readFileSync(file);
            return handle(f, context); 
        });
        var template = hbs.compile(tmpl.toString());
        var result = template(args);
        return result;
    }
    process.stdout.write(handle(tmpl, args));
});

