import * as THREE from "three";
import { scene } from './setting.js';

// 基于点序列显示边线
function shape_line() {
  let geometry = new THREE.Geometry();
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
export default shape_line;
