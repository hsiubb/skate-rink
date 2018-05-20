import * as THREE from "three";

import skate_rink from './skate-rink-512.png';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const TOTAL_SIZE = 512;

const GRID_SIZE = TOTAL_SIZE * .0625;
const BASE_COLOR = ['#f60', '#6d6', '#09f', '#3cc'];

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, .1, 10000);
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
  axis.position.z = 0;
  scene.add(axis);
}

function init() {
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;

  let cvs = document.getElementById('cvs');
  cvs.innerHTML = '';
  cvs.appendChild(renderer.domElement);

  function reference_line() {
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
  }
  // reference_line();

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

// 基于点序列显示边线
function shape_line() {
  let geometry = new THREE.Geometry();
  // let m = new THREE.LineDashedMaterial({
  let m = new THREE.LineBasicMaterial({
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

// 斜坡
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
    color: BASE_COLOR[0]
  });
  let slope = new THREE.Mesh(s, s_m);
  slope.castShadow = true;

  scene.add(slope);
  return slope;
}

// 曲面
function create_surface(x, y, z, c) {
  let d = x * -.5;
  let dis = GRID_SIZE * 0.125;
  y /= 2;

  let c_1 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3( d, -y, z ),
    new THREE.Vector3( d, -y, 0 ),
    new THREE.Vector3( -d, -y, 0 )
  );
  let c_2 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3( d, y, z ),
    new THREE.Vector3( d, y, 0 ),
    new THREE.Vector3( -d, y, 0 )
  );

  let points_1 = c_1.getPoints( x / dis );
  let points_2 = c_2.getPoints( x / dis );

  let v = [];
  let f = [];

  for(let i = 0, j = -x; j <= 0; i++, j += dis) {
    v.push(new THREE.Vector3(d, -y, points_1[i].z));
    v.push(points_1[i]);
    v.push(points_2[i]);
    v.push(new THREE.Vector3(d, y, points_1[i].z));

    if(i) {
      let k = 4 * i;
      f.push(new THREE.Face3(k - 4, k    , k + 1));
      f.push(new THREE.Face3(k - 3, k - 4, k + 1));

      f.push(new THREE.Face3(k - 2, k - 3, k + 2));
      f.push(new THREE.Face3(k - 3, k + 1, k + 2));

      f.push(new THREE.Face3(k - 2, k + 2, k + 3));
      f.push(new THREE.Face3(k - 1, k - 2, k + 3));
    }
  }
  f.push(new THREE.Face3(v.length - 2, v.length - 3, v.length - 1));
  f.push(new THREE.Face3(v.length - 1, v.length - 3, v.length - 4));

  let c_g = new THREE.Geometry();
  c_g.vertices = v;
  c_g.faces = f;
  let c_m = new THREE.MeshLambertMaterial({
    color: c
  });
  let curve = new THREE.Mesh(c_g, c_m);

  curve.strokes = function(a, b) {
    let p = curve.position,
        r = curve.rotation,
        m = new THREE.LineDashedMaterial({
          color: '#fff'
        });
    let g_1, g_2, l_1, l_2;

    if(a) {
      g_1 = new THREE.BufferGeometry().setFromPoints( points_1 );
      l_1 = new THREE.Line( g_1, m );
      l_1.position.set(p.x, p.y, p.z);
      l_1.rotation.set(r.x, r.y, r.z);
      scene.add(l_1);
    }
    if(b) {
      g_2 = new THREE.BufferGeometry().setFromPoints( points_2 );
      l_2 = new THREE.Line( g_2, m );
      l_2.position.set(p.x, p.y, p.z);
      l_2.rotation.set(r.x, r.y, r.z);
      scene.add(l_2);
    }
  }

  curve.castShadow = true;
  scene.add(curve);

  return curve;
}

// 楼梯
function create_stair(x, y, z, c, h) {
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
  scene.add(curve);

  return curve;
}

