# hbs-commandline

Invoke handlebars from the commandline.
Specifically, using to convert [ZAP](https://www.zaproxy.org/) reports to xml and show into Azure Devops Test Results

## Installation
    
```sh
$ npm install -g hbs-commandline
```

## Usage
```sh
Usage:
    hbs data.json helpers.js < template.hbs > output.xml
    data.json               Parse data
    helpers.js              Custom helpers
    template.hbs            Your template
    output.xml              Output rendered templates
```

## Include helpers

```js
// helpers.js
var helpers = function () {};

helpers.register = function (Handlebars) {
    Handlebars.registerHelper('convertRiskCode', function(value) {
        return value !== "0" ? "Failed" : "Not Impacted";
    });
};

module.exports = helpers;
```

# license

MIT
