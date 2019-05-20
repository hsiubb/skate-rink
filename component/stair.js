import * as THREE from "three";
import { scene } from './setting.js';
import shape_line from './shape_line.js';

// 楼梯
function create_stair(x, y, z, c, h) {
  let group = new THREE.Group();

  let v = [];
  let f = [];
  y /= 2;

  let len = Math.floor(z / h);
  let w = x / len;
  h = z / len;

  let lines_point = [];

  for(let i=0; i<len; i++) {
    v.push(new THREE.Vector3(i * w, -y, i * h));
    v.push(new THREE.Vector3(i * w, y, i * h));
    v.push(new THREE.Vector3(i * w, y, (i + 1) * h));
    v.push(new THREE.Vector3(i * w, -y, (i + 1) * h));

    // 台阶的前方与上方
    f.push(new THREE.Face3(i * 4, i * 4 + 2, i * 4 + 1));
    f.push(new THREE.Face3(i * 4, i * 4 + 3, i * 4 + 2));
    f.push(new THREE.Face3(i * 4 + 3, i * 4 + 5, i * 4 + 2));
    f.push(new THREE.Face3(i * 4 + 3, i * 4 + 4, i * 4 + 5));

    // 每个小台阶的侧面
    f.push(new THREE.Face3(i * 4, i * 4 + 4, i * 4 + 3));
    f.push(new THREE.Face3(i * 4 + 1, i * 4 + 2, i * 4 + 5));


    lines_point.push([
      [i * w, -y, i * h],
      [i * w, -y, (i + 1) * h],
      [(i + 1) * w, -y, (i + 1) * h]
    ]);

    lines_point.push([
      [i * w, y, i * h],
      [i * w, y, (i + 1) * h],
      [(i + 1) * w, y, (i + 1) * h]
    ]);
  }
  v.push(new THREE.Vector3(x, -y, z));
  v.push(new THREE.Vector3(x, y, z));
  v.push(new THREE.Vector3(x, -y, 0));
  v.push(new THREE.Vector3(x, y, 0));

  f.push(new THREE.Face3(0, v.length - 2, v.length - 4));
  f.push(new THREE.Face3(1, v.length - 3, v.length - 1));

  let c_g = new THREE.Geometry();
  c_g.vertices = v;
  c_g.faces = f;
  let c_m = new THREE.MeshLambertMaterial({
    color: c
  });
  let curve = new THREE.Mesh(c_g, c_m);
  curve.receiveShadow = true;

  curve.shape_line = function() {
    let p = curve.position,
        r = curve.rotation;

    lines_point.map(function(list) {
      let cur_line = [];
      console.log(list);
      list.map(function(points) {
        cur_line.push(
          new THREE.Vector3(points[0] + p.x, points[1] + p.y, points[2] + p.z)
        )

        shape_line(cur_line);
      });
    });
  };

  curve.castShadow = true;
  // curve.receiveShadow = true;

  scene.add(curve);

  return curve;
}

export default create_stair;
