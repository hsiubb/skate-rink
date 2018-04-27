import * as THREE from "three";

import skate_rink from './skate-rink-512.png';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const TOTAL_SIZE = 80;


let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, .1, 1000);
let renderer = new THREE.WebGLRenderer();

function axis(color, vec1, vec2, bool) {
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
  // axis.position.z = bool ? 0 : -.05;
  axis.position.z = 0;
  scene.add(axis);
}

function init() {
  renderer.setSize(WIDTH, HEIGHT);

  let cvs = document.getElementById('cvs');
  cvs.innerHTML = '';
  cvs.appendChild(renderer.domElement);

  // x-axis
  for(let x = -50; x <= 50; x += 5) {
    axis('red', new THREE.Vector3(-100,x,0), new THREE.Vector3(100,x,0), x===0);
    // axis('red', new THREE.Vector3(-100,0,0), new THREE.Vector3(100,0,0));
  }
  // y-axis
  for(let y = -50; y <= 50; y += 5) {
    axis('green', new THREE.Vector3(y,-100,0), new THREE.Vector3(y,100,0), y===0);
    // axis('green', new THREE.Vector3(0,-100,0), new THREE.Vector3(0,100,0));
  }

  // z-axis
  axis('blue', new THREE.Vector3(0,0,-100), new THREE.Vector3(0,0,100));

  let light = new THREE.AmbientLight( '#fff', 1 );
  scene.add(light);
};
init();

function set_floor() {
  let flr_geometry = new THREE.PlaneGeometry(TOTAL_SIZE, TOTAL_SIZE);
  let flr_texture = new THREE.TextureLoader().load(skate_rink);
  let flr_material = new THREE.MeshLambertMaterial({
    map: flr_texture,
  });
  let floor = new THREE.Mesh(flr_geometry, flr_material);
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

function create_shape_1() {
  let g = new THREE.CubeGeometry(5, 15, 5);
  let c_m = new THREE.MeshBasicMaterial({
    color: '#f90'
  });
  let c = new THREE.Mesh(g, c_m);
  c.position.x = -32.5;
  c.position.y = -27.5;
  c.position.z = 2.5;
  scene.add(c);

  // let s = new THREE.PlaneGeometry(20, TOTAL_SIZE);
  // let flb_material = new THREE.MeshLambertMaterial({
  //   color: '#fff',
  //   side: THREE.BackSide
  // });
  // let floor_back = new THREE.Mesh(flb_geometry, flb_material);
  // scene.add(floor_back);
  // polyhedron = createMesh(new THREE.PolyhedronGeometry(vertices,faces,controls.radius),controls.detail));
};
create_shape_1();





camera.position.set(-TOTAL_SIZE, -TOTAL_SIZE, TOTAL_SIZE * 2);

function rotateView(radian) {
  camera.position.x = TOTAL_SIZE * Math.cos(radian);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotation.z = 0;
}

let view = false;
let radian = Math.PI;
rotateView(radian);
function render() {
  if(view) {
    radian = (radian + (Math.PI / 270)) % (Math.PI * 2);

    rotateView(radian);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
