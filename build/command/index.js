'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _uid = require('uid');

var _uid2 = _interopRequireDefault(_uid);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var Command = (function () {
    /**
     * Constructor
     * @private
     * @name constructor
     * @param  {String} command - The bash command.
     */

    function Command(command) {
        _classCallCheck(this, Command);

        this.id = (0, _uid2['default'])();

        this.executing = false;

        this.command = command;
        this.result = [];
        this.error = [];
        this.callback = [];

        this.startTime = null;
        this.endTime = null;

        // Create the command.
        this.executingLine = this._create(this.command);

        if (!this.command) {
            this.executingLine = 'echo start && echo end \n';
        }
    }

    /**
     * Create the executable command.
     * @private
     * @name _create
     * @param {String} comamnd - The bash command.
     * @return {String} The executable command.
     */

    _createClass(Command, [{
        key: '_create',
        value: function _create(command) {
            return ['echo start', command, 'sleep .1', // A hack to enable to end statement.
            'echo end \n'].join(' && ');
        }

        /**
         * Let this instance know that the command is executing.
         * @name start
         * @function
         */
    }, {
        key: 'start',
        value: function start() {
            this.executing = true;
            this.startTime = new Date().getTime();
        }

        /**
         * Let this instance know that the command is done with executing.
         * @name end
         * @function
         */
    }, {
        key: 'end',
        value: function end() {
            var _this = this;

            if (!this.executing) {
                return false;
            }
            this.executing = false;
            this.endTime = new Date().getTime();
            if (this.callback.length !== 0) {
                this.callback.forEach(function (callback) {
                    if (_util2['default'].isFunction(callback)) {
                        callback(_this.getOutput());
                    }
                });
            }
        }

        /**
         * Add a line to the command results.
         * @name addToResult
         * @param {String} line - A line of the results.
         */
    }, {
        key: 'addToResult',
        value: function addToResult(line) {
            if (!line) {
                return false;
            }
            if (line === 'start') {
                this.start();
                return false;
            }
            if (!this.executing) {
                return false;
            }
            if (line === 'end') {
                this.end();
                return false;
            }
            this.result.push(line);
        }

        /**
         * Get all the results.
         * @name getResult
         * @return {Array} All the results line by line.
         */
    }, {
        key: 'getResult',
        value: function getResult() {
            return this._result;
        }

        /**
         * Let this is know that there was an error executing this command.
         * @name addError
         * @param {String} error - The error.
         */
    }, {
        key: 'addError',
        value: function addError(error) {
            var _this2 = this;

            var lines = error.split(/\n/g);
            lines.forEach(function (line) {
                _this2.error.push(line);
            });
        }

        /**
         * Get the executable command.
         * @getExecutingLine
         * @return {String} The executable command.
         */
    }, {
        key: 'getExecutingLine',
        value: function getExecutingLine() {
            return this._executingLine;
        }

        /**
         * Add a callback to this command.
         * @name addCallback
         * @param {Function} callback - The callback.
         */
    }, {
        key: 'addCallback',
        value: function addCallback(callback) {
            if (!_util2['default'].isFunction(callback)) {
                return false;
            }
            this.callback.push(callback);
        }

        /**
         * Get the output/total results of this command.
         * @return {Object} The results.
         */
    }, {
        key: 'getOutput',
        value: function getOutput() {
            return {
                error: this.error,
                result: this.result,
                id: this.id,
                command: this.command,
                executedCommand: this.executingLine,
                startTime: this.startTime,
                endTime: this.endTime,
                executingTime: this.endTime - this.startTime
            };
        }
    }]);

    return Command;
})();

exports['default'] = Command;
module.exports = exports['default'];