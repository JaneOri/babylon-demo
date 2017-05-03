# using-babylon

Welcome to the using-babylon DoneJS application!

# Commit 1 - command line stuff

  - npm install donejs@1
  - donejs add app using-babylon
  - cd using-babylon/
  - donejs add component components/babylon-canvas babylon-canvas
  - npm install babylonjs --save
  - npm install lodash --save

# Commit 2 - basic 3D render with an ArcRotateCamera

  Notes:

    Engine
      - do we use antiailising?
      - Is it fullscreen?
      - is it using pointer lock API?
      - How long does it take to render a frame / fps
      - runRenderLoop()
      - resize()
      - enableVR() / disableVR()

    Scene
      - contains all the stuff you'd render or use to render
        - objects, color settings, materials, skymap, fog effects, gravity, lights, particles, etc
      - access things with methods similar to DOM
        - getCameraByName()
        - getMeshByName()
        - getMaterialByName()
        - getLightByName()
        - getEngine()

# Commit 3 - spawning models

  - wrap in container mesh for easy position/rotation/scaling modification

# Commit 4 - Add controls and ground material

# Commit 5 - Add highlighting, mouse picking, and show how I add modular features




----

## Running tests

Tests can be run with

```
donejs test
```

## Development mode

Development mode can be started with

```
donejs develop
```

## Build and production mode

To build the application into a production bundle run

```
donejs build
```

In Unix environment the production application can be started like this:

```
NODE_ENV=production npm start
```
