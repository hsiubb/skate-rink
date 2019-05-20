import * as THREE from "three";
import { scene } from './setting.js';

// 斜坡
function bridge(a, b, w, h, c) {
  a *= .5;
  let v = [
    new THREE.Vector3(-a, 0, h),
    new THREE.Vector3(-a-b, 0, 0),
    new THREE.Vector3(a+b, 0, 0),
    new THREE.Vector3(a, 0, h),
    new THREE.Vector3(-a, w, h),
    new THREE.Vector3(-a-b, w, 0),
    new THREE.Vector3(a+b, w, 0),
    new THREE.Vector3(a, w, h),
  ];
  let f = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(4, 7, 6),
    new THREE.Face3(4, 6, 5),

    new THREE.Face3(0, 5, 1),
    new THREE.Face3(0, 4, 5),
    new THREE.Face3(0, 3, 7),
    new THREE.Face3(0, 7, 4),
    new THREE.Face3(2, 6, 7),
    new THREE.Face3(2, 7, 3)
  ];

  let s = new THREE.Geometry();
  s.vertices = v;
  s.faces = f;
  let s_m = new THREE.MeshLambertMaterial({
    color: c
  });
  let bridge = new THREE.Mesh(s, s_m);
  bridge.castShadow = true;

  scene.add(bridge);
  return bridge;
}

export default bridge;
