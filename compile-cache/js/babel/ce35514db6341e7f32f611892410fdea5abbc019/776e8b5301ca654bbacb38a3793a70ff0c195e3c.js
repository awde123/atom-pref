Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

// Local variables
'use babel';var parseRegex = /(\d+):(\d+):\s(([A-Z])\d{2,3})\s+(.*)/g;

var applySubstitutions = function applySubstitutions(givenExecPath, projDir) {
  var execPath = givenExecPath;
  var projectName = _path2['default'].basename(projDir);
  execPath = execPath.replace(/\$PROJECT_NAME/ig, projectName);
  execPath = execPath.replace(/\$PROJECT/ig, projDir);
  var paths = execPath.split(';');
  for (var i = 0; i < paths.length; i += 1) {
    if (_fsPlus2['default'].existsSync(paths[i])) {
      return paths[i];
    }
  }
  return execPath;
};

var getVersionString = _asyncToGenerator(function* (versionPath) {
  if (!Object.hasOwnProperty.call(getVersionString, 'cache')) {
    getVersionString.cache = new Map();
  }
  if (!getVersionString.cache.has(versionPath)) {
    getVersionString.cache.set(versionPath, (yield helpers.exec(versionPath, ['--version'])));
  }
  return getVersionString.cache.get(versionPath);
});

