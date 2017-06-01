Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.shouldTriggerLinter = shouldTriggerLinter;
exports.getEditorCursorScopes = getEditorCursorScopes;
exports.isPathIgnored = isPathIgnored;
exports.subscriptiveObserve = subscriptiveObserve;
exports.messageKey = messageKey;
exports.normalizeMessages = normalizeMessages;
exports.messageKeyLegacy = messageKeyLegacy;
exports.normalizeMessagesLegacy = normalizeMessagesLegacy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _lodashUniq = require('lodash.uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

var _atom = require('atom');

var $version = '__$sb_linter_version';
exports.$version = $version;
var $activated = '__$sb_linter_activated';
exports.$activated = $activated;
var $requestLatest = '__$sb_linter_request_latest';
exports.$requestLatest = $requestLatest;
var $requestLastReceived = '__$sb_linter_request_last_received';

exports.$requestLastReceived = $requestLastReceived;

function shouldTriggerLinter(linter, wasTriggeredOnChange, scopes) {
  if (wasTriggeredOnChange && !(linter[$version] === 2 ? linter.lintsOnChange : linter.lintOnFly)) {
    return false;
  }
  return scopes.some(function (scope) {
    return linter.grammarScopes.includes(scope);
  });
}

function getEditorCursorScopes(textEditor) {
  return (0, _lodashUniq2['default'])(textEditor.getCursors().reduce(function (scopes, cursor) {
    return scopes.concat(cursor.getScopeDescriptor().getScopesArray());
  }, ['*']));
}

function isPathIgnored(filePath, ignoredGlob, ignoredVCS) {
  if (ignoredVCS) {
    var repository = null;
    var projectPaths = atom.project.getPaths();
    for (var i = 0, _length2 = projectPaths.length; i < _length2; ++i) {
      var projectPath = projectPaths[i];
      if (filePath.indexOf(projectPath) === 0) {
        repository = atom.project.getRepositories()[i];
        break;
      }
    }
    if (repository && repository.isPathIgnored(filePath)) {
      return true;
    }
  }
  var normalizedFilePath = process.platform === 'win32' ? filePath.replace(/\\/g, '/') : filePath;
  return (0, _minimatch2['default'])(normalizedFilePath, ignoredGlob);
}

function subscriptiveObserve(object, eventName, callback) {
  var subscription = null;
  var eventSubscription = object.observe(eventName, function (props) {
    if (subscription) {
      subscription.dispose();
    }
    subscription = callback.call(this, props);
  });

  return new _atom.Disposable(function () {
    eventSubscription.dispose();
    if (subscription) {
      subscription.dispose();
    }
  });
}

function messageKey(message) {
  var reference = message.reference;
  return ['$LINTER:' + message.linterName, '$LOCATION:' + message.location.file + '$' + message.location.position.start.row + '$' + message.location.position.start.column + '$' + message.location.position.end.row + '$' + message.location.position.end.column, reference ? '$REFERENCE:' + reference.file + '$' + (reference.position ? reference.position.row + '$' + reference.position.column : '') : '$REFERENCE:null', '$EXCERPT:' + message.excerpt, '$SEVERITY:' + message.severity, message.icon ? '$ICON:' + message.icon : '$ICON:null', message.url ? '$URL:' + message.url : '$URL:null'].join('');
}

function normalizeMessages(linterName, messages) {
  for (var i = 0, _length3 = messages.length; i < _length3; ++i) {
    var message = messages[i];
    var reference = message.reference;
    if (Array.isArray(message.location.position)) {
      message.location.position = _atom.Range.fromObject(message.location.position);
    }
    if (reference && Array.isArray(reference.position)) {
      reference.position = _atom.Point.fromObject(reference.position);
    }
    if (message.solutions && message.solutions.length) {
      for (var j = 0, _length = message.solutions.length, solution = undefined; j < _length; j++) {
        solution = message.solutions[j];
        if (Array.isArray(solution.position)) {
          solution.position = _atom.Range.fromObject(solution.position);
        }
      }
    }
    message.version = 2;
    message.linterName = linterName;
    message.key = messageKey(message);
  }
}

function messageKeyLegacy(message) {
  return ['$LINTER:' + message.linterName, '$LOCATION:' + (message.filePath || '') + '$' + (message.range ? message.range.start.row + '$' + message.range.start.column + '$' + message.range.end.row + '$' + message.range.end.column : ''), '$TEXT:' + (message.text || ''), '$HTML:' + (message.html || ''), '$SEVERITY:' + message.severity, '$TYPE:' + message.type, '$CLASS:' + (message['class'] || '')].join('');
}

function normalizeMessagesLegacy(linterName, messages) {
  for (var i = 0, _length4 = messages.length; i < _length4; ++i) {
    var message = messages[i];
    var fix = message.fix;
    if (message.range && message.range.constructor.name === 'Array') {
      message.range = _atom.Range.fromObject(message.range);
    }
    if (fix && fix.range.constructor.name === 'Array') {
      fix.range = _atom.Range.fromObject(fix.range);
    }
    if (!message.severity) {
      var type = message.type.toLowerCase();
      if (type === 'warning') {
        message.severity = type;
      } else if (type === 'info' || type === 'trace') {
        message.severity = 'info';
      } else {
        message.severity = 'error';
      }
    }
    message.version = 1;
    message.linterName = linterName;
    message.key = messageKeyLegacy(message);

    if (message.trace) {
      normalizeMessagesLegacy(linterName, message.trace);
    }
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3VnYy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7eUJBRXNCLFdBQVc7Ozs7MEJBQ1QsYUFBYTs7OztvQkFDSSxNQUFNOztBQUl4QyxJQUFNLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQTs7QUFDdkMsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUE7O0FBQzNDLElBQU0sY0FBYyxHQUFHLDZCQUE2QixDQUFBOztBQUNwRCxJQUFNLG9CQUFvQixHQUFHLG9DQUFvQyxDQUFBOzs7O0FBRWpFLFNBQVMsbUJBQW1CLENBQ2pDLE1BQWMsRUFDZCxvQkFBNkIsRUFDN0IsTUFBcUIsRUFDWjtBQUNULE1BQUksb0JBQW9CLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQSxBQUFDLEVBQUU7QUFDL0YsV0FBTyxLQUFLLENBQUE7R0FDYjtBQUNELFNBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNqQyxXQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQzVDLENBQUMsQ0FBQTtDQUNIOztBQUVNLFNBQVMscUJBQXFCLENBQUMsVUFBc0IsRUFBaUI7QUFDM0UsU0FBTyw2QkFBWSxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLE1BQU07V0FDL0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUM1RCxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQ1g7O0FBRU0sU0FBUyxhQUFhLENBQUMsUUFBZ0IsRUFBRSxXQUFtQixFQUFFLFVBQW1CLEVBQVc7QUFDakcsTUFBSSxVQUFV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SyxDQUFDLENBQUE7S0FDaEQ7QUFDRCxRQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO0FBQ2pELFNBQUcsQ0FBQyxLQUFLLEdBQUcsWUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ3hDO0FBQ0QsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDckIsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUN2QyxVQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7QUFDdEIsZUFBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7T0FDeEIsTUFBTSxJQUFJLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtBQUM5QyxlQUFPLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQTtPQUMxQixNQUFNO0FBQ0wsZUFBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUE7T0FDM0I7S0FDRjtBQUNELFdBQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO0FBQ25CLFdBQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQy9CLFdBQU8sQ0FBQyxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXZDLFFBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNqQiw2QkFBdUIsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ25EO0dBQ0Y7Q0FDRiIsImZpbGUiOiIvaG9tZS91Z2MvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgYXJyYXlVbmlxdWUgZnJvbSAnbG9kYXNoLnVuaXEnXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBSYW5nZSwgUG9pbnQgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgTGludGVyLCBNZXNzYWdlLCBNZXNzYWdlTGVnYWN5IH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0ICR2ZXJzaW9uID0gJ19fJHNiX2xpbnRlcl92ZXJzaW9uJ1xuZXhwb3J0IGNvbnN0ICRhY3RpdmF0ZWQgPSAnX18kc2JfbGludGVyX2FjdGl2YXRlZCdcbmV4cG9ydCBjb25zdCAkcmVxdWVzdExhdGVzdCA9ICdfXyRzYl9saW50ZXJfcmVxdWVzdF9sYXRlc3QnXG5leHBvcnQgY29uc3QgJHJlcXVlc3RMYXN0UmVjZWl2ZWQgPSAnX18kc2JfbGludGVyX3JlcXVlc3RfbGFzdF9yZWNlaXZlZCdcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFRyaWdnZXJMaW50ZXIoXG4gIGxpbnRlcjogTGludGVyLFxuICB3YXNUcmlnZ2VyZWRPbkNoYW5nZTogYm9vbGVhbixcbiAgc2NvcGVzOiBBcnJheTxzdHJpbmc+LFxuKTogYm9vbGVhbiB7XG4gIGlmICh3YXNUcmlnZ2VyZWRPbkNoYW5nZSAmJiAhKGxpbnRlclskdmVyc2lvbl0gPT09IDIgPyBsaW50ZXIubGludHNPbkNoYW5nZSA6IGxpbnRlci5saW50T25GbHkpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHNjb3Blcy5zb21lKGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgcmV0dXJuIGxpbnRlci5ncmFtbWFyU2NvcGVzLmluY2x1ZGVzKHNjb3BlKVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yQ3Vyc29yU2NvcGVzKHRleHRFZGl0b3I6IFRleHRFZGl0b3IpOiBBcnJheTxzdHJpbmc+IHtcbiAgcmV0dXJuIGFycmF5VW5pcXVlKHRleHRFZGl0b3IuZ2V0Q3Vyc29ycygpLnJlZHVjZSgoc2NvcGVzLCBjdXJzb3IpID0+IChcbiAgICBzY29wZXMuY29uY2F0KGN1cnNvci5nZXRTY29wZURlc2NyaXB0b3IoKS5nZXRTY29wZXNBcnJheSgpKVxuICApLCBbJyonXSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhdGhJZ25vcmVkKGZpbGVQYXRoOiBzdHJpbmcsIGlnbm9yZWRHbG9iOiBzdHJpbmcsIGlnbm9yZWRWQ1M6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgaWYgKGlnbm9yZWRWQ1MpIHtcbiAgICBsZXQgcmVwb3NpdG9yeSA9IG51bGxcbiAgICBjb25zdCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBwcm9qZWN0UGF0aHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHByb2plY3RQYXRoID0gcHJvamVjdFBhdGhzW2ldXG4gICAgICBpZiAoZmlsZVBhdGguaW5kZXhPZihwcm9qZWN0UGF0aCkgPT09IDApIHtcbiAgICAgICAgcmVwb3NpdG9yeSA9IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVtpXVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVwb3NpdG9yeSAmJiByZXBvc2l0b3J5LmlzUGF0aElnbm9yZWQoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICBjb25zdCBub3JtYWxpemVkRmlsZVBhdGggPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gZmlsZVBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpIDogZmlsZVBhdGhcbiAgcmV0dXJuIG1pbmltYXRjaChub3JtYWxpemVkRmlsZVBhdGgsIGlnbm9yZWRHbG9iKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Vic2NyaXB0aXZlT2JzZXJ2ZShvYmplY3Q6IE9iamVjdCwgZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICBsZXQgc3Vic2NyaXB0aW9uID0gbnVsbFxuICBjb25zdCBldmVudFN1YnNjcmlwdGlvbiA9IG9iamVjdC5vYnNlcnZlKGV2ZW50TmFtZSwgZnVuY3Rpb24ocHJvcHMpIHtcbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgfVxuICAgIHN1YnNjcmlwdGlvbiA9IGNhbGxiYWNrLmNhbGwodGhpcywgcHJvcHMpXG4gIH0pXG5cbiAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgIGV2ZW50U3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIGlmIChzdWJzY3JpcHRpb24pIHtcbiAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlS2V5KG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgY29uc3QgcmVmZXJlbmNlID0gbWVzc2FnZS5yZWZlcmVuY2VcbiAgcmV0dXJuIFtcbiAgICBgJExJTlRFUjoke21lc3NhZ2UubGludGVyTmFtZX1gLFxuICAgIGAkTE9DQVRJT046JHttZXNzYWdlLmxvY2F0aW9uLmZpbGV9JCR7bWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbi5zdGFydC5yb3d9JCR7bWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbi5zdGFydC5jb2x1bW59JCR7bWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbi5lbmQucm93fSQke21lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24uZW5kLmNvbHVtbn1gLFxuICAgIHJlZmVyZW5jZSA/IGAkUkVGRVJFTkNFOiR7cmVmZXJlbmNlLmZpbGV9JCR7cmVmZXJlbmNlLnBvc2l0aW9uID8gYCR7cmVmZXJlbmNlLnBvc2l0aW9uLnJvd30kJHtyZWZlcmVuY2UucG9zaXRpb24uY29sdW1ufWAgOiAnJ31gIDogJyRSRUZFUkVOQ0U6bnVsbCcsXG4gICAgYCRFWENFUlBUOiR7bWVzc2FnZS5leGNlcnB0fWAsXG4gICAgYCRTRVZFUklUWToke21lc3NhZ2Uuc2V2ZXJpdHl9YCxcbiAgICBtZXNzYWdlLmljb24gPyBgJElDT046JHttZXNzYWdlLmljb259YCA6ICckSUNPTjpudWxsJyxcbiAgICBtZXNzYWdlLnVybCA/IGAkVVJMOiR7bWVzc2FnZS51cmx9YCA6ICckVVJMOm51bGwnLFxuICBdLmpvaW4oJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVNZXNzYWdlcyhsaW50ZXJOYW1lOiBzdHJpbmcsIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlPikge1xuICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gbWVzc2FnZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gbWVzc2FnZXNbaV1cbiAgICBjb25zdCByZWZlcmVuY2UgPSBtZXNzYWdlLnJlZmVyZW5jZVxuICAgIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24pKSB7XG4gICAgICBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uID0gUmFuZ2UuZnJvbU9iamVjdChtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uKVxuICAgIH1cbiAgICBpZiAocmVmZXJlbmNlICYmIEFycmF5LmlzQXJyYXkocmVmZXJlbmNlLnBvc2l0aW9uKSkge1xuICAgICAgcmVmZXJlbmNlLnBvc2l0aW9uID0gUG9pbnQuZnJvbU9iamVjdChyZWZlcmVuY2UucG9zaXRpb24pXG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnNvbHV0aW9ucyAmJiBtZXNzYWdlLnNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IGogPSAwLCBfbGVuZ3RoID0gbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoLCBzb2x1dGlvbjsgaiA8IF9sZW5ndGg7IGorKykge1xuICAgICAgICBzb2x1dGlvbiA9IG1lc3NhZ2Uuc29sdXRpb25zW2pdXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNvbHV0aW9uLnBvc2l0aW9uKSkge1xuICAgICAgICAgIHNvbHV0aW9uLnBvc2l0aW9uID0gUmFuZ2UuZnJvbU9iamVjdChzb2x1dGlvbi5wb3NpdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBtZXNzYWdlLnZlcnNpb24gPSAyXG4gICAgbWVzc2FnZS5saW50ZXJOYW1lID0gbGludGVyTmFtZVxuICAgIG1lc3NhZ2Uua2V5ID0gbWVzc2FnZUtleShtZXNzYWdlKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlS2V5TGVnYWN5KG1lc3NhZ2U6IE1lc3NhZ2VMZWdhY3kpOiBzdHJpbmcge1xuICByZXR1cm4gW1xuICAgIGAkTElOVEVSOiR7bWVzc2FnZS5saW50ZXJOYW1lfWAsXG4gICAgYCRMT0NBVElPTjoke21lc3NhZ2UuZmlsZVBhdGggfHwgJyd9JCR7bWVzc2FnZS5yYW5nZSA/IGAke21lc3NhZ2UucmFuZ2Uuc3RhcnQucm93fSQke21lc3NhZ2UucmFuZ2Uuc3RhcnQuY29sdW1ufSQke21lc3NhZ2UucmFuZ2UuZW5kLnJvd30kJHttZXNzYWdlLnJhbmdlLmVuZC5jb2x1bW59YCA6ICcnfWAsXG4gICAgYCRURVhUOiR7bWVzc2FnZS50ZXh0IHx8ICcnfWAsXG4gICAgYCRIVE1MOiR7bWVzc2FnZS5odG1sIHx8ICcnfWAsXG4gICAgYCRTRVZFUklUWToke21lc3NhZ2Uuc2V2ZXJpdHl9YCxcbiAgICBgJFRZUEU6JHttZXNzYWdlLnR5cGV9YCxcbiAgICBgJENMQVNTOiR7bWVzc2FnZS5jbGFzcyB8fCAnJ31gLFxuICBdLmpvaW4oJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVNZXNzYWdlc0xlZ2FjeShsaW50ZXJOYW1lOiBzdHJpbmcsIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlTGVnYWN5Pikge1xuICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gbWVzc2FnZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gbWVzc2FnZXNbaV1cbiAgICBjb25zdCBmaXggPSBtZXNzYWdlLmZpeFxuICAgIGlmIChtZXNzYWdlLnJhbmdlICYmIG1lc3NhZ2UucmFuZ2UuY29uc3RydWN0b3IubmFtZSA9PT0gJ0FycmF5Jykge1xuICAgICAgbWVzc2FnZS5yYW5nZSA9IFJhbmdlLmZyb21PYmplY3QobWVzc2FnZS5yYW5nZSlcbiAgICB9XG4gICAgaWYgKGZpeCAmJiBmaXgucmFuZ2UuY29uc3RydWN0b3IubmFtZSA9PT0gJ0FycmF5Jykge1xuICAgICAgZml4LnJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChmaXgucmFuZ2UpXG4gICAgfVxuICAgIGlmICghbWVzc2FnZS5zZXZlcml0eSkge1xuICAgICAgY29uc3QgdHlwZSA9IG1lc3NhZ2UudHlwZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAodHlwZSA9PT0gJ3dhcm5pbmcnKSB7XG4gICAgICAgIG1lc3NhZ2Uuc2V2ZXJpdHkgPSB0eXBlXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdpbmZvJyB8fCB0eXBlID09PSAndHJhY2UnKSB7XG4gICAgICAgIG1lc3NhZ2Uuc2V2ZXJpdHkgPSAnaW5mbydcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3NhZ2Uuc2V2ZXJpdHkgPSAnZXJyb3InXG4gICAgICB9XG4gICAgfVxuICAgIG1lc3NhZ2UudmVyc2lvbiA9IDFcbiAgICBtZXNzYWdlLmxpbnRlck5hbWUgPSBsaW50ZXJOYW1lXG4gICAgbWVzc2FnZS5rZXkgPSBtZXNzYWdlS2V5TGVnYWN5KG1lc3NhZ2UpXG5cbiAgICBpZiAobWVzc2FnZS50cmFjZSkge1xuICAgICAgbm9ybWFsaXplTWVzc2FnZXNMZWdhY3kobGludGVyTmFtZSwgbWVzc2FnZS50cmFjZSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==