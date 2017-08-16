(function() {
    "use strict";

    // ui-codemirror seems to depend on CodeMirror global =(
    window.CodeMirror = require('codemirror-minified/lib/codemirror.js');
    require('codemirror-minified/lib/codemirror.css');
    require('codemirror-minified/mode/javascript/javascript.js');
    // javascript-lint seems to depend on JSHINT global (but JSHINT is old so it's somewhat forgiven)
    window.JSHINT = require('./jshint.js').JSHINT;
    require('codemirror-minified/addon/lint/lint.js');
    require('codemirror-minified/addon/lint/lint.css');
    require('codemirror-minified/addon/lint/javascript-lint.js');
    require('./ui-codemirror.min.js');
}()) 