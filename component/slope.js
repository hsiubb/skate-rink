import * as THREE from "three";

// import { WIDTH, HEIGHT, TOTAL_SIZE, GRID_SIZE, BASE_COLOR } from 'setting';
import { scene } from './setting.js';

console.log(scene);

// Ð±ÆÂ
function slope(x, y, z, c) {
  y /= 2;
  let v = [
    new THREE.Vector3(0, -y, 0),
    new THREE.Vector3(x, -y, 0),
    new THREE.Vector3(x, -y, z),
    new THREE.Vector3(x, y, z),
    new THREE.Vector3(x, y, 0),
    new THREE.Vector3(0, y, 0),
  ];
  let f = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(0, 3, 5),
    new THREE.Face3(3, 4, 5)
  ];

  let s = new THREE.Geometry();
  s.vertices = v;
  s.faces = f;
  let s_m = new THREE.MeshLambertMaterial({
    color: c
  });
  let slope = new THREE.Mesh(s, s_m);
  slope.castShadow = true;

  scene.add(slope);
  return slope;
}

export default slope;
