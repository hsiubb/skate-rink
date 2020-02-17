import * as THREE from "three";
import { GRID_SIZE, scene } from './setting.js';
import create_surface from './surface.js';
import create_stair from './stair.js';

// 长 U 台
function create_half_pipe(color) {
    let group = new THREE.Group();

    let cube_geometry = new THREE.CubeGeometry(GRID_SIZE * 3, GRID_SIZE * 1, GRID_SIZE * 1);
    let cube_material = new THREE.MeshBasicMaterial({
        color: color
    });
    let cube = new THREE.Mesh(cube_geometry, cube_material);
    cube.position.set(GRID_SIZE * 5.5, GRID_SIZE * 6.5, GRID_SIZE * .5);
    cube.castShadow = true;
    group.add(cube);

    let flat_g = new THREE.PlaneGeometry(GRID_SIZE * 3, GRID_SIZE * 5, 1);
    let flat_m = new THREE.MeshBasicMaterial({
        color: color
    });
    let flat = new THREE.Mesh(flat_g, flat_m);
    flat.position.set(GRID_SIZE * 5.5, GRID_SIZE * 3, .5);
    flat.castShadow = true;
    group.add(flat);

    let surface_1 = create_surface(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE, color);
    surface_1.position.set(GRID_SIZE * 5.5, GRID_SIZE * 5.5, 0);
    surface_1.rotation.z = -Math.PI * .5;
    surface_1.strokes(true, true);
    group.add(surface_1);

    let surface_2 = create_surface(GRID_SIZE, GRID_SIZE * 3, GRID_SIZE, color);
    surface_2.position.set(GRID_SIZE * 5.5, GRID_SIZE * .5, 0);
    surface_2.rotation.z = Math.PI * .5;
    surface_2.strokes(true, true);
    group.add(surface_2);

    scene.add(group);

    return group;
}

export default create_half_pipe;