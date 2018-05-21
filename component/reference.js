import * as THREE from "three";

import { GRID_SIZE, scene } from './setting.js';

function axis(color, vec1, vec2) {
  let g = new THREE.Geometry();
  let m = new THREE.LineDashedMaterial({
  	color: color,
    dashSize: 3,
    gapSize: 2
  });
  g.vertices.push(vec1);
  g.vertices.push(vec2);
  let axis = new THREE.Line(g,m);
  axis.computeLineDistances();
  axis.position.z = 0;
  scene.add(axis);
}

// ²Î¿¼Ïß
export default function reference_line(size) {
  // x-axis
  for(let x = -size; x <= size; x += GRID_SIZE) {
    axis('red', new THREE.Vector3(-size,x,0), new THREE.Vector3(size,x,0));
  }

  // y-axis
  for(let y = -size; y <= size; y += GRID_SIZE) {
    axis('green', new THREE.Vector3(y,-size,0), new THREE.Vector3(y,size,0));
  }

  // z-axis
  axis('blue', new THREE.Vector3(0,0,-size), new THREE.Vector3(0,0,size));
}
