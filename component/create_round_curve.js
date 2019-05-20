import * as THREE from "three";
import { GRID_SIZE, scene } from './setting.js';
import create_surface from './surface.js';

// 直角弧形 U 台
function create_round_curve(color) {
    let group = new THREE.Group();

    let cube_geometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE, GRID_SIZE * 2);
    let cube_material = new THREE.MeshBasicMaterial({
        color: color
    });
    let cube = new THREE.Mesh(cube_geometry, cube_material);

    function unit_cube(cube_pos) {
        let x = cube_pos[0];
        let y = cube_pos[1];
        let c = cube.clone();
        c.position.set(GRID_SIZE * x, GRID_SIZE * y, GRID_SIZE);
        c.castShadow = true;
        group.add(c);
        return c;
    }

    // 直角弧台墙柱
    // [
    //     [-2.5, -2.5],
    //     [-2.5, -1.5],
    //     [-2.5, -0.5],
    //     [-2.5, 0.5],
    //     [-2.5, 1.5],
    //     [-2.5, 2.5],
    //     [-1.5, 2.5],
    //     [-0.5, 2.5],
    //     [0.5, 2.5],
    //     [1.5, 2.5],
    //     [2.5, 2.5]
    // ].map(function (pos) {
    //     unit_cube(pos);
    // });

    let surface_1 = create_surface(GRID_SIZE * 2, GRID_SIZE * 2, GRID_SIZE * 2, color);
    surface_1.position.set(-GRID_SIZE, -GRID_SIZE * 2, 0);
    surface_1.strokes(true, false);
    group.add(surface_1);

    let surface_2 = create_surface(GRID_SIZE * 2, GRID_SIZE * 2, GRID_SIZE * 2, color);
    surface_2.position.set(GRID_SIZE * 2, GRID_SIZE, 0);
    surface_2.rotation.z = -Math.PI * .5;
    surface_2.strokes(false, true);
    group.add(surface_2);

    let surface = function () {
        let c_1 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-GRID_SIZE * 2, -GRID_SIZE, GRID_SIZE * 2),
            new THREE.Vector3(-GRID_SIZE * 2, GRID_SIZE * 2, GRID_SIZE * 2),
            new THREE.Vector3(GRID_SIZE, GRID_SIZE * 2, GRID_SIZE * 2)
        );
        let c_2 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-GRID_SIZE * 2, -GRID_SIZE, 0),
            new THREE.Vector3(-GRID_SIZE * 2, GRID_SIZE * 2, 0),
            new THREE.Vector3(GRID_SIZE, GRID_SIZE * 2, 0)
        );
        let c_3 = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, -GRID_SIZE, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(GRID_SIZE, 0, 0)
        );

        let len = 16;

        let points_1 = c_1.getPoints(len);
        let points_2 = c_2.getPoints(len);
        let points_3 = c_3.getPoints(len);

        let material = new THREE.LineDashedMaterial({
            color: '#fff',
            dashSize: 3,
            gapSize: 2
        });

        // 显式地展示弧度
        function round_view(state) {
            let g_1 = new THREE.BufferGeometry().setFromPoints(points_1);
            let l_1 = new THREE.Line(g_1, material);
            group.add(l_1);

            let g_3 = new THREE.BufferGeometry().setFromPoints(points_3);
            let l_3 = new THREE.Line(g_3, material);
            group.add(l_3);

            return state;
        }
        let view_round = round_view(false);

        let points_list = [];

        for (let i = 0; i <= len; i++) {
            let c = new THREE.QuadraticBezierCurve3(
                points_1[i],
                points_2[i],
                points_3[i]
            )
            let points = c.getPoints(len);

            points_list.push(points);
            if (view_round) {
                let g = new THREE.BufferGeometry().setFromPoints(points);
                let l = new THREE.Line(g, material);
                group.add(l);
            }
        }
        let v = [];
        let f = [];
        points_list.map(function (line_points, i) {
            line_points.map(function (point, j) {
                v.push(point);
                if (j < len && (i > 0 || (i === 0 && j > 0))) {
                    let cur = (i + 1) * len + j;

                    f.push(new THREE.Face3(cur, cur - len - 1, cur - len));
                    f.push(new THREE.Face3(cur, cur - len, cur + 1));
                }
            });
        });
        v.push(new THREE.Vector3(GRID_SIZE * -2, GRID_SIZE * 2, GRID_SIZE * 2));
        for (let i = 1; i < len; i++) {
            let cur = i * len;
            f.push(new THREE.Face3(cur - len, cur, v.length - 1));
        }

        let c_g = new THREE.Geometry();
        c_g.vertices = v;
        c_g.faces = f;
        let c_m = new THREE.MeshLambertMaterial({
            color: color
        });
        let curve = new THREE.Mesh(c_g, c_m);
        curve.castShadow = true;

        group.add(curve);
    }
    surface();

    scene.add(group);

    return group;
};

export default create_round_curve;