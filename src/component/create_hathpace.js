import * as THREE from "three";
import { GRID_SIZE, BASE_COLOR, scene } from './setting.js';
import create_surface from './surface.js';

// 高台
function create_hathpace(color) {
    let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE * 3);
    let cube_material = new THREE.MeshBasicMaterial({
        color: color
    });
    let cube = new THREE.Mesh(cube_geometry, cube_material);
    cube.position.set(GRID_SIZE * -1.5, 0, GRID_SIZE * 1.5);
    cube.castShadow = true;

    let curve = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE * 3, color);
    curve.strokes(true, true);

    let group = new THREE.Group();
    group.add(cube);
    group.add(curve);

    scene.add(group);

    return group;
}

export default create_hathpace;
