import * as THREE from "three";

import skate_rink from './skate-rink-512.png';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const TOTAL_SIZE = 512;

const GRID_SIZE = TOTAL_SIZE * .0625;
const BASE_COLOR = ['#f60', '#3cc', '#09f'];

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, .1, 10000);
let renderer = new THREE.WebGLRenderer();

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
    axis('red', new THREE.Vector3(-TOTAL_SIZE,x,0), new THREE.Vector3(TOTAL_SIZE,x,0));
  }

  // y-axis
  for(let y = -TOTAL_SIZE; y <= TOTAL_SIZE; y += GRID_SIZE) {
    axis('green', new THREE.Vector3(y,-TOTAL_SIZE,0), new THREE.Vector3(y,TOTAL_SIZE,0));
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

function shape_line() {
  let geometry = new THREE.Geometry();
  let m = new THREE.LineDashedMaterial({
  	color: '#fff'
  });
  [].slice.call(arguments).map(function(list) {
    let g = geometry.clone();
    for(let i=0; i<list.length; i++) {
      g.vertices.push(list[i]);
    }
    let line = new THREE.Line(g, m);
    line.computeLineDistances();
    scene.add(line);
  });
}

function create_slope() {
  let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE);
  let cube_material = new THREE.MeshBasicMaterial({
    color: BASE_COLOR[0]
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
    color: BASE_COLOR[0]
  });
  let slope = new THREE.Mesh(s, s_m);
  scene.add(slope);

  shape_line([
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
  ]);
};
create_slope();

function create_surface(x, y, z, c) {
  let d = x * -.5;
  let dis = GRID_SIZE * 0.125;
  y /= 2;
  z /= Math.pow(x, 2);

  let c_1 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3( d, -y, z ),
    new THREE.Vector3( d * .5, -y, z ),
    new THREE.Vector3( -d, -y, 0 )
  );
  let c_2 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3( d, y, z ),
    new THREE.Vector3( d * .5, y, z ),
    new THREE.Vector3( -d, y, 0 )
  );

  let points_1 = c_1.getPoints( x / dis );
  let points_2 = c_2.getPoints( x / dis );

  let v = [];
  let f = [];

  for(let i = 0, j = -x; j <= 0; i++, j += dis) {
    let h = z * Math.pow(j, 2);
    v.push(new THREE.Vector3(d, -y, h));
    v.push((points_1[i].z *= Math.pow(j, 2), points_1[i]));
    v.push((points_2[i].z *= Math.pow(j, 2), points_2[i]));
    v.push(new THREE.Vector3(d, y, h));
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
  f.push(new THREE.Face3(v.length - 1, v.length - 3, v.length - 2));
  f.push(new THREE.Face3(v.length - 4, v.length - 3, v.length - 1));

  let c_g = new THREE.Geometry();
  c_g.vertices = v;
  c_g.faces = f;
  let c_m = new THREE.MeshLambertMaterial({
    color: c
  });
  let curve = new THREE.Mesh(c_g, c_m);
  scene.add(curve);
  return curve;
}

function create_hathpace() {
  let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE * 3);
  let cube_material = new THREE.MeshBasicMaterial({
    color: BASE_COLOR[1]
  });
  let cube = new THREE.Mesh(cube_geometry, cube_material);
  cube.position.set(-GRID_SIZE * 6.5, -GRID_SIZE * 1.5, GRID_SIZE * 1.5);
  scene.add(cube);

  let curve = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE * 3, BASE_COLOR[1]);
  curve.position.set(-GRID_SIZE * 5, -GRID_SIZE * 1.5, .1);

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
    ], [
      new THREE.Vector3(-GRID_SIZE * 6, -GRID_SIZE * 3, GRID_SIZE * 3),
      new THREE.Vector3(-GRID_SIZE * 4, -GRID_SIZE * 3, 0)
    ], [
      new THREE.Vector3(-GRID_SIZE * 6, 0, GRID_SIZE * 3),
      new THREE.Vector3(-GRID_SIZE * 4, 0, 0)
    ]
  );

}
create_hathpace();

