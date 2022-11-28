import './style/main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as dat from 'dat.gui';

import atmosphere_vertex_shader from "Assets/shaders/vertex_atmosphere.glsl";
import atmosphere_fragment_shader from "Assets/shaders/fragment_atmosphere.glsl";

import { drawThreeGeo } from "App/threeGeoJSON.js";

import countries_states from "Assets/json/countries_states.json";

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
const star_geometry = new THREE.BufferGeometry();
const star_material = new THREE.PointsMaterial({
	color: 0xFFFFFF,
});

const star_vertices = [];
for(let i=0; i < 10000; i++) {
	var _z = 1;
	if (i > 5000)
		_z = -1;
	const x = (Math.random() - 0.5) * 2000;
	const y = (Math.random() - 0.5) * 2000;
	const z = _z * (Math.random()) * 3000;
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
	new THREE.MeshBasicMaterial({
		// shininess: 0.2,
		side: THREE.BackSide,
		color: 0x2d37f2
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

var mesh_array = [];
var border_array = [];
drawThreeGeo(countries_states, 20, 'sphere', scene, mesh_array, border_array, {
	color: 'green',
	borderColor: 'yellow'
})

for(var i = 0; i < mesh_array.length; i++) {
	earth.add(mesh_array[i]);
}

for(var i = 0; i < border_array.length; i++) {
	earth.add(border_array[i]);
}


/**
 * Add scenes
 */
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
	enable_zoom: true,
	enable_pan: true,
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

const continents = gui.addFolder('Continents');
var misc_mesh_params = {show: true};
var misc_border_params = {show: true};

continents.add(misc_mesh_params, 'show').name("show fill")
	.onChange((value) => {
		if(value) {
			for(var i = 0; i < mesh_array.length; i++) {
				scene.add(mesh_array[i]);
				earth.add(mesh_array[i]);
			}
		} else {
			for(var i = 0; i < mesh_array.length; i++) {
				mesh_array[i].geometry.dispose();
				mesh_array[i].material.dispose();
				scene.remove(mesh_array[i]);
				earth.remove(mesh_array[i]);
			}
		}
	})

continents.add(misc_border_params, 'show').name("show border")
.onChange((value) => {
	if(value) {
		for(var i = 0; i < border_array.length; i++) {
			scene.add(border_array[i]);
			earth.add(border_array[i]);
		}
	} else {
		for(var i = 0; i < border_array.length; i++) {
			border_array[i].geometry.dispose();
			border_array[i].material.dispose();
			scene.remove(border_array[i]);
			earth.remove(border_array[i]);
		}
	}
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
	alpha: true
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
