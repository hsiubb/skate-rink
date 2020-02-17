import * as THREE from "three";
import { GRID_SIZE, BASE_COLOR, scene } from './setting.js';
import create_trapezoid_slope from './trapezoid_slope.js';
import create_bridge from './bridge.js';

// 长 U 台
function create_square_slope(color) {
    let group = new THREE.Group();

    let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 2, GRID_SIZE * .8);
    let cube_material = new THREE.MeshBasicMaterial({
        color: color
    });
    let cube = new THREE.Mesh(cube_geometry, cube_material);
    cube.position.set(0, 0, GRID_SIZE * .4);
    cube.castShadow = true;
    group.add(cube);

    let trapezoid_1 = create_trapezoid_slope(GRID_SIZE * 2, GRID_SIZE, GRID_SIZE, GRID_SIZE * .8, color);
    trapezoid_1.position.set(GRID_SIZE * -.5, 0, 0);
    trapezoid_1.rotation.z = Math.PI * .5;
    group.add(trapezoid_1);

    let trapezoid_2 = create_trapezoid_slope(GRID_SIZE * 2, GRID_SIZE, GRID_SIZE, GRID_SIZE * .8, color);
    trapezoid_2.position.set(GRID_SIZE * .5, 0, 0);
    trapezoid_2.rotation.z = Math.PI * -.5;
    group.add(trapezoid_2);

    let trapezoid_3 = create_trapezoid_slope(GRID_SIZE, GRID_SIZE, GRID_SIZE, GRID_SIZE * .8, color);
    trapezoid_3.position.set(0, GRID_SIZE, 0);
    group.add(trapezoid_3);

    let trapezoid_4 = create_trapezoid_slope(GRID_SIZE, GRID_SIZE, GRID_SIZE, GRID_SIZE * .8, color);
    trapezoid_4.position.set(0, -GRID_SIZE, 0);
    trapezoid_4.rotation.z = Math.PI;
    group.add(trapezoid_4);

    let bridge = create_bridge(GRID_SIZE * 2, GRID_SIZE, GRID_SIZE * .5, GRID_SIZE, BASE_COLOR[3]);
    bridge.position.set(-GRID_SIZE, -GRID_SIZE * 1.9, 0);

    group.position.set(GRID_SIZE * -1, GRID_SIZE * -1, 0);

    scene.add(group);

    return group;
}

export default create_square_slope;