var generateInvalidPointTrace = _asyncToGenerator(function* (execPath, match, filePath, textEditor, point) {
  var flake8Version = yield getVersionString(execPath);
  var issueURL = 'https://github.com/AtomLinter/linter-flake8/issues/new';
  var title = encodeURIComponent('Flake8 rule \'' + match[3] + '\' reported an invalid point');
  var body = encodeURIComponent(['Flake8 reported an invalid point for the rule `' + match[3] + '`, ' + ('with the messge `' + match[5] + '`.'), '', '', '<!-- If at all possible, please include code that shows this issue! -->', '', '', 'Debug information:', 'Atom version: ' + atom.getVersion(), 'Flake8 version: `' + flake8Version + '`'].join('\n'));
  var newIssueURL = issueURL + '?title=' + title + '&body=' + body;
  return {
    type: 'Error',
    severity: 'error',
    html: 'ERROR: Flake8 provided an invalid point! See the trace for details. ' + ('<a href="' + newIssueURL + '">Report this!</a>'),
    filePath: filePath,
    range: helpers.generateRange(textEditor, 0),
    trace: [{
      type: 'Trace',
      text: 'Original message: ' + match[3] + ' — ' + match[5],
      filePath: filePath,
      severity: 'info'
    }, {
      type: 'Trace',
      text: 'Requested point: ' + (point.line + 1) + ':' + (point.col + 1),
      filePath: filePath,
      severity: 'info'
    }]
  };
});

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();

    var packageDepsID = undefined;
    var linterFlake8Deps = function linterFlake8Deps() {
      _this.idleCallbacks['delete'](packageDepsID);

      // Request checking / installation of package dependencies
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-flake8');
      }

      // FIXME: Remove after a few versions
      if (typeof atom.config.get('linter-flake8.disableTimeout') !== 'undefined') {
        atom.config.unset('linter-flake8.disableTimeout');
      }
    };
    packageDepsID = window.requestIdleCallback(linterFlake8Deps);
    this.idleCallbacks.add(packageDepsID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-flake8.projectConfigFile', function (value) {
      _this.projectConfigFile = value;
    }), atom.config.observe('linter-flake8.maxLineLength', function (value) {
      _this.maxLineLength = value;
    }), atom.config.observe('linter-flake8.ignoreErrorCodes', function (value) {
      _this.ignoreErrorCodes = value;
    }), atom.config.observe('linter-flake8.maxComplexity', function (value) {
      _this.maxComplexity = value;
    }), atom.config.observe('linter-flake8.selectErrors', function (value) {
      _this.selectErrors = value;
    }), atom.config.observe('linter-flake8.hangClosing', function (value) {
      _this.hangClosing = value;
    }), atom.config.observe('linter-flake8.executablePath', function (value) {
      _this.executablePath = value;
    }), atom.config.observe('linter-flake8.pycodestyleErrorsToWarnings', function (value) {
      _this.pycodestyleErrorsToWarnings = value;
    }), atom.config.observe('linter-flake8.flakeErrors', function (value) {
      _this.flakeErrors = value;
    }), atom.config.observe('linter-flake8.builtins', function (value) {
      _this.builtins = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'Flake8',
      grammarScopes: ['source.python', 'source.python.django'],
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        var parameters = ['--format=default'];

        var projectPath = atom.project.relativizePath(filePath)[0];
        var baseDir = projectPath !== null ? projectPath : _path2['default'].dirname(filePath);
        var configFilePath = yield helpers.findCachedAsync(baseDir, _this2.projectConfigFile);

        if (_this2.projectConfigFile && baseDir !== null && configFilePath !== null) {
          parameters.push('--config', configFilePath);
        } else {
          if (_this2.maxLineLength) {
            parameters.push('--max-line-length', _this2.maxLineLength);
          }
          if (_this2.ignoreErrorCodes.length) {
            parameters.push('--ignore', _this2.ignoreErrorCodes.join(','));
          }
          if (_this2.maxComplexity !== 79) {
            parameters.push('--max-complexity', _this2.maxComplexity);
          }
          if (_this2.hangClosing) {
            parameters.push('--hang-closing');
          }
          if (_this2.selectErrors.length) {
            parameters.push('--select', _this2.selectErrors.join(','));
          }
          if (_this2.builtins.length) {
            parameters.push('--builtins', _this2.builtins.join(','));
          }
        }

        parameters.push('-');

        var execPath = _fsPlus2['default'].normalize(applySubstitutions(_this2.executablePath, baseDir));
        var forceTimeout = 1000 * 60 * 5; // (ms * s * m) = Five minutes
        var options = {
          stdin: fileText,
          cwd: _path2['default'].dirname(textEditor.getPath()),
          ignoreExitCode: true,
          timeout: forceTimeout,
          uniqueKey: 'linter-flake8:' + filePath
        };

        var result = undefined;
        try {
          result = yield helpers.exec(execPath, parameters, options);
        } catch (e) {
          var pyTrace = e.message.split('\n');
          var pyMostRecent = pyTrace[pyTrace.length - 1];
          atom.notifications.addError('Flake8 crashed!', {
            detail: 'linter-flake8:: Flake8 threw an error related to:\n' + (pyMostRecent + '\n') + "Please check Atom's Console for more details"
          });
          // eslint-disable-next-line no-console
          console.error('linter-flake8:: Flake8 returned an error', e.message);
          // Tell Linter to not update any current messages it may have
          return null;
        }

        if (result === null) {
          // Process was killed by a future invocation
          return null;
        }

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, tell Linter not to update
          return null;
        }

        var messages = [];

        var match = parseRegex.exec(result);
        while (match !== null) {
          // Note that these positions are being converted to 0-indexed
          var line = Number.parseInt(match[1], 10) - 1 || 0;
          var col = Number.parseInt(match[2], 10) - 1 || undefined;

          var isErr = match[4] === 'E' && !_this2.pycodestyleErrorsToWarnings || match[4] === 'F' && _this2.flakeErrors;

          try {
            messages.push({
              type: isErr ? 'Error' : 'Warning',
              text: match[3] + ' — ' + match[5],
              filePath: filePath,
              range: helpers.generateRange(textEditor, line, col)
            });
          } catch (point) {
            // generateRange encountered an invalid point
            messages.push(generateInvalidPointTrace(execPath, match, filePath, textEditor, point));
          }

          match = parseRegex.exec(result);
        }
        // Ensure that any invalid point messages have finished resolving
        return Promise.all(messages);
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3VnYy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZmxha2U4L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7c0JBQzNCLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OzswQkFDRSxhQUFhOztJQUExQixPQUFPOzs7QUFObkIsV0FBVyxDQUFDLEFBU1osSUFBTSxVQUFVLEdBQUcsd0NBQXdDLENBQUM7O0FBRTVELElBQU0sa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLENBQUksYUFBYSxFQUFFLE9BQU8sRUFBSztBQUNyRCxNQUFJLFFBQVEsR0FBRyxhQUFhLENBQUM7QUFDN0IsTUFBTSxXQUFXLEdBQUcsa0JBQUssUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLFVBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzdELFVBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNwRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDeEMsUUFBSSxvQkFBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDM0IsYUFBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7R0FDRjtBQUNELFNBQU8sUUFBUSxDQUFDO0NBQ2pCLENBQUM7O0FBRUYsSUFBTSxnQkFBZ0IscUJBQUcsV0FBTyxXQUFXLEVBQUs7QUFDOUMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxFQUFFO0FBQzFELG9CQUFnQixD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S0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztXQUNsRDs7QUFFRCxlQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNqQzs7QUFFRCxlQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDOUIsQ0FBQTtLQUNGLENBQUM7R0FDSDtDQUNGIiwiZmlsZSI6Ii9ob21lL3VnYy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZmxha2U4L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnYXRvbS1saW50ZXInO1xuXG4vLyBMb2NhbCB2YXJpYWJsZXNcbmNvbnN0IHBhcnNlUmVnZXggPSAvKFxcZCspOihcXGQrKTpcXHMoKFtBLVpdKVxcZHsyLDN9KVxccysoLiopL2c7XG5cbmNvbnN0IGFwcGx5U3Vic3RpdHV0aW9ucyA9IChnaXZlbkV4ZWNQYXRoLCBwcm9qRGlyKSA9PiB7XG4gIGxldCBleGVjUGF0aCA9IGdpdmVuRXhlY1BhdGg7XG4gIGNvbnN0IHByb2plY3ROYW1lID0gcGF0aC5iYXNlbmFtZShwcm9qRGlyKTtcbiAgZXhlY1BhdGggPSBleGVjUGF0aC5yZXBsYWNlKC9cXCRQUk9KRUNUX05BTUUvaWcsIHByb2plY3ROYW1lKTtcbiAgZXhlY1BhdGggPSBleGVjUGF0aC5yZXBsYWNlKC9cXCRQUk9KRUNUL2lnLCBwcm9qRGlyKTtcbiAgY29uc3QgcGF0aHMgPSBleGVjUGF0aC5zcGxpdCgnOycpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aHNbaV0pKSB7XG4gICAgICByZXR1cm4gcGF0aHNbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiBleGVjUGF0aDtcbn07XG5cbmNvbnN0IGdldFZlcnNpb25TdHJpbmcgPSBhc3luYyAodmVyc2lvblBhdGgpID0+IHtcbiAgaWYgKCFPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChnZXRWZXJzaW9uU3RyaW5nLCAnY2FjaGUnKSkge1xuICAgIGdldFZlcnNpb25TdHJpbmcuY2FjaGUgPSBuZXcgTWFwKCk7XG4gIH1cbiAgaWYgKCFnZXRWZXJzaW9uU3RyaW5nLmNhY2hlLmhhcyh2ZXJzaW9uUGF0aCkpIHtcbiAgICBnZXRWZXJzaW9uU3RyaW5nLmNhY2hlLnNldCh2ZXJzaW9uUGF0aCxcbiAgICAgIGF3YWl0IGhlbHBlcnMuZXhlYyh2ZXJzaW9uUGF0aCwgWyctLXZlcnNpb24nXSkpO1xuICB9XG4gIHJldHVybiBnZXRWZXJzaW9uU3RyaW5nLmNhY2hlLmdldCh2ZXJzaW9uUGF0aCk7XG59O1xuXG5jb25zdCBnZW5lcmF0ZUludmFsaWRQb2ludFRyYWNlID0gYXN5bmMgKGV4ZWNQYXRoLCBtYXRjaCwgZmlsZVBhdGgsIHRleHRFZGl0b3IsIHBvaW50KSA9PiB7XG4gIGNvbnN0IGZsYWtlOFZlcnNpb24gPSBhd2FpdCBnZXRWZXJzaW9uU3RyaW5nKGV4ZWNQYXRoKTtcbiAgY29uc3QgaXNzdWVVUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tL0F0b21MaW50ZXIvbGludGVyLWZsYWtlOC9pc3N1ZXMvbmV3JztcbiAgY29uc3QgdGl0bGUgPSBlbmNvZGVVUklDb21wb25lbnQoYEZsYWtlOCBydWxlICcke21hdGNoWzNdfScgcmVwb3J0ZWQgYW4gaW52YWxpZCBwb2ludGApO1xuICBjb25zdCBib2R5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFtcbiAgICBgRmxha2U4IHJlcG9ydGVkIGFuIGludmFsaWQgcG9pbnQgZm9yIHRoZSBydWxlIFxcYCR7bWF0Y2hbM119XFxgLCBgICtcbiAgICBgd2l0aCB0aGUgbWVzc2dlIFxcYCR7bWF0Y2hbNV19XFxgLmAsXG4gICAgJycsICcnLFxuICAgICc8IS0tIElmIGF0IGFsbCBwb3NzaWJsZSwgcGxlYXNlIGluY2x1ZGUgY29kZSB0aGF0IHNob3dzIHRoaXMgaXNzdWUhIC0tPicsXG4gICAgJycsICcnLFxuICAgICdEZWJ1ZyBpbmZvcm1hdGlvbjonLFxuICAgIGBBdG9tIHZlcnNpb246ICR7YXRvbS5nZXRWZXJzaW9uKCl9YCxcbiAgICBgRmxha2U4IHZlcnNpb246IFxcYCR7Zmxha2U4VmVyc2lvbn1cXGBgLFxuICBdLmpvaW4oJ1xcbicpKTtcbiAgY29uc3QgbmV3SXNzdWVVUkwgPSBgJHtpc3N1ZVVSTH0/dGl0bGU9JHt0aXRsZX0mYm9keT0ke2JvZHl9YDtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnRXJyb3InLFxuICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgIGh0bWw6ICdFUlJPUjogRmxha2U4IHByb3ZpZGVkIGFuIGludmFsaWQgcG9pbnQhIFNlZSB0aGUgdHJhY2UgZm9yIGRldGFpbHMuICcgK1xuICAgICAgYDxhIGhyZWY9XCIke25ld0lzc3VlVVJMfVwiPlJlcG9ydCB0aGlzITwvYT5gLFxuICAgIGZpbGVQYXRoLFxuICAgIHJhbmdlOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgMCksXG4gICAgdHJhY2U6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ1RyYWNlJyxcbiAgICAgICAgdGV4dDogYE9yaWdpbmFsIG1lc3NhZ2U6ICR7bWF0Y2hbM119IOKAlCAke21hdGNoWzVdfWAsXG4gICAgICAgIGZpbGVQYXRoLFxuICAgICAgICBzZXZlcml0eTogJ2luZm8nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ1RyYWNlJyxcbiAgICAgICAgdGV4dDogYFJlcXVlc3RlZCBwb2ludDogJHtwb2ludC5saW5lICsgMX06JHtwb2ludC5jb2wgKyAxfWAsXG4gICAgICAgIGZpbGVQYXRoLFxuICAgICAgICBzZXZlcml0eTogJ2luZm8nLFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KCk7XG5cbiAgICBsZXQgcGFja2FnZURlcHNJRDtcbiAgICBjb25zdCBsaW50ZXJGbGFrZThEZXBzID0gKCkgPT4ge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShwYWNrYWdlRGVwc0lEKTtcblxuICAgICAgLy8gUmVxdWVzdCBjaGVja2luZyAvIGluc3RhbGxhdGlvbiBvZiBwYWNrYWdlIGRlcGVuZGVuY2llc1xuICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1mbGFrZTgnKTtcbiAgICAgIH1cblxuICAgICAgLy8gRklYTUU6IFJlbW92ZSBhZnRlciBhIGZldyB2ZXJzaW9uc1xuICAgICAgaWYgKHR5cGVvZiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1mbGFrZTguZGlzYWJsZVRpbWVvdXQnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgYXRvbS5jb25maWcudW5zZXQoJ2xpbnRlci1mbGFrZTguZGlzYWJsZVRpbWVvdXQnKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHBhY2thZ2VEZXBzSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhsaW50ZXJGbGFrZThEZXBzKTtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKHBhY2thZ2VEZXBzSUQpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5wcm9qZWN0Q29uZmlnRmlsZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLnByb2plY3RDb25maWdGaWxlID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTgubWF4TGluZUxlbmd0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLm1heExpbmVMZW5ndGggPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5pZ25vcmVFcnJvckNvZGVzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuaWdub3JlRXJyb3JDb2RlcyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4Lm1heENvbXBsZXhpdHknLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5tYXhDb21wbGV4aXR5ID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguc2VsZWN0RXJyb3JzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0RXJyb3JzID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguaGFuZ0Nsb3NpbmcnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5oYW5nQ2xvc2luZyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4LmV4ZWN1dGFibGVQYXRoJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZXhlY3V0YWJsZVBhdGggPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5mbGFrZUVycm9ycycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmZsYWtlRXJyb3JzID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguYnVpbHRpbnMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5idWlsdGlucyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnRmxha2U4JyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLnB5dGhvbicsICdzb3VyY2UucHl0aG9uLmRqYW5nbyddLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGZpbGVUZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IFsnLS1mb3JtYXQ9ZGVmYXVsdCddO1xuXG4gICAgICAgIGNvbnN0IHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVswXTtcbiAgICAgICAgY29uc3QgYmFzZURpciA9IHByb2plY3RQYXRoICE9PSBudWxsID8gcHJvamVjdFBhdGggOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBjb25maWdGaWxlUGF0aCA9IGF3YWl0IGhlbHBlcnMuZmluZENhY2hlZEFzeW5jKGJhc2VEaXIsIHRoaXMucHJvamVjdENvbmZpZ0ZpbGUpO1xuXG4gICAgICAgIGlmICh0aGlzLnByb2plY3RDb25maWdGaWxlICYmIGJhc2VEaXIgIT09IG51bGwgJiYgY29uZmlnRmlsZVBhdGggIT09IG51bGwpIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tY29uZmlnJywgY29uZmlnRmlsZVBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLm1heExpbmVMZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1tYXgtbGluZS1sZW5ndGgnLCB0aGlzLm1heExpbmVMZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5pZ25vcmVFcnJvckNvZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWlnbm9yZScsIHRoaXMuaWdub3JlRXJyb3JDb2Rlcy5qb2luKCcsJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5tYXhDb21wbGV4aXR5ICE9PSA3OSkge1xuICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLW1heC1jb21wbGV4aXR5JywgdGhpcy5tYXhDb21wbGV4aXR5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuaGFuZ0Nsb3NpbmcpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1oYW5nLWNsb3NpbmcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0RXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLXNlbGVjdCcsIHRoaXMuc2VsZWN0RXJyb3JzLmpvaW4oJywnKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmJ1aWx0aW5zLmxlbmd0aCkge1xuICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWJ1aWx0aW5zJywgdGhpcy5idWlsdGlucy5qb2luKCcsJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLScpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWNQYXRoID0gZnMubm9ybWFsaXplKGFwcGx5U3Vic3RpdHV0aW9ucyh0aGlzLmV4ZWN1dGFibGVQYXRoLCBiYXNlRGlyKSk7XG4gICAgICAgIGNvbnN0IGZvcmNlVGltZW91dCA9IDEwMDAgKiA2MCAqIDU7IC8vIChtcyAqIHMgKiBtKSA9IEZpdmUgbWludXRlc1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgIHN0ZGluOiBmaWxlVGV4dCxcbiAgICAgICAgICBjd2Q6IHBhdGguZGlybmFtZSh0ZXh0RWRpdG9yLmdldFBhdGgoKSksXG4gICAgICAgICAgaWdub3JlRXhpdENvZGU6IHRydWUsXG4gICAgICAgICAgdGltZW91dDogZm9yY2VUaW1lb3V0LFxuICAgICAgICAgIHVuaXF1ZUtleTogYGxpbnRlci1mbGFrZTg6JHtmaWxlUGF0aH1gLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVzdWx0ID0gYXdhaXQgaGVscGVycy5leGVjKGV4ZWNQYXRoLCBwYXJhbWV0ZXJzLCBvcHRpb25zKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnN0IHB5VHJhY2UgPSBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgIGNvbnN0IHB5TW9zdFJlY2VudCA9IHB5VHJhY2VbcHlUcmFjZS5sZW5ndGggLSAxXTtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0ZsYWtlOCBjcmFzaGVkIScsIHtcbiAgICAgICAgICAgIGRldGFpbDogJ2xpbnRlci1mbGFrZTg6OiBGbGFrZTggdGhyZXcgYW4gZXJyb3IgcmVsYXRlZCB0bzpcXG4nICtcbiAgICAgICAgICAgICAgYCR7cHlNb3N0UmVjZW50fVxcbmAgK1xuICAgICAgICAgICAgICBcIlBsZWFzZSBjaGVjayBBdG9tJ3MgQ29uc29sZSBmb3IgbW9yZSBkZXRhaWxzXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdsaW50ZXItZmxha2U4OjogRmxha2U4IHJldHVybmVkIGFuIGVycm9yJywgZS5tZXNzYWdlKTtcbiAgICAgICAgICAvLyBUZWxsIExpbnRlciB0byBub3QgdXBkYXRlIGFueSBjdXJyZW50IG1lc3NhZ2VzIGl0IG1heSBoYXZlXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgLy8gUHJvY2VzcyB3YXMga2lsbGVkIGJ5IGEgZnV0dXJlIGludm9jYXRpb25cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXh0RWRpdG9yLmdldFRleHQoKSAhPT0gZmlsZVRleHQpIHtcbiAgICAgICAgICAvLyBFZGl0b3IgY29udGVudHMgaGF2ZSBjaGFuZ2VkLCB0ZWxsIExpbnRlciBub3QgdG8gdXBkYXRlXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuXG4gICAgICAgIGxldCBtYXRjaCA9IHBhcnNlUmVnZXguZXhlYyhyZXN1bHQpO1xuICAgICAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICAvLyBOb3RlIHRoYXQgdGhlc2UgcG9zaXRpb25zIGFyZSBiZWluZyBjb252ZXJ0ZWQgdG8gMC1pbmRleGVkXG4gICAgICAgICAgY29uc3QgbGluZSA9IE51bWJlci5wYXJzZUludChtYXRjaFsxXSwgMTApIC0gMSB8fCAwO1xuICAgICAgICAgIGNvbnN0IGNvbCA9IE51bWJlci5wYXJzZUludChtYXRjaFsyXSwgMTApIC0gMSB8fCB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBjb25zdCBpc0VyciA9IChtYXRjaFs0XSA9PT0gJ0UnICYmICF0aGlzLnB5Y29kZXN0eWxlRXJyb3JzVG9XYXJuaW5ncylcbiAgICAgICAgICAgIHx8IChtYXRjaFs0XSA9PT0gJ0YnICYmIHRoaXMuZmxha2VFcnJvcnMpO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiBpc0VyciA/ICdFcnJvcicgOiAnV2FybmluZycsXG4gICAgICAgICAgICAgIHRleHQ6IGAke21hdGNoWzNdfSDigJQgJHttYXRjaFs1XX1gLFxuICAgICAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICAgICAgcmFuZ2U6IGhlbHBlcnMuZ2VuZXJhdGVSYW5nZSh0ZXh0RWRpdG9yLCBsaW5lLCBjb2wpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAocG9pbnQpIHtcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlUmFuZ2UgZW5jb3VudGVyZWQgYW4gaW52YWxpZCBwb2ludFxuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChnZW5lcmF0ZUludmFsaWRQb2ludFRyYWNlKFxuICAgICAgICAgICAgICBleGVjUGF0aCwgbWF0Y2gsIGZpbGVQYXRoLCB0ZXh0RWRpdG9yLCBwb2ludCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1hdGNoID0gcGFyc2VSZWdleC5leGVjKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgYW55IGludmFsaWQgcG9pbnQgbWVzc2FnZXMgaGF2ZSBmaW5pc2hlZCByZXNvbHZpbmdcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKG1lc3NhZ2VzKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=