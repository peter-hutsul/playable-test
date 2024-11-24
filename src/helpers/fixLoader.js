import { GLTFLoader } from "./GLTFLoader";
import { LoadingManager } from "three";

var gltfLoader = null;

Tiny.Loader.gltf = function (resource, cb) {
  var key = resource.key;

  if (gltfLoader == null) {
    var manager = new LoadingManager();
    gltfLoader = new GLTFLoader(manager);
  }

  function loaded(gltf) {
    Tiny.Cache.gltf[key] = gltf;

    if (resource.split) {
      gltf.scene.traverse(function (obj) {
        if (obj.isMesh) Tiny.Cache.mesh3d[key + "." + obj.name] = obj;
      });

      for (var i = 0; i < gltf.animations.length; i++) {
        var obj = gltf.animations[i];
        Tiny.Cache.animation3d[key + "." + obj.name] = obj;
      }
    }

    if (resource.cb) resource.cb(gltf);

    cb();
  }

  if (resource.src.length > 200) {
    gltfLoader.load(resource.src, loaded);
  } else {
    gltfLoader.load(resource.src, loaded);
  }
};
