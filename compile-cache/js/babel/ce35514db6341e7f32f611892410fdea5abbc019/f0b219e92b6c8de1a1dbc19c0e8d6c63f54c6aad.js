function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _sbEventKit = require('sb-event-kit');

var _jasmineFix = require('jasmine-fix');

var _libCommands = require('../lib/commands');

var _libCommands2 = _interopRequireDefault(_libCommands);

var _helpers = require('./helpers');

describe('Commands', function () {
  var commands = undefined;
  var editorView = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    commands = new _libCommands2['default']();
    commands.activate();
    yield atom.workspace.open(__filename);
    editorView = atom.views.getView(atom.workspace.getActiveTextEditor());
  }));
  afterEach(function () {
    atom.workspace.destroyActivePane();
    commands.dispose();
  });

  describe('Highlights', function () {
    (0, _jasmineFix.it)('does nothing if not activated and we try to deactivate', function () {
      commands.processHighlightsHide();
    });
    (0, _jasmineFix.it)('does not activate unless provider tells it to', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(false);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(0);
    }));
    (0, _jasmineFix.it)('activates when the provider tells it to', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('throws if already highlighted', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      try {
        yield commands.processHighlightsShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processHighlightsShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      commands.processHighlightsHide();
      commands.processHighlightsHide();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes list if available', _asyncToGenerator(function* () {
      var disposed = false;
      var active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      active.subscriptions.add(new _sbEventKit.Disposable(function () {
        disposed = true;
      }));
      commands.active = active;
      expect(disposed).toBe(false);
      yield commands.processHighlightsShow();
      expect(disposed).toBe(true);
    }));
    (0, _jasmineFix.it)('adds and removes classes appropriately', _asyncToGenerator(function* () {
      commands.onHighlightsShow(function () {
        return Promise.resolve(true);
      });
      expect(editorView.classList.contains('intentions-highlights')).toBe(false);
      yield commands.processHighlightsShow();
      expect(editorView.classList.contains('intentions-highlights')).toBe(true);
      commands.processHighlightsHide();
      expect(editorView.classList.contains('intentions-highlights')).toBe(false);
    }));
    describe('command listener', function () {
      (0, _jasmineFix.it)('just activates if theres no keyboard event attached', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.commands.dispatch(editorView, 'intentions:highlight');
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('ignores more than one activation requests', _asyncToGenerator(function* () {
        var timesShow = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
      }));
      (0, _jasmineFix.it)('just activates if keyboard event is not keydown', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('does not deactivate if keyup is not same keycode', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup', 1));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('does deactivate if keyup is the same keycode', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
    });
  });
  describe('Lists', function () {
    (0, _jasmineFix.it)('does nothing if deactivated and we try to activate it', function () {
      commands.processListHide();
    });
    (0, _jasmineFix.it)('does not pass on move events if not activated', function () {
      var callback = jasmine.createSpy('commands:list-move');
      commands.onListMove(callback);
      commands.processListMove('up');
      commands.processListMove('down');
      commands.processListMove('down');
      expect(callback).not.toHaveBeenCalled();
    });
    (0, _jasmineFix.it)('passes on move events if activated', function () {
      var callback = jasmine.createSpy('commands:list-move');
      commands.onListMove(callback);
      commands.processListMove('down');
      commands.processListMove('down');
      commands.processListMove('down');
      commands.active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.processListMove('down');
      commands.processListMove('down');
      commands.processListMove('down');
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.length).toBe(3);
    });
    (0, _jasmineFix.it)('ignores confirm if not activated', function () {
      var callback = jasmine.createSpy('commands:list-confirm');
      commands.onListConfirm(callback);
      commands.processListConfirm();
      commands.processListConfirm();
      commands.processListConfirm();
      commands.processListConfirm();
      expect(callback).not.toHaveBeenCalled();
    });
    (0, _jasmineFix.it)('passes on confirm if activated', function () {
      var callback = jasmine.createSpy('commands:list-confirm');
      commands.onListConfirm(callback);
      commands.processListConfirm();
      commands.processListConfirm();
      commands.active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.processListConfirm();
      commands.processListConfirm();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.length).toBe(2);
    });
    (0, _jasmineFix.it)('does not activate if listeners dont say that', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(false);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(0);
    }));
    (0, _jasmineFix.it)('activates when listeners allow', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('ignores if list is already active', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      commands.processListHide();
      commands.processListHide();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes if highlights are active', _asyncToGenerator(function* () {
      var disposed = false;
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
      commands.active = { type: 'highlight', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.active.subscriptions.add(new _sbEventKit.Disposable(function () {
        disposed = true;
      }));
      expect(disposed).toBe(false);
      yield commands.processListShow();
      commands.processListHide();
      expect(disposed).toBe(true);
      expect(timesShow).toBe(2);
      expect(timesHide).toBe(2);
    }));
    (0, _jasmineFix.it)('adds and removes classes appropriately', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      expect(editorView.classList.contains('intentions-list')).toBe(false);
      yield commands.processListShow();
      expect(editorView.classList.contains('intentions-list')).toBe(true);
      commands.processListHide();
      expect(editorView.classList.contains('intentions-list')).toBe(false);
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes list on mouseup', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
      yield commands.processListShow();
      document.body.dispatchEvent(new MouseEvent('mouseup'));
      yield (0, _jasmineFix.wait)(10);
      expect(timesShow).toBe(2);
      expect(timesHide).toBe(2);
    }));
    describe('command listener', function () {
      (0, _jasmineFix.it)('just enables when no keyboard event', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.commands.dispatch(editorView, 'intentions:show');
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('just enables when keyboard event is not keydown', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('ignores more than one activation requests', _asyncToGenerator(function* () {
        var timesShow = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes itself on any commands other than known', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-up' } });
        yield (0, _jasmineFix.wait)(10);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-down' } });
        yield (0, _jasmineFix.wait)(10);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-confirm' } });
        yield (0, _jasmineFix.wait)(10);
        document.body.dispatchEvent((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);

        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3VnYy8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvY29tbWFuZHMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OzBCQUVnRCxjQUFjOzswQkFDekIsYUFBYTs7MkJBQzdCLGlCQUFpQjs7Ozt1QkFDTCxXQUFXOztBQUU1QyxRQUFRLENBQUMsVUFBVSxFQUFFLFlBQVc7QUFDOUIsTUFBSSxRQUFRLFlBQUEsQ0FBQTtBQUNaLE1BQUksVUFBVSxZQUFBLENBQUE7O0FBRWQsZ0RBQVcsYUFBaUI7QUFDMUIsWUFBUSxHQUFHLDhCQUFjLENBQUE7QUFDekIsWUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQ25CLFVBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDckMsY0FBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO0dBQ3RFLEVBQUMsQ0FBQTtBQUNGLFdBQVMsQ0FBQyxZQUFXO0FBQ25CLFFBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtBQUNsQyxZQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDbkIsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBVztBQUNoQyx3QkFBRyx3REFBd0QsRUFBRSxZQUFXO0FBQ3RFLGNBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0tBQ2pDLENBQUMsQ0FBQTtBQUNGLHdCQUFHLCtDQUErQyxvQkFBRSxhQUFpQjtBQUNuRSxVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsVUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLGNBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFXO0FBQ25DLGlCQUFTLEVBQUUsQ0FBQTtBQUNYLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM5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QzFGLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxnQkFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsK0JBQWlCLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDdEQsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFekIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzdGLGNBQU0sc0JBQUssRUFBRSxDQUFDLENBQUE7QUFDZCxnQkFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsK0JBQWlCLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDdEQsY0FBTSxzQkFBSyxFQUFFLENBQUMsQ0FBQTtBQUNkLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFekIsZ0JBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUMxQixjQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLGNBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDMUIsRUFBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL3VnYy8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvY29tbWFuZHMtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgeyBpdCwgYmVmb3JlRWFjaCwgd2FpdCB9IGZyb20gJ2phc21pbmUtZml4J1xuaW1wb3J0IENvbW1hbmRzIGZyb20gJy4uL2xpYi9jb21tYW5kcydcbmltcG9ydCB7IGdldEtleWJvYXJkRXZlbnQgfSBmcm9tICcuL2hlbHBlcnMnXG5cbmRlc2NyaWJlKCdDb21tYW5kcycsIGZ1bmN0aW9uKCkge1xuICBsZXQgY29tbWFuZHNcbiAgbGV0IGVkaXRvclZpZXdcblxuICBiZWZvcmVFYWNoKGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgIGNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICBjb21tYW5kcy5hY3RpdmF0ZSgpXG4gICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihfX2ZpbGVuYW1lKVxuICAgIGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICB9KVxuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmUoKVxuICAgIGNvbW1hbmRzLmRpc3Bvc2UoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdIaWdobGlnaHRzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2RvZXMgbm90aGluZyBpZiBub3QgYWN0aXZhdGVkIGFuZCB3ZSB0cnkgdG8gZGVhY3RpdmF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBhY3RpdmF0ZSB1bmxlc3MgcHJvdmlkZXIgdGVsbHMgaXQgdG8nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgfSlcbiAgICBpdCgnYWN0aXZhdGVzIHdoZW4gdGhlIHByb3ZpZGVyIHRlbGxzIGl0IHRvJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgndGhyb3dzIGlmIGFscmVhZHkgaGlnaGxpZ2h0ZWQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICAgIGV4cGVjdChmYWxzZSkudG9CZSh0cnVlKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvQmUoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICAgIGV4cGVjdChmYWxzZSkudG9CZSh0cnVlKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvQmUoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgIH1cbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcblxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2Rpc3Bvc2VzIGxpc3QgaWYgYXZhaWxhYmxlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgZGlzcG9zZWQgPSBmYWxzZVxuICAgICAgY29uc3QgYWN0aXZlID0geyB0eXBlOiAnbGlzdCcsIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgYWN0aXZlLnN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICBkaXNwb3NlZCA9IHRydWVcbiAgICAgIH0pKVxuICAgICAgY29tbWFuZHMuYWN0aXZlID0gYWN0aXZlXG4gICAgICBleHBlY3QoZGlzcG9zZWQpLnRvQmUoZmFsc2UpXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuICAgICAgZXhwZWN0KGRpc3Bvc2VkKS50b0JlKHRydWUpXG4gICAgfSlcbiAgICBpdCgnYWRkcyBhbmQgcmVtb3ZlcyBjbGFzc2VzIGFwcHJvcHJpYXRlbHknLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtaGlnaGxpZ2h0cycpKS50b0JlKGZhbHNlKVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgIGV4cGVjdChlZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaW50ZW50aW9ucy1oaWdobGlnaHRzJykpLnRvQmUodHJ1ZSlcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtaGlnaGxpZ2h0cycpKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gICAgZGVzY3JpYmUoJ2NvbW1hbmQgbGlzdGVuZXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdqdXN0IGFjdGl2YXRlcyBpZiB0aGVyZXMgbm8ga2V5Ym9hcmQgZXZlbnQgYXR0YWNoZWQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDApXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JWaWV3LCAnaW50ZW50aW9uczpoaWdobGlnaHQnKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZG9jdW1lbnQuYm9keS5kaXNwYXRjaEV2ZW50KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnaWdub3JlcyBtb3JlIHRoYW4gb25lIGFjdGl2YXRpb24gcmVxdWVzdHMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpoaWdobGlnaHQnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdqdXN0IGFjdGl2YXRlcyBpZiBrZXlib2FyZCBldmVudCBpcyBub3Qga2V5ZG93bicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRvY3VtZW50LmJvZHkuZGlzcGF0Y2hFdmVudChnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2RvZXMgbm90IGRlYWN0aXZhdGUgaWYga2V5dXAgaXMgbm90IHNhbWUga2V5Y29kZScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5ZG93bicpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZG9jdW1lbnQuYm9keS5kaXNwYXRjaEV2ZW50KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJywgMSkpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnZG9lcyBkZWFjdGl2YXRlIGlmIGtleXVwIGlzIHRoZSBzYW1lIGtleWNvZGUnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDApXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleWRvd24nKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRvY3VtZW50LmJvZHkuZGlzcGF0Y2hFdmVudChnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCdMaXN0cycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdkb2VzIG5vdGhpbmcgaWYgZGVhY3RpdmF0ZWQgYW5kIHdlIHRyeSB0byBhY3RpdmF0ZSBpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBwYXNzIG9uIG1vdmUgZXZlbnRzIGlmIG5vdCBhY3RpdmF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NvbW1hbmRzOmxpc3QtbW92ZScpXG4gICAgICBjb21tYW5kcy5vbkxpc3RNb3ZlKGNhbGxiYWNrKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCd1cCcpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGV4cGVjdChjYWxsYmFjaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gICAgaXQoJ3Bhc3NlcyBvbiBtb3ZlIGV2ZW50cyBpZiBhY3RpdmF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NvbW1hbmRzOmxpc3QtbW92ZScpXG4gICAgICBjb21tYW5kcy5vbkxpc3RNb3ZlKGNhbGxiYWNrKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgY29tbWFuZHMuYWN0aXZlID0geyB0eXBlOiAnbGlzdCcsIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxscy5sZW5ndGgpLnRvQmUoMylcbiAgICB9KVxuICAgIGl0KCdpZ25vcmVzIGNvbmZpcm0gaWYgbm90IGFjdGl2YXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY29tbWFuZHM6bGlzdC1jb25maXJtJylcbiAgICAgIGNvbW1hbmRzLm9uTGlzdENvbmZpcm0oY2FsbGJhY2spXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgICBpdCgncGFzc2VzIG9uIGNvbmZpcm0gaWYgYWN0aXZhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjb21tYW5kczpsaXN0LWNvbmZpcm0nKVxuICAgICAgY29tbWFuZHMub25MaXN0Q29uZmlybShjYWxsYmFjaylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgY29tbWFuZHMuYWN0aXZlID0geyB0eXBlOiAnbGlzdCcsIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBleHBlY3QoY2FsbGJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrLmNhbGxzLmxlbmd0aCkudG9CZSgyKVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IGFjdGl2YXRlIGlmIGxpc3RlbmVycyBkb250IHNheSB0aGF0JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICB9KVxuICAgIGl0KCdhY3RpdmF0ZXMgd2hlbiBsaXN0ZW5lcnMgYWxsb3cnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgnaWdub3JlcyBpZiBsaXN0IGlzIGFscmVhZHkgYWN0aXZlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0JlKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0JlKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0JlKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICB9XG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgnZGlzcG9zZXMgaWYgaGlnaGxpZ2h0cyBhcmUgYWN0aXZlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgZGlzcG9zZWQgPSBmYWxzZVxuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIGNvbW1hbmRzLmFjdGl2ZSA9IHsgdHlwZTogJ2hpZ2hsaWdodCcsIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgfVxuICAgICAgY29tbWFuZHMuYWN0aXZlLnN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICBkaXNwb3NlZCA9IHRydWVcbiAgICAgIH0pKVxuICAgICAgZXhwZWN0KGRpc3Bvc2VkKS50b0JlKGZhbHNlKVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QoZGlzcG9zZWQpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMilcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMilcbiAgICB9KVxuICAgIGl0KCdhZGRzIGFuZCByZW1vdmVzIGNsYXNzZXMgYXBwcm9wcmlhdGVseScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtbGlzdCcpKS50b0JlKGZhbHNlKVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGV4cGVjdChlZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaW50ZW50aW9ucy1saXN0JykpLnRvQmUodHJ1ZSlcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtbGlzdCcpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2Rpc3Bvc2VzIGxpc3Qgb24gbW91c2V1cCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICBkb2N1bWVudC5ib2R5LmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ21vdXNldXAnKSlcbiAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDIpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDIpXG4gICAgfSlcbiAgICBkZXNjcmliZSgnY29tbWFuZCBsaXN0ZW5lcicsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ2p1c3QgZW5hYmxlcyB3aGVuIG5vIGtleWJvYXJkIGV2ZW50JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JWaWV3LCAnaW50ZW50aW9uczpzaG93JylcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRvY3VtZW50LmJvZHkuZGlzcGF0Y2hFdmVudChnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2p1c3QgZW5hYmxlcyB3aGVuIGtleWJvYXJkIGV2ZW50IGlzIG5vdCBrZXlkb3duJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOnNob3cnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZG9jdW1lbnQuYm9keS5kaXNwYXRjaEV2ZW50KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnaWdub3JlcyBtb3JlIHRoYW4gb25lIGFjdGl2YXRpb24gcmVxdWVzdHMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOnNob3cnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6c2hvdycsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpzaG93JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGl0KCdkaXNwb3NlcyBpdHNlbGYgb24gYW55IGNvbW1hbmRzIG90aGVyIHRoYW4ga25vd24nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6c2hvdycsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleWRvd24nKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGRvY3VtZW50LmJvZHkuZGlzcGF0Y2hFdmVudChnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcblxuICAgICAgICBhdG9tLmtleW1hcHMuZW1pdHRlci5lbWl0KCdkaWQtbWF0Y2gtYmluZGluZycsIHsgYmluZGluZzogeyBjb21tYW5kOiAnY29yZTptb3ZlLXVwJyB9IH0pXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGRvY3VtZW50LmJvZHkuZGlzcGF0Y2hFdmVudChnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcblxuICAgICAgICBhdG9tLmtleW1hcHMuZW1pdHRlci5lbWl0KCdkaWQtbWF0Y2gtYmluZGluZycsIHsgYmluZGluZzogeyBjb21tYW5kOiAnY29yZTptb3ZlLWRvd24nIH0gfSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZG9jdW1lbnQuYm9keS5kaXNwYXRjaEV2ZW50KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuXG4gICAgICAgIGF0b20ua2V5bWFwcy5lbWl0dGVyLmVtaXQoJ2RpZC1tYXRjaC1iaW5kaW5nJywgeyBiaW5kaW5nOiB7IGNvbW1hbmQ6ICdjb3JlOm1vdmUtY29uZmlybScgfSB9KVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBkb2N1bWVudC5ib2R5LmRpc3BhdGNoRXZlbnQoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG5cbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19