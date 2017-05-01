import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './babylon-canvas.less';
import view from './babylon-canvas.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the babylon-canvas component'
  }
});

export default Component.extend({
  tag: 'babylon-canvas',
  ViewModel,
  view
});
