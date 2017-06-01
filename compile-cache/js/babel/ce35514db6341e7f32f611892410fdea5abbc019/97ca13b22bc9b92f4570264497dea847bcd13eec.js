function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _jasmineFix = require('jasmine-fix');

var _libEditorLinter = require('../lib/editor-linter');

var _libEditorLinter2 = _interopRequireDefault(_libEditorLinter);

'use babel';

describe('EditorLinter', function () {
  var textEditor = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    yield atom.workspace.open(__dirname + '/fixtures/file.txt');
    textEditor = atom.workspace.getActiveTextEditor();
  }));
  afterEach(function () {
    atom.workspace.destroyActivePaneItem();
  });

  (0, _jasmineFix.it)('cries when constructor argument is not a text editor', function () {
    expect(function () {
      return new _libEditorLinter2['default']();
    }).toThrow('EditorLinter expects a valid TextEditor');
    expect(function () {
      return new _libEditorLinter2['default'](1);
    }).toThrow('EditorLinter expects a valid TextEditor');
    expect(function () {
      return new _libEditorLinter2['default']({});
    }).toThrow('EditorLinter expects a valid TextEditor');
    expect(function () {
      return new _libEditorLinter2['default']('');
    }).toThrow('EditorLinter expects a valid TextEditor');
  });

  describe('onDidDestroy', function () {
    (0, _jasmineFix.it)('is called when text editor is destroyed', function () {
      var triggered = false;
      var editor = new _libEditorLinter2['default'](textEditor);
      editor.onDidDestroy(function () {
        triggered = true;
      });
      expect(triggered).toBe(false);
      textEditor.destroy();
      expect(triggered).toBe(true);
    });
  });

  describe('onShouldLint', function () {
    (0, _jasmineFix.it)('is triggered on save', _asyncToGenerator(function* () {
      var timesTriggered = 0;
      var editor = new _libEditorLinter2['default'](textEditor);
      editor.onShouldLint(function () {
        timesTriggered++;
      });
      textEditor.save();
      textEditor.save();
      textEditor.save();
      textEditor.save();
      expect(timesTriggered).toBe(0);
      yield (0, _jasmineFix.wait)(10);
      expect(timesTriggered).toBe(1);
      textEditor.save();
      textEditor.save();
      textEditor.save();
      textEditor.save();
      expect(timesTriggered).toBe(1);
      yield (0, _jasmineFix.wait)(10);
      expect(timesTriggered).toBe(2);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3VnYy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9lZGl0b3ItbGludGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzswQkFFcUMsYUFBYTs7K0JBQ3pCLHNCQUFzQjs7OztBQUgvQyxXQUFXLENBQUE7O0FBS1gsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFXO0FBQ2xDLE1BQUksVUFBVSxZQUFBLENBQUE7O0FBRWQsZ0RBQVcsYUFBaUI7QUFDMUIsVUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBSSxTQUFTLHdCQUFxQixDQUFBO0FBQzNELGNBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7R0FDbEQsRUFBQyxDQUFBO0FBQ0YsV0FBUyxDQUFDLFlBQVc7QUFDbkIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0dBQ3ZDLENBQUMsQ0FBQTs7QUFFRixzQkFBRyxzREFBc0QsRUFBRSxZQUFXO0FBQ3BFLFVBQU0sQ0FBQyxZQUFXO0FBQ2hCLGFBQU8sa0NBQWtCLENBQUE7S0FDMUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBO0FBQ3JELFVBQU0sQ0FBQyxZQUFXO0FBQ2hCLGFBQU8saUNBQWlCLENBQUMsQ0FBQyxDQUFBO0tBQzNCLENBQUMsQ0FBQyxPQUFPLENBQUMseUNBQXlDLENBQUMsQ0FBQTtBQUNyRCxVQUFNLENBQUMsWUFBVztBQUNoQixhQUFPLGlDQUFpQixFQUFFLENBQUMsQ0FBQTtLQUM1QixDQUFDLENBQUMsT0FBTyxDQUFDLHlDQUF5QyxDQUFDLENBQUE7QUFDckQsVUFBTSxDQUFDLFlBQVc7QUFDaEIsYUFBTyxpQ0FBaUIsRUFBRSxDQUFDLENBQUE7S0FDNUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBO0dBQ3RELENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsY0FBYyxFQUFFLFlBQVc7QUFDbEMsd0JBQUcseUNBQXlDLEVBQUUsWUFBVztBQUN2RCxVQUFJLFNBQVMsR0FBRyxLQUFLLENBQUE7QUFDckIsVUFBTSxNQUFNLEdBQUcsaUNBQWlCLFVBQVUsQ0FBQyxDQUFBO0FBQzNDLFlBQU0sQ0FBQyxZQUFZLENBQUMsWUFBVztBQUM3QixpQkFBUyxHQUFHLElBQUksQ0FBQTtPQUNqQixDQUFDLENBQUE7QUFDRixZQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzdCLGdCQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDcEIsWUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUM3QixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFXO0FBQ2xDLHdCQUFHLHNCQUFzQixvQkFBRSxhQUFpQjtBQUMxQyxVQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7QUFDdEIsVUFBTSxNQUFNLEdBQUcsaUNBQWlCLFVBQVUsQ0FBQyxDQUFBO0FBQzNDLFlBQU0sQ0FBQyxZQUFZLENBQUMsWUFBVztBQUM3QixzQkFBYyxFQUFFLENBQUE7T0FDakIsQ0FBQyxDQUFBO0FBQ0YsZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNqQixnQkFBVSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pCLGdCQUFVLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDakIsZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNqQixZQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLFlBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxZQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLGdCQUFVLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDakIsZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNqQixnQkFBVSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pCLGdCQUFVLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDakIsWUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixZQUFNLHNCQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ2QsWUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUMvQixFQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvdWdjLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2VkaXRvci1saW50ZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IGl0LCB3YWl0LCBiZWZvcmVFYWNoIH0gZnJvbSAnamFzbWluZS1maXgnXG5pbXBvcnQgRWRpdG9yTGludGVyIGZyb20gJy4uL2xpYi9lZGl0b3ItbGludGVyJ1xuXG5kZXNjcmliZSgnRWRpdG9yTGludGVyJywgZnVuY3Rpb24oKSB7XG4gIGxldCB0ZXh0RWRpdG9yXG5cbiAgYmVmb3JlRWFjaChhc3luYyBmdW5jdGlvbigpIHtcbiAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGAke19fZGlybmFtZX0vZml4dHVyZXMvZmlsZS50eHRgKVxuICAgIHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgfSlcbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lSXRlbSgpXG4gIH0pXG5cbiAgaXQoJ2NyaWVzIHdoZW4gY29uc3RydWN0b3IgYXJndW1lbnQgaXMgbm90IGEgdGV4dCBlZGl0b3InLCBmdW5jdGlvbigpIHtcbiAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVkaXRvckxpbnRlcigpXG4gICAgfSkudG9UaHJvdygnRWRpdG9yTGludGVyIGV4cGVjdHMgYSB2YWxpZCBUZXh0RWRpdG9yJylcbiAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVkaXRvckxpbnRlcigxKVxuICAgIH0pLnRvVGhyb3coJ0VkaXRvckxpbnRlciBleHBlY3RzIGEgdmFsaWQgVGV4dEVkaXRvcicpXG4gICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFZGl0b3JMaW50ZXIoe30pXG4gICAgfSkudG9UaHJvdygnRWRpdG9yTGludGVyIGV4cGVjdHMgYSB2YWxpZCBUZXh0RWRpdG9yJylcbiAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVkaXRvckxpbnRlcignJylcbiAgICB9KS50b1Rocm93KCdFZGl0b3JMaW50ZXIgZXhwZWN0cyBhIHZhbGlkIFRleHRFZGl0b3InKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdvbkRpZERlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnaXMgY2FsbGVkIHdoZW4gdGV4dCBlZGl0b3IgaXMgZGVzdHJveWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdHJpZ2dlcmVkID0gZmFsc2VcbiAgICAgIGNvbnN0IGVkaXRvciA9IG5ldyBFZGl0b3JMaW50ZXIodGV4dEVkaXRvcilcbiAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3koZnVuY3Rpb24oKSB7XG4gICAgICAgIHRyaWdnZXJlZCA9IHRydWVcbiAgICAgIH0pXG4gICAgICBleHBlY3QodHJpZ2dlcmVkKS50b0JlKGZhbHNlKVxuICAgICAgdGV4dEVkaXRvci5kZXN0cm95KClcbiAgICAgIGV4cGVjdCh0cmlnZ2VyZWQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdvblNob3VsZExpbnQnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnaXMgdHJpZ2dlcmVkIG9uIHNhdmUnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1RyaWdnZXJlZCA9IDBcbiAgICAgIGNvbnN0IGVkaXRvciA9IG5ldyBFZGl0b3JMaW50ZXIodGV4dEVkaXRvcilcbiAgICAgIGVkaXRvci5vblNob3VsZExpbnQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzVHJpZ2dlcmVkKytcbiAgICAgIH0pXG4gICAgICB0ZXh0RWRpdG9yLnNhdmUoKVxuICAgICAgdGV4dEVkaXRvci5zYXZlKClcbiAgICAgIHRleHRFZGl0b3Iuc2F2ZSgpXG4gICAgICB0ZXh0RWRpdG9yLnNhdmUoKVxuICAgICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDApXG4gICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDEpXG4gICAgICB0ZXh0RWRpdG9yLnNhdmUoKVxuICAgICAgdGV4dEVkaXRvci5zYXZlKClcbiAgICAgIHRleHRFZGl0b3Iuc2F2ZSgpXG4gICAgICB0ZXh0RWRpdG9yLnNhdmUoKVxuICAgICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDEpXG4gICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDIpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=