import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
/**
 * GUI Controls
 */
import * as dat from 'dat.gui'

import globe_vertex_shader from "Assets/shaders/vertex_globe.glsl"
import globe_fragment_shader from "Assets/shaders/fragment_globe.glsl"
import earth_map from "Assets/textures/8081_earthmap2k.jpeg"
import { Uniform } from 'three'

const gui = new dat.GUI()

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Stars
 */
const geometry = new THREE.OctahedronGeometry(300, 1)
// const material = new THREE.MeshNormalMaterial()
// material.wireframe = true
const material = new THREE.PointsMaterial({color: 0xFFFFFF})
const mesh = new THREE.Points(geometry, material)

const geometry_2 = new THREE.OctahedronGeometry(600, 3)
// const material_2 = new THREE.MeshNormalMaterial()
// material_2.wireframe = true
const material_2 = new THREE.PointsMaterial({color: 0xFFFFFF})
const mesh_2 = new THREE.Points(geometry_2, material_2)

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

/**
 * Add scenes
 */
scene.add(mesh)
scene.add(mesh_2)
scene.add(earth)

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
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	1000
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 50
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
// controls.enableZoom = false
controls.enablePan = false
controls.dampingFactor = 0.05
controls.maxDistance = 1000
controls.minDistance = 30
controls.touches = {
	ONE: THREE.TOUCH.ROTATE,
	TWO: THREE.TOUCH.DOLLY_PAN,
}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	mesh.rotation.y += 0.0001 * Math.sin(1)
	mesh_2.rotation.y += 0.0001 * Math.sin(1)
	mesh.rotation.z += 0.0001 * Math.sin(1)
	mesh_2.rotation.z += 0.0001 * Math.sin(1)

	// Update controls
	controls.update()
	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
