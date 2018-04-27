import * as THREE from "three";

import skate_rink from './skate-rink-512.png';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const TOTAL_SIZE = 80;


let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, .1, 1000);
let renderer = new THREE.WebGLRenderer();

function axis(color, vec1, vec2) {
  let g = new THREE.Geometry();
  // let m = new THREE.LineBasicMaterial({
  let m = new THREE.LineDashedMaterial({
  	color: color,
    dashSize: 3,
    gapSize: 2
  });
  g.vertices.push(vec1);
  g.vertices.push(vec2);
  let axis = new THREE.Line(g,m);
  axis.computeLineDistances();
  axis.position.z -= .05;
  scene.add(axis);
}

function init() {
  // x-axis
  axis('red', new THREE.Vector3(-100,0,0), new THREE.Vector3(100,0,0));

  // y-axis
  axis('green', new THREE.Vector3(0,-100,0), new THREE.Vector3(0,100,0));

  // z-axis
  axis('blue', new THREE.Vector3(0,0,-100), new THREE.Vector3(0,0,100));

  renderer.setSize(WIDTH, HEIGHT);

  let cvs = document.getElementById('cvs');
  cvs.innerHTML = '';
  cvs.appendChild(renderer.domElement);
};
init();

function set_light() {
  let light = new THREE.AmbientLight( '#fff', 1 );
  scene.add(light);
};
set_light();

function set_floor() {
  let flr_geometry = new THREE.PlaneGeometry(TOTAL_SIZE, TOTAL_SIZE);
  let flr_texture = new THREE.TextureLoader().load(skate_rink);
  let flr_material = new THREE.MeshLambertMaterial({
    map: flr_texture,
  });
  let floor = new THREE.Mesh(flr_geometry, flr_material);
  // floor.rotation.x = Math.PI;
  // floor.rotation.y = Math.PI;
  scene.add(floor);

  let flb_geometry = new THREE.PlaneGeometry(TOTAL_SIZE, TOTAL_SIZE);
  let flb_texture = new THREE.TextureLoader().load(skate_rink);
  let flb_material = new THREE.MeshLambertMaterial({
    map: flb_texture,
    side: THREE.BackSide
  });
  let floor_back = new THREE.Mesh(flb_geometry, flb_material);
  // floor_back.rotation.x = Math.PI;
  // floor_back.rotation.y = Math.PI;
  scene.add(floor_back);
};
set_floor();

function set_camera() {
  camera.position.set(-TOTAL_SIZE, -TOTAL_SIZE, TOTAL_SIZE);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  // camera.rotation.x = 0;
  // camera.rotation.y = 0;
  camera.rotation.z = 0;
  // camera.rotation.z = Math.PI;
};
set_camera();

let radian = 0;
function render() {
  radian = (radian + (Math.PI / 270)) % (Math.PI * 2);

  camera.position.x = TOTAL_SIZE * Math.cos(radian);
  // camera.position.y = TOTAL_SIZE * Math.sin(radian);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotation.z = 0;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
