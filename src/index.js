import './style/main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
/**
 * GUI Controls
 */
import * as dat from 'dat.gui';

import globe_vertex_shader from "Assets/shaders/vertex_globe.glsl";
import globe_fragment_shader from "Assets/shaders/fragment_globe.glsl";

import atmosphere_vertex_shader from "Assets/shaders/vertex_atmosphere.glsl";
import atmosphere_fragment_shader from "Assets/shaders/fragment_atmosphere.glsl";

import earth_map from "Assets/textures/8081_earthmap2k.jpeg";

const gui = new dat.GUI();

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl');

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Stars
 */
// // const material = new THREE.MeshNormalMaterial();
// // material.wireframe = true;
// const octahedron_star_01 = new THREE.Points(
// 	new THREE.OctahedronGeometry(300, 1), 
// 	new THREE.PointsMaterial({color: 0xFFFFFF})
// );

// // const material_2 = new THREE.MeshNormalMaterial();
// // material_2.wireframe = true;
// const octahedron_star_02 = new THREE.Points(
// 	new THREE.OctahedronGeometry(600, 3),
// 	new THREE.PointsMaterial({color: 0xFFFFFF})
// );

const star_geometry = new THREE.BufferGeometry();
const star_material = new THREE.PointsMaterial({
	color: 0xFFFFFF,
});

const star_vertices = [];
for(let i=0; i < 10000; i++) {
	const x = (Math.random() - 0.5) * 2000;
	const y = (Math.random() - 0.5) * 2000;
	const z = -(Math.random()) * 3000;
	star_vertices.push(x,y,z);
}

star_geometry.setAttribute(
	'position', 
	new THREE.Float32BufferAttribute(star_vertices, 3)
);

const stars = new THREE.Points(star_geometry, star_material);

/**
 * Globe
 */
const earth = new THREE.Mesh(
	new THREE.SphereGeometry(20, 50, 50), 
	// new THREE.MeshBasicMaterial({
	// 	map: new THREE.TextureLoader().load(earth_map),
	// 	shininess: 0.2
	// })
	new THREE.ShaderMaterial({
		vertexShader: globe_vertex_shader,
		fragmentShader: globe_fragment_shader,
		uniforms: {
			globe_texture: {
				value: new THREE.TextureLoader().load(earth_map)
			}
		}
	})
);

const atmosphere = new THREE.Mesh(
	new THREE.SphereGeometry(20, 50, 50), 
	new THREE.ShaderMaterial({
		vertexShader: atmosphere_vertex_shader,
		fragmentShader: atmosphere_fragment_shader,
		blending: THREE.AdditiveBlending,
		side: THREE.BackSide,
		uniforms: {
			
		}
	})
);

atmosphere.scale.set(1.1, 1.1, 1.1);

/**
 * Add scenes
 */
// scene.add(octahedron_star_01);
// scene.add(octahedron_star_02);
scene.add(stars);
scene.add(earth);
scene.add(atmosphere);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	1000
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 50;
scene.add(camera);

/**
 * GUI options
 */
const earth_folder = gui.addFolder('Earth');
earth_folder.add(earth.material, 'wireframe');
earth_folder.add(earth.rotation, 'x', 0, Math.PI).name('Rotate X Axis');
earth_folder.add(earth.rotation, 'y', 0, Math.PI).name('Rotate Y Axis');
earth_folder.add(earth.rotation, 'z', 0, Math.PI).name('Rotate Z Axis');

var control_params = {
	auto_rotate: true,
	enable_damping: true,
	enable_zoom: false,
	enable_pan: false,
	damping_factor: 0.05,
	max_distance: 1000,
	min_distance: 30
}

// Controls
const controls = new OrbitControls(camera, canvas);
controls.autoRotate = control_params.auto_rotate;
controls.enableDamping = control_params.enable_damping;
controls.enableZoom = control_params.enable_zoom;
controls.enablePan = control_params.enable_pan;
controls.dampingFactor = control_params.damping_factor;
controls.maxDistance = control_params.max_distance;
controls.minDistance = control_params.min_distance;
controls.touches = {
	ONE: THREE.TOUCH.ROTATE,
	TWO: THREE.TOUCH.DOLLY_PAN,
}

const camera_folder = gui.addFolder('Camera');
camera_folder.add(camera.position, 'z', 0, 100);
camera_folder.add(control_params, 'auto_rotate').name("Auto Rotate")
	.onChange((value) => controls.autoRotate=value);
camera_folder.add(control_params, 'enable_damping').name("Enable Damping")
	.onChange((value) => controls.enableDamping=value);
camera_folder.add(control_params, 'enable_zoom').name("Enable Zoom")
	.onChange((value) => controls.enableZoom=value);
camera_folder.add(control_params, 'enable_pan').name("Enable Pan")
	.onChange((value) => controls.enablePan=value);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// Update controls
	controls.update()
	// Render
	renderer.render(scene, camera)
	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick();