// 斜坡
function create_slope() {
  let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE);
  let cube_material = new THREE.MeshBasicMaterial({
    color: BASE_COLOR[0]
  });
  let cube = new THREE.Mesh(cube_geometry, cube_material);
  cube.position.x = -GRID_SIZE * 6.5;
  cube.position.y = -GRID_SIZE * 5.5;
  cube.position.z = GRID_SIZE * .5;
  cube.castShadow = true;
  scene.add(cube);

  let short_slope = slope(GRID_SIZE * 3, GRID_SIZE * 3, GRID_SIZE, BASE_COLOR[0]);
  short_slope.position.set(GRID_SIZE * -3, GRID_SIZE * -5.5, 0);
  short_slope.rotation.z = Math.PI;

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
  ], [
    new THREE.Vector3(GRID_SIZE * -7, GRID_SIZE * -4, GRID_SIZE),
    new THREE.Vector3(GRID_SIZE * -7, GRID_SIZE * -4, 0)
  ]);
};
create_slope();

// 高台
function create_hathpace() {
  let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE * 3);
  let cube_material = new THREE.MeshBasicMaterial({
    color: BASE_COLOR[1]
  });
  let cube = new THREE.Mesh(cube_geometry, cube_material);
  cube.position.set(-GRID_SIZE * 6.5, -GRID_SIZE * 1.5, GRID_SIZE * 1.5);
  cube.castShadow = true;
  scene.add(cube);

  let curve = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE * 3, BASE_COLOR[1]);
  curve.position.set(-GRID_SIZE * 5, -GRID_SIZE * 1.5, 0);
  curve.strokes(true, true);

  shape_line([
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 3, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 7, 0, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 6, 0, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 6, -GRID_SIZE * 3, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 3, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 7, -GRID_SIZE * 3, 0)
  ], [
    new THREE.Vector3(-GRID_SIZE * 7, 0, GRID_SIZE * 3),
    new THREE.Vector3(-GRID_SIZE * 7, 0, 0)
  ]);
}
create_hathpace();

// 直角弧形 U 台
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
    c.castShadow = true;
    scene.add(c);
    return c;
  }

  // 直角弧台墙柱
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
  });

  let surface_1 = create_surface(GRID_SIZE * 2, GRID_SIZE * 2, GRID_SIZE * 2, BASE_COLOR[2]);
  surface_1.position.set(-GRID_SIZE * 5, GRID_SIZE * 2, 0);
  surface_1.strokes(true, false);

  let surface_2 = create_surface(GRID_SIZE * 2, GRID_SIZE * 2, GRID_SIZE * 2, BASE_COLOR[2]);
  surface_2.position.set(-GRID_SIZE * 2, GRID_SIZE * 5, 0);
  surface_2.rotation.z = -Math.PI * .5;
  surface_2.strokes(false, true);

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

    let material = new THREE.LineDashedMaterial({
      color: '#fff',
      dashSize: 3,
      gapSize: 2
    });

    // 显式地展示弧度
    function round_view(state) {
      let g_1 = new THREE.BufferGeometry().setFromPoints( points_1 );
      let l_1 = new THREE.Line( g_1, material );
      scene.add(l_1);

      let g_3 = new THREE.BufferGeometry().setFromPoints( points_3 );
      let l_3 = new THREE.Line( g_3, material );
      scene.add(l_3);

      return state;
    }
    let view_round = round_view(false);

    let points_list = [];

    for(let i=0; i<=len; i++) {
      let c = new THREE.QuadraticBezierCurve3(
        points_1[i],
        points_2[i],
        points_3[i]
      )
      let points = c.getPoints( len );

      points_list.push(points);
      if(view_round) {
        let g = new THREE.BufferGeometry().setFromPoints( points );
        let l = new THREE.Line( g, material );
        scene.add(l);
      }
    }
    let v = [];
    let f = [];
    points_list.map(function(line_points, i) {
      line_points.map(function(point, j) {
        v.push(point);
        if(j<len && (i > 0 || (i === 0 && j > 0))) {
          let cur = (i + 1) * len + j;

          f.push(new THREE.Face3(cur, cur - len - 1, cur - len));
          f.push(new THREE.Face3(cur, cur - len, cur + 1));
        }
      });
    });
    v.push(new THREE.Vector3(GRID_SIZE * -6, GRID_SIZE * 6, GRID_SIZE * 2));
    for(let i = 1; i<len; i++) {
      let cur = i * len;
      f.push(new THREE.Face3(cur - len, cur, v.length - 1));
    }

    let c_g = new THREE.Geometry();
    c_g.vertices = v;
    c_g.faces = f;
    let c_m = new THREE.MeshLambertMaterial({
      color: BASE_COLOR[2]
    });
    let curve = new THREE.Mesh(c_g, c_m);
    curve.castShadow = true;
    scene.add(curve);
  }
  surface();

  shape_line([
    new THREE.Vector3(-GRID_SIZE * 7, GRID_SIZE, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE * 6, GRID_SIZE, GRID_SIZE * 2),
    new THREE.Vector3(-GRID_SIZE * 6, GRID_SIZE * 3, GRID_SIZE * 2)
  ], [// new THREE.Vector3(-GRID_SIZE * 6, GRID_SIZE * 6, GRID_SIZE * 2),
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
  ]);
};
create_round_curve();