function create_round_curve() {
  let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE, GRID_SIZE * 2);
  let cube_material = new THREE.MeshBasicMaterial({
    color: BASE_COLOR[2]
  });
  let cube = new THREE.Mesh(cube_geometry, cube_material);

  function unit_cube(cube_pos) {
    let x = cube_pos[0];
    let y = cube_pos[1];
    let c = cube.clone();
    c.position.set(GRID_SIZE * x, GRID_SIZE * y, GRID_SIZE);
    scene.add(c);
    return c;
  }

  [
    [-6.5, 1.5],
    [-6.5, 2.5],
    [-6.5, 3.5],
    [-6.5, 4.5],
    [-6.5, 5.5],
    [-6.5, 6.5],
    [-5.5, 6.5],
    [-4.5, 6.5],
    [-3.5, 6.5],
    [-2.5, 6.5],
    [-1.5, 6.5]
  ].map(function(pos) {
    unit_cube(pos);
  })

  let surface_1 = create_surface(GRID_SIZE * 2, GRID_SIZE * 2, GRID_SIZE * 2, BASE_COLOR[2]);
  surface_1.position.set(-GRID_SIZE * 5, GRID_SIZE * 2, .1);

  let surface_2 = create_surface(GRID_SIZE * 2, GRID_SIZE * 2, GRID_SIZE * 2, BASE_COLOR[2]);
  surface_2.position.set(-GRID_SIZE * 2, GRID_SIZE * 5, .1);
  surface_2.rotation.z = -Math.PI * .5;

  let surface = function() {
    let c_1 = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3( -GRID_SIZE * 6, GRID_SIZE * 3, GRID_SIZE * 2 ),
      new THREE.Vector3( -GRID_SIZE * 6, GRID_SIZE * 6, GRID_SIZE * 2 ),
      new THREE.Vector3( -GRID_SIZE * 3, GRID_SIZE * 6, GRID_SIZE * 2 )
    );
    let c_2 = new THREE.QuadraticBezierCurve3(
    	new THREE.Vector3( -GRID_SIZE * 6, GRID_SIZE * 3, 0 ),
    	new THREE.Vector3( -GRID_SIZE * 6, GRID_SIZE * 6, 0 ),
    	new THREE.Vector3( -GRID_SIZE * 3, GRID_SIZE * 6, 0 )
    );
    let c_3 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3( -GRID_SIZE * 4, GRID_SIZE * 3, 0 ),
    new THREE.Vector3( -GRID_SIZE * 4, GRID_SIZE * 4, 0 ),
    new THREE.Vector3( -GRID_SIZE * 3, GRID_SIZE * 4, 0 )
    );

    let len = 16;

    let points_1 = c_1.getPoints( len );
    let points_2 = c_2.getPoints( len );
    let points_3 = c_3.getPoints( len );

    let material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    let points_list = [];
    for(let i=0; i<=len; i++) {
      let c = new THREE.QuadraticBezierCurve3(
        points_1[i],
        points_2[i],
        points_3[i]
      )
      let points = c.getPoints( len - 1 );

      points_list.push(points);

      let g = new THREE.BufferGeometry().setFromPoints( points );
      let l;
      if(!i) {
        l = new THREE.Line( g, new THREE.LineBasicMaterial( { color : 'green' } ) );
      } else {
        l = new THREE.Line( g, material );
      }
      scene.add(l);
    }
    // for(let i = 0; i<points_list.length; i++) {
    //   for(let j = 0; j<points_list.length; j++) {
    //   }
    // }
    let v = [];
    let f = [];
    points_list.map(function(line_points, i) {
      line_points.map(function(point, j) {
        v.push(point);
        if(i>0){
          let cur = i * len + j;
          f.push(new THREE.Face3(cur, cur - len, cur - len + 1));
          f.push(new THREE.Face3(cur, cur - len + 1, cur + 1));
        }
      });
    });
    let c_g = new THREE.Geometry();
    c_g.vertices = v;
    c_g.faces = f;
    let c_m = new THREE.MeshLambertMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide
    });
    let curve = new THREE.Mesh(c_g, c_m);
    scene.add(curve);


    // let g_1 = new THREE.BufferGeometry().setFromPoints( points_1 );
    // let g_2 = new THREE.BufferGeometry().setFromPoints( points_2 );
    // let g_3 = new THREE.BufferGeometry().setFromPoints( points_3 );
    //
    //
    // // Create the final object to add to the scene
    // let curve_1 = new THREE.Line( g_1, material );
    // let curve_2 = new THREE.Line( g_2, material );
    // let curve_3 = new THREE.Line( g_3, material );
    // scene.add(curve_1);
    // scene.add(curve_2);
    // scene.add(curve_3);
  }
  surface();

  shape_line(
    [
      new THREE.Vector3(-GRID_SIZE * 7, GRID_SIZE, GRID_SIZE * 2),
      new THREE.Vector3(-GRID_SIZE * 6, GRID_SIZE, GRID_SIZE * 2),
      new THREE.Vector3(-GRID_SIZE * 6, GRID_SIZE * 6, GRID_SIZE * 2),
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
      new THREE.Vector3(-GRID_SIZE * 6, GRID_SIZE, GRID_SIZE * 2),
      new THREE.Vector3(-GRID_SIZE * 4, GRID_SIZE, 0)
    ], [
      new THREE.Vector3(-GRID_SIZE, GRID_SIZE * 6, GRID_SIZE * 2),
      new THREE.Vector3(-GRID_SIZE, GRID_SIZE * 4, 0)
    ], [
      new THREE.Vector3(-GRID_SIZE * 4, GRID_SIZE, 0),
      new THREE.Vector3(-GRID_SIZE, GRID_SIZE * 4, 0)
    ]
  );
};
create_round_curve();



camera.position.set(-TOTAL_SIZE, -TOTAL_SIZE, TOTAL_SIZE);

function rotateView(radian) {
  // camera.position.x = TOTAL_SIZE * Math.cos(radian);
  // camera.position.x += 1;
  // camera.position.y += 1;
  // camera.position.y = - TOTAL_SIZE * Math.sin(radian);

  camera.lookAt(new THREE.Vector3(-GRID_SIZE*4, GRID_SIZE*4, 0));
  camera.rotation.z = 0;
}

let view = false;
let radian = 0;
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
