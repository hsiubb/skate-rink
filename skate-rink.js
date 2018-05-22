import { TOTAL_SIZE, GRID_SIZE, BASE_COLOR, scene } from './component/setting.js';
import * as THREE from "three";

import shape_line from './component/shape_line.js';
import create_stair from './component/stair.js';
import create_surface from './component/surface.js';
import reference_line from './component/reference.js';

import create_slope from './component/create_slope.js';
import create_hathpace from './component/create_hathpace.js';
import create_round_curve from './component/create_round_curve.js';
import create_half_pipe from './component/create_half_pipe.js';

import skate_rink from './skate-rink-512.png';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, .1, 10000);
const renderer = new THREE.WebGLRenderer();

function init() {
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;

  let cvs = document.getElementById('cvs');
  cvs.innerHTML = '';
  cvs.appendChild(renderer.domElement);

  // reference_line(TOTAL_SIZE);

  let a_light = new THREE.AmbientLight( '#fff', 1 );
  scene.add(a_light);

  let d_light = new THREE.DirectionalLight("#385", 1);
  d_light.position.set(GRID_SIZE, GRID_SIZE * .5, GRID_SIZE);

  d_light.shadow.camera.near = -TOTAL_SIZE; //产生阴影的最近距离
  d_light.shadow.camera.far = TOTAL_SIZE; //产生阴影的最远距离
  d_light.shadow.camera.left = -TOTAL_SIZE; //产生阴影距离位置的最左边位置
  d_light.shadow.camera.right = TOTAL_SIZE; //最右边
  d_light.shadow.camera.top = TOTAL_SIZE; //最上边
  d_light.shadow.camera.bottom = -TOTAL_SIZE; //最下面

  d_light.castShadow = true;
  scene.add(d_light);
};
init();

function set_floor() {
  let flr_geometry = new THREE.PlaneGeometry(TOTAL_SIZE, TOTAL_SIZE);
  let flr_texture = new THREE.TextureLoader().load(skate_rink);
  let flr_material = new THREE.MeshLambertMaterial({
    map: flr_texture,
    transparent: true,
    opacity: .6
  });
  let floor = new THREE.Mesh(flr_geometry, flr_material);
  floor.position.z = -.5;
  floor.receiveShadow = true;
  scene.add(floor);

  let flb_geometry = new THREE.PlaneGeometry(TOTAL_SIZE, TOTAL_SIZE);
  let flb_material = new THREE.MeshLambertMaterial({
    color: '#fff',
    side: THREE.BackSide
  });
  let floor_back = new THREE.Mesh(flb_geometry, flb_material);
  scene.add(floor_back);
};
set_floor();

// 斜坡
let rink_slope = create_slope(BASE_COLOR[0]);
rink_slope.position.set(GRID_SIZE * -3, GRID_SIZE * -5.5, 0);

// 高台
let rink_hithpace = create_hathpace(BASE_COLOR[1]);
rink_hithpace.position.set(-GRID_SIZE * 5, -GRID_SIZE * 1.5, 0);

// 直角弧形 U 台
let rine_round_curve = create_round_curve(BASE_COLOR[2]);
rine_round_curve.position.set(-GRID_SIZE * 4, GRID_SIZE * 4, 0);

// 长 U 台
let rink_half_pipe = create_half_pipe(BASE_COLOR[3]);

// create_half_pipe();

// 中间的方形台
function create_square_slope() {
}
create_square_slope();