// 长 U 台
function create_half_pipe() {
  let cube_geometry = new THREE.CubeGeometry(GRID_SIZE * 3, GRID_SIZE * 1, GRID_SIZE * 1);
  let cube_material = new THREE.MeshBasicMaterial({
    color: BASE_COLOR[3]
  });
  let cube = new THREE.Mesh(cube_geometry, cube_material);
  function unit_cube(cube_pos) {
    let x = cube_pos[0];
    let y = cube_pos[1];
    let c = cube.clone();
    c.position.set(GRID_SIZE * x, GRID_SIZE * y, GRID_SIZE * .5);
    c.castShadow = true;
    scene.add(c);
    return c;
  }

  [
    [5.5, 6.5],
    [5.5, -.5],
    [5.5, -1.5],
    [5.5, -2.5],
    [5.5, -3.5],
    [5.5, -4.5],
    [5.5, -5.5],
    [5.5, -6.5]
  ].map(function(pos) {
    unit_cube(pos);
  });

  let flat_g = new THREE.PlaneGeometry(GRID_SIZE * 3, GRID_SIZE * 5, 1);
  let flat_m = new THREE.MeshBasicMaterial({
    color: BASE_COLOR[3]
  });
  let flat = new THREE.Mesh(flat_g, flat_m);
  flat.position.set(GRID_SIZE * 5.5, GRID_SIZE * 3, .5);
  flat.castShadow = true;
  scene.add(flat);

  let surface_1 = create_surface(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE, BASE_COLOR[3]);
  surface_1.position.set(GRID_SIZE * 5.5, GRID_SIZE * 5.5, 0);
  surface_1.rotation.z = -Math.PI * .5;
  surface_1.strokes(true, true);

  let surface_2 = create_surface(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE, BASE_COLOR[3]);
  surface_2.position.set(GRID_SIZE * 5.5, GRID_SIZE * .5, 0);
  surface_2.rotation.z = Math.PI * .5;
  surface_2.strokes(true, true);

  let surface_3 = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE, BASE_COLOR[3]);
  surface_3.position.set(GRID_SIZE * 3, GRID_SIZE * -1.5, 0);
  surface_3.rotation.z = Math.PI;
  surface_3.strokes(true, true);

  let surface_4 = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE, BASE_COLOR[3]);
  surface_4.position.set(GRID_SIZE * 3, GRID_SIZE * -5.5, 0);
  surface_4.rotation.z = Math.PI;
  surface_4.strokes(true, true);

  let stair = create_stair(GRID_SIZE * 2, GRID_SIZE, GRID_SIZE, BASE_COLOR[3], GRID_SIZE * .2);
  stair.position.set(GRID_SIZE * 2, GRID_SIZE * -3.5, 0);
  stair.shape_line();

  shape_line([
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
  ]);
}
create_half_pipe();

// 中间的方形台
function create_square_slope() {
}
create_square_slope();

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
