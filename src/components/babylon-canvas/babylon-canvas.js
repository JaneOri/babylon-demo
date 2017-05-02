import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './babylon-canvas.less';
import view from './babylon-canvas.stache';
import BABYLON from 'babylonjs/babylon.max';
import _debounce from 'lodash/debounce';
import { normalizedEventKey } from '../../util/event-helpers';

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
  heldInfo: {
    type: "any",
    value: {}
  },
  selectedItem: {
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

  // 0 - 99, just a value that changes every frame
  renderCount: {
    type: "number",
    value: -1
  },

  initScene () {
    var scene = new BABYLON.Scene( this.engine );
    scene.clearColor = new BABYLON.Color3( 0.25, 0.25, 0.25 );

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
    var initialRotationAroundXAxis = BABYLON.Tools.ToRadians( -90 );
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
    ground.material = new BABYLON.StandardMaterial( "groundmat", this.scene );
    ground.material.diffuseColor = new BABYLON.Color3( 0x39 / 255, 0x7F / 255, 0x17 / 255 );
    ground.material.emissiveColor = new BABYLON.Color3( 0x26 / 255, 0x43 / 255, 0x14 / 255 );
    ground.material.bumpTexture = new BABYLON.Texture( "/src/static/geo.bump.png", this.scene );

    // Params: name, subdivisions, size, scene
    var sphere = BABYLON.Mesh.CreateSphere( "sphere1", 16, 2, this.scene );
    sphere.position.y = 1;

    this.selectedItem = sphere;
  },

  wrapMeshesInRootContainer ( name, meshes ) {
    var container = new BABYLON.Mesh( name, this.scene );
    var ids = {};

    for ( let i = 0; i < meshes.length; i++ ) {
      let mesh = meshes[i];
      let parent = mesh.parent || mesh;
      while ( parent.parent && parent.parent !== container ) {
        parent = parent.parent;
      }
      if ( !ids[ parent.id ] ) {
        ids[ parent.id ] = true;
        parent.parent = container;
      }
    }

    return container;
  },

  spawnModel ( folder, filename ) {
    var vm = this;

    // Params: meshesNames, rootUrl, sceneFilename, scene, onsuccess, progressCallBack, onerror
    BABYLON.SceneLoader.ImportMesh(
      "",
      "/src/static/3d/" + folder + "/",
      filename,
      this.scene,
      function ( meshes ) {
        console.log("Spawned successfully", arguments);

        var rootMesh = vm.wrapMeshesInRootContainer( filename + Math.random(), meshes );

        if ( filename.indexOf("ufo") === 0 ) {

          rootMesh.position.x = 4;
          rootMesh.position.y = 3;
          rootMesh.position.z = 5;
          rootMesh.scaling.copyFromFloats( 3.5, 3.5, 3.5 );

        } else if ( filename.indexOf("mp5k") === 0 ) {

          rootMesh.position.copyFromFloats( 0, 3, 4 );
          rootMesh.scaling.copyFromFloats( 0.025, 0.025, 0.025 );
        }

        vm.selectedItem = rootMesh;
      },
      function () {
        console.log("Spawn Progress", arguments);
      },
      function () {
        console.log("Spawn failed", arguments);
      }
    );
  },

  mainRenderLoop () {
    var engine = this.engine;

    engine.runRenderLoop(() => {

      // Dump a couple values from this frame to the VM
      this.set({
        // Current frames per second
        "fpsCounter": engine.getFps().toFixed(),

        // Milliseconds since last frame render
        "deltaTime": engine.deltaTime,

        // just a var that changes every frame
        "renderCount": ( this.renderCount + 1 ) % 100
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
    ),

    "{document} keydown": function ( $doc, $ev ) {
      var norm = normalizedEventKey( $ev );
      var vm = this.viewModel;

      if ( vm.heldInfo[ norm ] ) {
        //only fire it on the initial 'down' event
        return;
      }
      vm.heldInfo[ norm ] = {
        ts: Date.now()
      };
    },

    "{document} keyup": function ( $doc, $ev ) {
      var norm = normalizedEventKey( $ev );
      var vm = this.viewModel;
      delete vm.heldInfo[ norm ];
    },

    "{viewModel} renderCount": function () {
      var vm = this.viewModel;
      var heldInfo = vm.heldInfo;

      var selectedItem = vm.selectedItem;
      if ( !selectedItem ) {
        return;
      }

      if ( heldInfo[ "w" ] ) {
        selectedItem.position.x += 0.2;
      }
      if ( heldInfo[ "s" ] ) {
        selectedItem.position.x -= 0.2;
      }
      if ( heldInfo[ "a" ] ) {
        selectedItem.position.z += 0.2;
      }
      if ( heldInfo[ "d" ] ) {
        selectedItem.position.z -= 0.2;
      }
    }
  }
});
