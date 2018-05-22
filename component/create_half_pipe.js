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
    function unit_cube(cube_pos) {
        let x = cube_pos[0];
        let y = cube_pos[1];
        let c = cube.clone();
        c.position.set(GRID_SIZE * x, GRID_SIZE * y, GRID_SIZE * .5);
        c.castShadow = true;
        group.add(c);
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
    ].map(function (pos) {
        unit_cube(pos);
    });

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

    let surface_3 = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE, color);
    surface_3.position.set(GRID_SIZE * 3, GRID_SIZE * -1.5, 0);
    surface_3.rotation.z = Math.PI;
    surface_3.strokes(true, true);
    group.add(surface_3);

    let surface_4 = create_surface(GRID_SIZE * 2, GRID_SIZE * 3, GRID_SIZE, color);
    surface_4.position.set(GRID_SIZE * 3, GRID_SIZE * -5.5, 0);
    surface_4.rotation.z = Math.PI;
    surface_4.strokes(true, true);
    group.add(surface_4);

    let stair = create_stair(GRID_SIZE * 2, GRID_SIZE, GRID_SIZE, color, GRID_SIZE * .2);
    stair.position.set(GRID_SIZE * 2, GRID_SIZE * -3.5, 0);
    stair.shape_line();


    scene.add(group);

    return group;
}

export default create_half_pipe;