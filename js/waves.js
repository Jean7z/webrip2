// Flowing Waves Shader — fondo WebGL (Three.js)
// Port del componente 21st "flowing-waves-shader" (id 7028, dhileepkumargm)
import * as THREE from "./vendor/three.module.min.js";

const container = document.getElementById("waves");
let renderer;

try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
} catch (e) {
  container.innerHTML =
    '<p style="color:#fff;text-align:center;padding-top:40vh">WebGL no disponible</p>';
  throw e;
}

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const clock = new THREE.Clock();

const vertexShader = `
varying vec2 vTextureCoord;
void main(){ vTextureCoord=uv; gl_Position=vec4(position,1.0); }`;

const fragmentShader = `
precision mediump float;
uniform vec2 iResolution; uniform float iTime;
uniform bool hasActiveReminders; uniform bool hasUpcomingReminders; uniform bool disableCenterDimming;
varying vec2 vTextureCoord;

void mainImage(out vec4 fragColor,in vec2 fragCoord){
  vec2 uv=(2.0*fragCoord-iResolution.xy)/min(iResolution.x,iResolution.y);
  vec2 center=iResolution.xy*0.5;
  float dist=distance(fragCoord,center);
  float radius=min(iResolution.x,iResolution.y)*0.5;
  float dim=disableCenterDimming?1.0:smoothstep(radius*0.3,radius*0.5,dist);
  for(float i=1.0;i<10.0;i++){
    uv.x+=0.6/i*cos(i*2.5*uv.y+iTime);
    uv.y+=0.6/i*cos(i*1.5*uv.x+iTime);
  }
  if(hasActiveReminders)       fragColor=vec4(vec3(0.1,0.3,0.6)/abs(sin(iTime-uv.y-uv.x)),1.0);
  else if(hasUpcomingReminders)fragColor=vec4(vec3(0.1,0.5,0.2)/abs(sin(iTime-uv.y-uv.x)),1.0);
  else                         fragColor=vec4(vec3(0.1)/abs(sin(iTime-uv.y-uv.x)),1.0);
  if(!disableCenterDimming) fragColor.rgb=mix(fragColor.rgb*0.3,fragColor.rgb,dim);
}
void main(){
  vec4 c; mainImage(c,vTextureCoord*iResolution); gl_FragColor=c;
}`;

// Paletas estado (toggle futuro): active -> azul, upcoming -> verde
const uniforms = {
  iTime:                { value: 0 },
  iResolution:          { value: new THREE.Vector2() },
  iMouse:               { value: new THREE.Vector2() },
  hasActiveReminders:   { value: false },
  hasUpcomingReminders: { value: false },
  disableCenterDimming: { value: true }, // sin sombra central
};

const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

// Sincroniza el buffer del canvas con su tamaño real cada vez que cambia.
// Evita pixelado/lag cuando el navegador restaura la pestana sin disparar resize.
let sizeW = 0;
let sizeH = 0;
const syncSize = () => {
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;
  if (w !== sizeW || h !== sizeH) {
    sizeW = w;
    sizeH = h;
    renderer.setSize(w, h);
    uniforms.iResolution.value.set(w, h);
  }
};
window.addEventListener("resize", syncSize);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) syncSize();
});
syncSize();

// Velocidad: 0.4 = 60% mas lento que el shader original
renderer.setAnimationLoop(() => {
  syncSize();
  uniforms.iTime.value = clock.getElapsedTime() * 0.4;
  renderer.render(scene, camera);
});