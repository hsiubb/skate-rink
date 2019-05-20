import * as THREE from "three";
import { GRID_SIZE, scene } from './setting.js';
import create_surface from './surface.js';
import create_stair from './stair.js';

// 楼梯加平台
function create_stair_plat(color) {
    let group = new THREE.Group();

    let cube_geometry = new THREE.CubeGeometry(GRID_SIZE * 3, GRID_SIZE * 7, GRID_SIZE * 1);
    let cube_material = new THREE.MeshBasicMaterial({
        color: color
    });
    let cube = new THREE.Mesh(cube_geometry, cube_material);
    cube.position.set(GRID_SIZE * 5.5, GRID_SIZE * -3.5, GRID_SIZE * .5);
    cube.castShadow = true;
    group.add(cube);

    let surface_1 = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE, color);
    surface_1.position.set(GRID_SIZE * 3, GRID_SIZE * -1.5, 0);
    surface_1.rotation.z = Math.PI;
    surface_1.strokes(true, true);
    group.add(surface_1);

    let surface_2 = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE, color);
    surface_2.position.set(GRID_SIZE * 3, GRID_SIZE * -5.5, 0);
    surface_2.rotation.z = Math.PI;
    surface_2.strokes(true, true);
    group.add(surface_2);

    let stair = create_stair(GRID_SIZE * 2, GRID_SIZE, GRID_SIZE, color, GRID_SIZE * .2);
    stair.position.set(GRID_SIZE * 2, GRID_SIZE * -3.5, 0);
    stair.shape_line();

    scene.add(group);

    return group;
}

export default create_stair_plat;