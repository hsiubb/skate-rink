import * as THREE from "three";
import { GRID_SIZE, scene } from './setting.js';

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

  let group = new THREE.Group();

  group.strokes = function(a, b) {
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
      group.add(l_1);
    }
    if(b) {
      g_2 = new THREE.BufferGeometry().setFromPoints( points_2 );
      l_2 = new THREE.Line( g_2, m );
      l_2.position.set(p.x, p.y, p.z);
      l_2.rotation.set(r.x, r.y, r.z);
      group.add(l_2);
    }
  }

  group.castShadow = true;
  group.receiveShadow = true;
  group.add(curve);

  // scene.add(group);
  return group;
}

export default create_surface;