// 斜坡边框线
shape_line(
  [
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 4, GRID_SIZE),
    new THREE.Vector3(-GRID_SIZE * 6, -GRID_SIZE * 4, GRID_SIZE),
    new THREE.Vector3(-GRID_SIZE * 6, -GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 7, 0),
  ], [
    new THREE.Vector3(-GRID_SIZE * 6, -GRID_SIZE * 4, GRID_SIZE),
    new THREE.Vector3(-GRID_SIZE * 3, -GRID_SIZE * 4, 0)
  ], [
    new THREE.Vector3(-GRID_SIZE * 6, -GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(-GRID_SIZE * 3, -GRID_SIZE * 7, 0)
  ], [
    new THREE.Vector3(-GRID_SIZE * 6, -GRID_SIZE * 4, GRID_SIZE),
    new THREE.Vector3(-GRID_SIZE * 3, -GRID_SIZE * 4, 0)
  ], [
    new THREE.Vector3(GRID_SIZE * -7, GRID_SIZE * -4, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * -7, GRID_SIZE * -4, 0)
  ]
);

// 高台边框线
shape_line(
  [
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 3, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 7, 0, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 6, 0, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 6, -GRID_SIZE * 3, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 3, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 3, 0)
  ], [
    new THREE.Vector3(-GRID_SIZE * 7, 0, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 7, 0, 0)
  ]
);

// 直角弧形台边框线
shape_line(
  [
    new THREE.Vector3(-GRID_SIZE * 7, GRID_SIZE, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE * 6, GRID_SIZE, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE * 6, GRID_SIZE * 3, GRID_SIZE * 2)
  ], [
    new THREE.Vector3(-GRID_SIZE * 3, GRID_SIZE * 6, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE, GRID_SIZE * 6, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE, GRID_SIZE * 7, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE * 7, GRID_SIZE * 7, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE * 7, GRID_SIZE, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE * 7, GRID_SIZE, 0)
  ], [
    new THREE.Vector3(-GRID_SIZE * 7, GRID_SIZE * 7, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE * 7, GRID_SIZE * 7, 0)
  ], [
    new THREE.Vector3(-GRID_SIZE, GRID_SIZE * 7, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE, GRID_SIZE * 7, 0)
  ], [
    new THREE.Vector3(-GRID_SIZE * 4, GRID_SIZE, 0),
    new THREE.Vector3(-GRID_SIZE * 4, GRID_SIZE * 3, 0),
  ], [
    new THREE.Vector3(-GRID_SIZE * 3, GRID_SIZE * 4, 0),
    new THREE.Vector3(-GRID_SIZE, GRID_SIZE * 4, 0)
  ]
);

// 长 U 台边框线
shape_line(
  [
    new THREE.Vector3(GRID_SIZE * 7, 0, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 7, -GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 4, -GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 4, 0, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 7, 0, GRID_SIZE)
  ], [
    new THREE.Vector3(GRID_SIZE * 4, GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 7, GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 7, GRID_SIZE * 6, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 4, GRID_SIZE * 6, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 4, GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 4, GRID_SIZE * 7, 0)
  ], [
    new THREE.Vector3(GRID_SIZE * 7, GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 7, GRID_SIZE * 7, 0)
  ], [
    new THREE.Vector3(GRID_SIZE * 7, -GRID_SIZE * 7, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * 7, -GRID_SIZE * 7, 0)
  ], [
    new THREE.Vector3(GRID_SIZE * 4, GRID_SIZE, 0),
    new THREE.Vector3(GRID_SIZE * 4, GRID_SIZE * 5, 0),
  ], [
    new THREE.Vector3(GRID_SIZE * 7, GRID_SIZE, 0),
    new THREE.Vector3(GRID_SIZE * 7, GRID_SIZE * 5, 0)
  ]
);


camera.position.set(-TOTAL_SIZE, -TOTAL_SIZE, TOTAL_SIZE);

function rotateView(radian) {
  camera.position.x = TOTAL_SIZE * Math.cos(radian);
  camera.position.y = - TOTAL_SIZE * Math.sin(radian);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotation.z = 0;
}

let view = true;
let radian = Math.PI * .5;
rotateView(radian);
function render() {
  if(view) {
    radian = (radian + (Math.PI / 360)) % (Math.PI * 2);

    rotateView(radian);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
