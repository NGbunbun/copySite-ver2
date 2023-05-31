import "./style.css";
import "./jquery";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

const gui = new dat.GUI({width: 300});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfcf4e0);

// Geometry
const geometry          = new THREE.SphereGeometry(2.2, 512, 512);
const planeGeometry     = new THREE.PlaneGeometry(15, 7, 36, 36);
const ringGeometry      = new THREE.RingGeometry(6.01, 6);

// color
const colorObject = {
  depthColor: 0x659a01,
  surfaceColor: 0xe9aa00,
};

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uWaveLenght: {value: 0.22},
      uFrequency: {value: new THREE.Vector2(1.5, 1.1)},
      uTime: {value: 0},
      uWaveSpeed: {value: 0.1},
      uDepthColor: {value: new THREE.Color(colorObject.depthColor)},
      uSurfaceColor: {value: new THREE.Color(colorObject.surfaceColor)},
      uColorOffset: {value: 0.3},
      uColorMultiplier: {value: 1.276},
      uSmallWaveElevation: {value: 0.4},
      uSmallWaveFrequency: {value: 0.55},
      uSmallWaveSpeed: {value: 0.1},
    },
});

const planeMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.05,
});

const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

//gui debug
gui.add(material.uniforms.uWaveLenght, "value")
   .min(0)
   .max(1)
   .step(0.001)
   .name("WaveLenght");
gui.add(material.uniforms.uFrequency.value, "x")
   .min(0)
   .max(40)
   .step(0.001)
   .name("FrequencyX");
gui.add(material.uniforms.uFrequency.value, "y")
   .min(0)
   .max(40)
   .step(0.001)
   .name("FrequencyY");
gui.add(material.uniforms.uWaveSpeed, "value")
   .min(0)
   .max(10)
   .step(0.001)
   .name("WaveSpeed");
gui.add(material.uniforms.uColorOffset, "value")
   .min(0)
   .max(1)
   .step(0.001)
   .name("ColorOffset");
gui.add(material.uniforms.uColorMultiplier, "value")
   .min(0)
   .max(10)
   .step(0.001)
   .name("ColorMultiplier");
gui.add(material.uniforms.uSmallWaveElevation, "value")
   .min(0)
   .max(1)
   .step(0.001)
   .name("SmallWaveElevation");
gui.add(material.uniforms.uSmallWaveFrequency, "value")
   .min(0)
   .max(10)
   .step(0.001)
   .name("SmallWaveFrequency");
gui.add(material.uniforms.uSmallWaveSpeed, "value")
   .min(0)
   .max(1)
   .step(0.001)
   .name("SmallWaveSpeed");

gui.addColor(colorObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
});
gui.addColor(colorObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
});

gui.show(false);

// Mesh
const mesh  = new THREE.Mesh(geometry, material);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.set(-0.03, 1, 0);
plane.position.set(-2.3, 0, -1);

scene.add(mesh, plane);

let ringCount = 10;
let rings     = [];
for(let i = 0; i < ringCount; i++){
  let ring  = new THREE.Mesh(ringGeometry, ringMaterial);

  ring.position.x = (Math.random() - 0.5) * 9;
  ring.position.y = (Math.random() - 0.5) * 7;
  ring.position.z = (Math.random() - 0.5) * 9;

  ring.rotation.x = Math.random() * Math.PI;
  ring.rotation.y = Math.random() * Math.PI;

  rings.push(ring);

  scene.add(ring);
}

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-4.5, -0.5, -3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
  
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
  

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //各リングの動き
  for(let i = 0; i < rings.length; i++){
    rings[i].rotation.x += 0.002;
    rings[i].rotation.y += 0.002;
    rings[i].rotation.z += 0.002;
  }

  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();