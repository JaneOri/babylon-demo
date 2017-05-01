import QUnit from 'steal-qunit';
import { ViewModel } from './babylon-canvas';

// ViewModel unit tests
QUnit.module('using-babylon/components/babylon-canvas');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the babylon-canvas component');
});
