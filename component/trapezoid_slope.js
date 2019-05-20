import * as THREE from "three";
import { scene } from './setting.js';

// 斜坡
function trapezoid_slope(a, b, w, h, c) {
  a *= .5;
  let v = [
    new THREE.Vector3(-a, 0, 0),
    new THREE.Vector3(-a, 0, h),
    new THREE.Vector3(-b-a, w, 0),
    new THREE.Vector3(b+a, w, 0),
    new THREE.Vector3(a, 0, h),
    new THREE.Vector3(a, 0, 0)
  ];
  let f = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(1, 3, 2),
    new THREE.Face3(1, 4, 3),
    new THREE.Face3(3, 4, 5)
  ];

  let s = new THREE.Geometry();
  s.vertices = v;
  s.faces = f;
  let s_m = new THREE.MeshLambertMaterial({
    color: c
  });
  let trapezoid = new THREE.Mesh(s, s_m);
  trapezoid.castShadow = true;

  scene.add(trapezoid);
  return trapezoid;
}

export default trapezoid_slope;
