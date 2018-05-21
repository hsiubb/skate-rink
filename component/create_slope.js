import * as THREE from "three";
import { GRID_SIZE, BASE_COLOR, scene } from './setting.js';
import slope from './slope.js';

// 斜坡
function create_slope(color) {
    let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE);
    let cube_material = new THREE.MeshBasicMaterial({
        color: color
    });
    let cube = new THREE.Mesh(cube_geometry, cube_material);
    cube.position.x = -GRID_SIZE * 3.5;
    cube.position.z = GRID_SIZE * .5;
    cube.castShadow = true;

    let short_slope = slope(GRID_SIZE * 3, GRID_SIZE * 3, GRID_SIZE, color);
    short_slope.rotation.z = Math.PI;

    let group = new THREE.Group();
    group.add(cube);
    group.add(short_slope);

    scene.add(group);

    return group;
};

export default create_slope;
