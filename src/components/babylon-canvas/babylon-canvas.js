import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './babylon-canvas.less';
import view from './babylon-canvas.stache';
import BABYLON from 'babylonjs/babylon.max';
import _debounce from 'lodash/debounce';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the babylon-canvas component'
  },

  canvas: {
    type: "any"
  },
  camera: {
    type: "any"
  },
  engine: {
    type: "any"
  },
  scene: {
    type: "any"
  },

  // Current Frames Per Second
  fpsCounter: {
    type: "number",
    value: 0
  },

  // Milliseconds since last frame was rendered
  deltaTime: {
    type: "number",
    value: -1
  },

  initScene () {
    var scene = new BABYLON.Scene( this.engine );
    scene.clearColor = new BABYLON.Color3( 0, 0, 0 );

    // disable things we aren't using
    scene.probesEnabled = false;
    scene.proceduralTexturesEnabled = false;
    scene.skeletonsEnabled = false;
    scene.spritesEnabled = false;
    scene.particlesEnabled = false;
    scene.lensFlaresEnabled = false;
    scene.fogEnabled = false;

    this.scene = scene;

    return scene;
  },

  initCamera () {
    var initialRotationAroundYAxis = BABYLON.Tools.ToRadians( 0 );
    var initialRotationAroundXAxis = BABYLON.Tools.ToRadians( 90 );
    var initialRadius = 10;
    var initialLookAtTarget = new BABYLON.Vector3( 0, 2, 0 );
    //var initialLookAtTarget = new BABYLON.Vector3( 0, 2, 0 );
    var camera = new BABYLON.ArcRotateCamera(
      "camera1",
      initialRotationAroundYAxis,
      initialRotationAroundXAxis,
      initialRadius,
      initialLookAtTarget,
      this.scene
    );

    camera.setTarget( new BABYLON.Vector3( 0, 1.25, 0 ) );
    camera.attachControl( this.canvas, false );

    this.camera = camera;

    return camera;
  },

  addStuffToScene () {
    var light = new BABYLON.HemisphericLight( "light1", new BABYLON.Vector3(0, 1, 0), this.scene );
    light.intensity = 0.5;

    // Params: name, width, depth, subdivisions, scene
    var ground = BABYLON.Mesh.CreateGround( "ground1", 16, 16, 2, this.scene );

    // Params: name, subdivisions, size, scene
    var sphere = BABYLON.Mesh.CreateSphere( "sphere1", 16, 2, this.scene );
    sphere.position.y = 1;
  },

  mainRenderLoop () {
    var engine = this.engine;
    engine.runRenderLoop(() => {

      // Dump a couple values from this frame to the VM
      this.set({
        // Current frames per second
        "fpsCounter": engine.getFps().toFixed(),

        // Milliseconds since last frame render
        "deltaTime": engine.deltaTime
      });

      this.scene.render();
    });
  }
});

export default Component.extend({
  tag: 'babylon-canvas',
  ViewModel,
  view,
  events: {
    inserted () {
      var vm = this.viewModel;
      var canvas = this.element.getElementsByTagName( "canvas" )[ 0 ];

      var antialiasing = true;
      var adaptToDeviceRatio = true;
      var engine = new BABYLON.Engine( canvas, antialiasing, null, true );

      vm.set({
        canvas,
        engine
      });

      vm.initScene();

      vm.initCamera();

      vm.addStuffToScene();

      vm.mainRenderLoop();

      window.bcvm = vm;
    },

    "{window} resize": _debounce(
      function () {
        var vm = this.viewModel;
        var engine = vm && vm.engine;
        engine && engine.resize();
      },
      100
    )
  }
});
