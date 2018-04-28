import * as THREE from "three";

import skate_rink from './skate-rink-512.png';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const TOTAL_SIZE = 512;

const GRID_SIZE = TOTAL_SIZE * .0625;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, .1, 10000);
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
  axis.position.z = 1;
  scene.add(axis);
}

function init() {
  renderer.setSize(WIDTH, HEIGHT);

  let cvs = document.getElementById('cvs');
  cvs.innerHTML = '';
  cvs.appendChild(renderer.domElement);

  // x-axis
  for(let x = -TOTAL_SIZE; x <= TOTAL_SIZE; x += GRID_SIZE) {
    axis('red', new THREE.Vector3(-TOTAL_SIZE,x,0), new THREE.Vector3(TOTAL_SIZE,x,0), x===0);
    // axis('red', new THREE.Vector3(-TOTAL_SIZE,0,0), new THREE.Vector3(TOTAL_SIZE,0,0));
  }
  // y-axis
  for(let y = -TOTAL_SIZE; y <= TOTAL_SIZE; y += GRID_SIZE) {
    axis('green', new THREE.Vector3(y,-TOTAL_SIZE,0), new THREE.Vector3(y,TOTAL_SIZE,0), y===0);
    // axis('green', new THREE.Vector3(0,-TOTAL_SIZE,0), new THREE.Vector3(0,TOTAL_SIZE,0));
  }

  // z-axis
  axis('blue', new THREE.Vector3(0,0,-TOTAL_SIZE), new THREE.Vector3(0,0,TOTAL_SIZE));

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

function count_angle(opt) {
  if(opt.c) {
    if(opt.a) {
      return Math.pow(Math.pow(opt.c, 2) - Math.pow(opt.a, 2), .5);
    } else {
      return Math.pow(Math.pow(opt.c, 2) - Math.pow(opt.b, 2), .5);
    }
  } else {
    return Math.pow(Math.pow(opt.a, 2) + Math.pow(opt.b, 2), .5);
  }
}

function create_slope() {
  let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE);
  let cube_material = new THREE.MeshBasicMaterial({
    color: '#09f'
  });
  let cube = new THREE.Mesh(cube_geometry, cube_material);
  cube.position.x = -GRID_SIZE * 6.5;
  cube.position.y = -GRID_SIZE * 5.5;
  cube.position.z = GRID_SIZE * .5;
  scene.add(cube);

  let v = [
    new THREE.Vector3(GRID_SIZE * -6, GRID_SIZE * -7, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * -6, GRID_SIZE * -7, 0),
    new THREE.Vector3(GRID_SIZE * -3, GRID_SIZE * -7, 0),
    new THREE.Vector3(GRID_SIZE * -6, GRID_SIZE * -4, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * -6, GRID_SIZE * -4, 0),
    new THREE.Vector3(GRID_SIZE * -3, GRID_SIZE * -4, 0)
  ];
  let f = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(3, 2, 5),
    new THREE.Face3(3, 5, 4)
  ];
  let s = new THREE.Geometry();
  s.vertices = v;
  s.faces = f;
  let s_m = new THREE.MeshLambertMaterial({
    color: '#09f'
  });
  let slope = new THREE.Mesh(s, s_m);
  scene.add(slope);
};
create_slope();

function create_surface(x, y, z) {
  let d = x * .5;
  x = -x;
  y /= 2;
  console.log(y);
  z /= Math.pow(x, 2);

  let v = [];
  let f = [];
  for(let i = 0, j = x; j <= 0; i++, j+=1) {
    let h = z * Math.pow(j, 2);
    v.push(new THREE.Vector3(-d, -y, h));
    v.push(new THREE.Vector3(j + d, -y, h));
    v.push(new THREE.Vector3(j + d, y, h));
    v.push(new THREE.Vector3(-d, y, h));
    if(i) {
      let k = 4 * i;
      f.push(new THREE.Face3(k - 4, k    , k + 1));
      f.push(new THREE.Face3(k - 3, k - 4, k + 1));

      f.push(new THREE.Face3(k - 3, k + 1, k + 2));
      f.push(new THREE.Face3(k - 2, k - 3, k + 2));

      f.push(new THREE.Face3(k - 2, k + 2, k + 3));
      f.push(new THREE.Face3(k - 1, k - 2, k + 3));
    }
  }
  // f.push(new THREE.Face3(v.length - 1, v.length - 3, v.length - 2));
  // f.push(new THREE.Face3(v.length - 4, v.length - 3, v.length - 1));

  let c_g = new THREE.Geometry();
  c_g.vertices = v;
  c_g.faces = f;
  let c_m = new THREE.MeshLambertMaterial({
    color: '#09f',
    // side:THREE.DoubleSide
  });
  let curve = new THREE.Mesh(c_g, c_m);
  return curve;
}

function create_hathpace() {
  let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE * 3);
  let cube_material = new THREE.MeshBasicMaterial({
    color: '#09f'
  });
  let cube = new THREE.Mesh(cube_geometry, cube_material);
  cube.position.set(-GRID_SIZE * 6.5, -GRID_SIZE * 1.5, GRID_SIZE * 1.5);
  scene.add(cube);

  let curve = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE * 3);
  curve.position.set(-GRID_SIZE * 5, -GRID_SIZE * 1.5, .05);
  scene.add(curve);
}
create_hathpace();




camera.position.set(-TOTAL_SIZE, -TOTAL_SIZE, TOTAL_SIZE);

function rotateView(radian) {
  camera.position.x = TOTAL_SIZE * Math.cos(radian);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotation.z = 0;
}

let view = false;
let radian = Math.PI * .5;
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
