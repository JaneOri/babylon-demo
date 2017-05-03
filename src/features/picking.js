import DefineMap from 'can-define/map/';
import BABYLON from 'babylonjs/babylon.max';

export default DefineMap.extend({
  scene: "any", // Passed in initially: new Picking({ scene }); 
  selectedItem: "any",
  highlightLayer: "any",
  pickingInfo: "any",

  highlightMesh ( mesh ) {
    while ( mesh.parent ) {
      mesh = mesh.parent;
    }

    var color = BABYLON.Color3.Red();
    this.highlightLayer.addMesh( mesh, color );

    var meshes = mesh.getChildMeshes();
    for ( let x = 0; x < meshes.length; x++ ) {
      this.highlightLayer.addMesh( meshes[x], color );
    }
  },

  unhighlightMesh ( mesh ) {
    while ( mesh.parent ) {
      mesh = mesh.parent;
    }

    this.highlightLayer.removeMesh( mesh );

    var meshes = mesh.getChildMeshes();
    for ( let x = 0; x < meshes.length; x++ ) {
      this.highlightLayer.removeMesh( meshes[x] );
    }
  },

  pick ( position, predicate, fastCheck ) {
    this.pickingInfo = this.scene.pick( position.x, position.y, predicate, fastCheck );

    var newItem = this.pickingInfo.pickedMesh;
    if ( this.selectedItem && this.selectedItem !== newItem ) {
      this.unhighlightMesh( this.selectedItem );
    }

    if ( newItem && this.selectedItem !== newItem ) {
      this.selectedItem = newItem;
      this.highlightMesh( newItem );
    }

    if ( !newItem ) {
      this.selectedItem = null;
    }

    return this.pickingInfo;
  },

  // Requires 'scene' to be passed in on creation: new Picking({ scene });
  init () {
    this.highlightLayer = new BABYLON.HighlightLayer( "hl1", this.scene );
  }
});
