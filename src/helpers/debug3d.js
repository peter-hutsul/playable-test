import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

if (__DEV__) {
  var debug3d = (window.debug3d = {});

  debug3d.drawPath = function (path, points_count, line_color) {
    line_color = line_color || 0x0000ff;
    points_count = points_count || 280;

    var point = null;
    var vertices = path.getSpacedPoints(points_count);

    for (var i = 0; i < vertices.length; i++) {
      point = vertices[i];
      vertices[i] = new THREE.Vector3(point.x, point.y, point.z);
    }
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = vertices;
    var lineMaterial = new THREE.LineBasicMaterial({
      color: line_color
    });
    var line = new THREE.Line(lineGeometry, lineMaterial);
    line.points_count = points_count;

    app.scene.add(line);

    path.drawnedLine = line;

    return line;
  };

  debug3d.updatePath = function (path, points_count) {
    let line = path.drawnedLine;

    if (!line) {
      return debug3d.drawPath(path, points_count);
    }

    var point = null;
    var vertices = path.getSpacedPoints(points_count || line.points_count || 280);

    for (var i = 0; i < vertices.length; i++) {
      point = vertices[i];
      vertices[i] = new THREE.Vector3(point.x, point.y, point.z);
    }
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = vertices;

    line.geometry = lineGeometry;

    return line;
  };

  debug3d.exportPath = function (path, isXZ) {
    function round(n) {
      return Math.round(n * 1000) / 1000;
    }

    var result = [];

    for (var i = 0; i < path.points.length; i++) {
      if (isXZ) {
        result.push([round(path.points[i].x), round(path.points[i].z)]);
      } else {
        result.push([round(path.points[i].x), round(path.points[i].y), round(path.points[i].z)]);
      }
    }
    return JSON.stringify(result);
  };

  debug3d.control = function (obj, param1) {
    if (obj.isCatmullRomCurve3) {
      return debug3d.controlPath(obj, param1);
    } else {
      return debug3d._control(obj);
    }
  };

  debug3d._control = function (obj) {
    let _control = new TransformControls(app.camera, app.inputView);
    //_control.addEventListener( 'change', render );

    _control.addEventListener("dragging-changed", function (event) {
      if (window.controls) window.controls.enabled = !event.value;
    });

    // console.log(_control);

    // _control.traverse((o) => {
    //     if (o.geometry)
    //     {
    //         o.geometry.index = null;
    //     }
    // })

    setTimeout(() => {
      _control.attach(obj);
    }, 500);

    _control.setSize(0.6);

    app.scene.add(_control);

    window.addEventListener("keydown", function (event) {
      switch (event.keyCode) {
        case 81: // Q
          _control.setSpace(_control.space === "local" ? "world" : "local");
          break;

        case 71: // G
          _control.setMode("translate");
          break;

        case 82: // R
          _control.setMode("rotate");
          break;

        case 83: // S
          _control.setMode("scale");
          break;

        case 187:
        case 107: // +, =, num+
          _control.setSize(_control.size + 0.05);
          break;

        case 189:
        case 109: // -, _, num-
          _control.setSize(Math.max(_control.size - 0.05, 0.04));
          break;

        case 88: // X
          _control.showX = !_control.showX;
          break;

        case 89: // Y
          _control.showY = !_control.showY;
          break;

        case 90: // Z
          _control.showZ = !_control.showZ;
          break;

        case 32: // Spacebar
          _control.enabled = !_control.enabled;
          break;
      }
    });

    window.addEventListener("keyup", function (event) {
      switch (event.keyCode) {
        case 16: // Shift
          _control.setTranslationSnap(null);
          _control.setRotationSnap(null);
          break;
      }
    });

    return _control;
  };

  debug3d.controlPath = function (path, pointIndex) {
    let points = path.points;

    if (pointIndex !== undefined) {
      points = [path.points[pointIndex]];
    }

    let _controls = [];

    points.forEach((point) => {
      let obj = new THREE.Object3D();

      obj.position.copy(point);

      app.scene.add(obj);

      let control = debug3d._control(obj);

      _controls.push(control);

      control.setSize(0.2);

      control.addEventListener("objectChange", function () {
        point.copy(obj.position);

        path.needsUpdate = true;

        if (path.drawnedLine) {
          debug3d.updatePath(path);
        }
      });
    });

    return _controls;
  };
}
