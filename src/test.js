import F from 'funcunit';
import QUnit from 'steal-qunit';

import 'using-babylon/models/test';

import 'using-babylon/components/babylon-canvas/babylon-canvas-test';

F.attach(QUnit);

QUnit.module('using-babylon functional smoke test', {
  beforeEach() {
    F.open('./development.html');
  }
});

QUnit.test('using-babylon main page shows up', function() {
  F('title').text('using-babylon', 'Title is set');
});
