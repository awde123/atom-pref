function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _jasmineFix = require('jasmine-fix');

var _libToggleView = require('../lib/toggle-view');

var _libToggleView2 = _interopRequireDefault(_libToggleView);

describe('Toggle View', function () {
  beforeEach(function () {
    atom.config.set('linter.disabledProviders', []);
  });

  describe('::getItems', function () {
    (0, _jasmineFix.it)('returns disabled when enabling', _asyncToGenerator(function* () {
      var toggleView = new _libToggleView2['default']('enable', ['Package 1', 'Package 2', 'Package 3']);
      atom.config.set('linter.disabledProviders', ['Package 2']);
      expect((yield toggleView.getItems())).toEqual(['Package 2']);
    }));
    (0, _jasmineFix.it)('returns enabled when disabling', _asyncToGenerator(function* () {
      var toggleView = new _libToggleView2['default']('disable', ['Package 1', 'Package 2', 'Package 3']);
      atom.config.set('linter.disabledProviders', ['Package 2']);
      expect((yield toggleView.getItems())).toEqual(['Package 1', 'Package 3']);
    }));
  });
  (0, _jasmineFix.it)('has a working lifecycle', _asyncToGenerator(function* () {
    var didDisable = [];
    var toggleView = new _libToggleView2['default']('disable', ['Package 1', 'Package 2', 'Package 3']);

    spyOn(toggleView, 'process').andCallThrough();
    spyOn(toggleView, 'getItems').andCallThrough();
    toggleView.onDidDisable(function (name) {
      return didDisable.push(name);
    });

    expect(didDisable).toEqual([]);
    expect(toggleView.process.calls.length).toBe(0);
    expect(toggleView.getItems.calls.length).toBe(0);
    expect(atom.workspace.getModalPanels().length).toBe(0);
    yield toggleView.show();
    expect(didDisable).toEqual([]);
    expect(toggleView.process.calls.length).toBe(0);
    expect(toggleView.getItems.calls.length).toBe(1);
    expect(atom.workspace.getModalPanels().length).toBe(1);

    var element = atom.workspace.getModalPanels()[0].item.element.querySelector('.list-group');
    expect(element.children.length).toBe(3);
    expect(element.children[0].textContent).toBe('Package 1');
    expect(element.children[1].textContent).toBe('Package 2');
    expect(element.children[2].textContent).toBe('Package 3');
    element.children[1].dispatchEvent(new MouseEvent('click'));

    expect(toggleView.process.calls.length).toBe(1);
    expect(toggleView.getItems.calls.length).toBe(1);
    expect(toggleView.process.calls[0].args[0]).toBe('Package 2');
    yield (0, _jasmineFix.wait)(50);
    expect(didDisable).toEqual(['Package 2']);
    expect(atom.config.get('linter.disabledProviders')).toEqual(['Package 2']);
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3VnYy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy90b2dnbGUtdmlldy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7MEJBRXlCLGFBQWE7OzZCQUVmLG9CQUFvQjs7OztBQUUzQyxRQUFRLENBQUMsYUFBYSxFQUFFLFlBQVc7QUFDakMsWUFBVSxDQUFDLFlBQVc7QUFDcEIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsRUFBRSxDQUFDLENBQUE7R0FDaEQsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBVztBQUNoQyx3QkFBRyxnQ0FBZ0Msb0JBQUUsYUFBaUI7QUFDcEQsVUFBTSxVQUFVLEdBQUcsK0JBQWUsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBO0FBQ3BGLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtBQUMxRCxZQUFNLEVBQUMsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7S0FDM0QsRUFBQyxDQUFBO0FBQ0Ysd0JBQUcsZ0NBQWdDLG9CQUFFLGFBQWlCO0FBQ3BELFVBQU0sVUFBVSxHQUFHLCtCQUFlLFNBQVMsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQTtBQUNyRixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7QUFDMUQsWUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQTtLQUN4RSxFQUFDLENBQUE7R0FD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Q0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzdELFVBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxVQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtBQUN6QyxVQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7R0FDM0UsRUFBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL3VnYy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy90b2dnbGUtdmlldy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgaXQsIHdhaXQgfSBmcm9tICdqYXNtaW5lLWZpeCdcblxuaW1wb3J0IFRvZ2dsZVZpZXcgZnJvbSAnLi4vbGliL3RvZ2dsZS12aWV3J1xuXG5kZXNjcmliZSgnVG9nZ2xlIFZpZXcnLCBmdW5jdGlvbigpIHtcbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIFtdKVxuICB9KVxuXG4gIGRlc2NyaWJlKCc6OmdldEl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3JldHVybnMgZGlzYWJsZWQgd2hlbiBlbmFibGluZycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdG9nZ2xlVmlldyA9IG5ldyBUb2dnbGVWaWV3KCdlbmFibGUnLCBbJ1BhY2thZ2UgMScsICdQYWNrYWdlIDInLCAnUGFja2FnZSAzJ10pXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIFsnUGFja2FnZSAyJ10pXG4gICAgICBleHBlY3QoYXdhaXQgdG9nZ2xlVmlldy5nZXRJdGVtcygpKS50b0VxdWFsKFsnUGFja2FnZSAyJ10pXG4gICAgfSlcbiAgICBpdCgncmV0dXJucyBlbmFibGVkIHdoZW4gZGlzYWJsaW5nJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0b2dnbGVWaWV3ID0gbmV3IFRvZ2dsZVZpZXcoJ2Rpc2FibGUnLCBbJ1BhY2thZ2UgMScsICdQYWNrYWdlIDInLCAnUGFja2FnZSAzJ10pXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIFsnUGFja2FnZSAyJ10pXG4gICAgICBleHBlY3QoYXdhaXQgdG9nZ2xlVmlldy5nZXRJdGVtcygpKS50b0VxdWFsKFsnUGFja2FnZSAxJywgJ1BhY2thZ2UgMyddKVxuICAgIH0pXG4gIH0pXG4gIGl0KCdoYXMgYSB3b3JraW5nIGxpZmVjeWNsZScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGRpZERpc2FibGUgPSBbXVxuICAgIGNvbnN0IHRvZ2dsZVZpZXcgPSBuZXcgVG9nZ2xlVmlldygnZGlzYWJsZScsIFsnUGFja2FnZSAxJywgJ1BhY2thZ2UgMicsICdQYWNrYWdlIDMnXSlcblxuICAgIHNweU9uKHRvZ2dsZVZpZXcsICdwcm9jZXNzJykuYW5kQ2FsbFRocm91Z2goKVxuICAgIHNweU9uKHRvZ2dsZVZpZXcsICdnZXRJdGVtcycpLmFuZENhbGxUaHJvdWdoKClcbiAgICB0b2dnbGVWaWV3Lm9uRGlkRGlzYWJsZShuYW1lID0+IGRpZERpc2FibGUucHVzaChuYW1lKSlcblxuICAgIGV4cGVjdChkaWREaXNhYmxlKS50b0VxdWFsKFtdKVxuICAgIGV4cGVjdCh0b2dnbGVWaWV3LnByb2Nlc3MuY2FsbHMubGVuZ3RoKS50b0JlKDApXG4gICAgZXhwZWN0KHRvZ2dsZVZpZXcuZ2V0SXRlbXMuY2FsbHMubGVuZ3RoKS50b0JlKDApXG4gICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldE1vZGFsUGFuZWxzKCkubGVuZ3RoKS50b0JlKDApXG4gICAgYXdhaXQgdG9nZ2xlVmlldy5zaG93KClcbiAgICBleHBlY3QoZGlkRGlzYWJsZSkudG9FcXVhbChbXSlcbiAgICBleHBlY3QodG9nZ2xlVmlldy5wcm9jZXNzLmNhbGxzLmxlbmd0aCkudG9CZSgwKVxuICAgIGV4cGVjdCh0b2dnbGVWaWV3LmdldEl0ZW1zLmNhbGxzLmxlbmd0aCkudG9CZSgxKVxuICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRNb2RhbFBhbmVscygpLmxlbmd0aCkudG9CZSgxKVxuXG4gICAgY29uc3QgZWxlbWVudCA9IGF0b20ud29ya3NwYWNlLmdldE1vZGFsUGFuZWxzKClbMF0uaXRlbS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXN0LWdyb3VwJylcbiAgICBleHBlY3QoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpLnRvQmUoMylcbiAgICBleHBlY3QoZWxlbWVudC5jaGlsZHJlblswXS50ZXh0Q29udGVudCkudG9CZSgnUGFja2FnZSAxJylcbiAgICBleHBlY3QoZWxlbWVudC5jaGlsZHJlblsxXS50ZXh0Q29udGVudCkudG9CZSgnUGFja2FnZSAyJylcbiAgICBleHBlY3QoZWxlbWVudC5jaGlsZHJlblsyXS50ZXh0Q29udGVudCkudG9CZSgnUGFja2FnZSAzJylcbiAgICBlbGVtZW50LmNoaWxkcmVuWzFdLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ2NsaWNrJykpXG5cbiAgICBleHBlY3QodG9nZ2xlVmlldy5wcm9jZXNzLmNhbGxzLmxlbmd0aCkudG9CZSgxKVxuICAgIGV4cGVjdCh0b2dnbGVWaWV3LmdldEl0ZW1zLmNhbGxzLmxlbmd0aCkudG9CZSgxKVxuICAgIGV4cGVjdCh0b2dnbGVWaWV3LnByb2Nlc3MuY2FsbHNbMF0uYXJnc1swXSkudG9CZSgnUGFja2FnZSAyJylcbiAgICBhd2FpdCB3YWl0KDUwKVxuICAgIGV4cGVjdChkaWREaXNhYmxlKS50b0VxdWFsKFsnUGFja2FnZSAyJ10pXG4gICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgnbGludGVyLmRpc2FibGVkUHJvdmlkZXJzJykpLnRvRXF1YWwoWydQYWNrYWdlIDInXSlcbiAgfSlcbn0pXG4iXX0=