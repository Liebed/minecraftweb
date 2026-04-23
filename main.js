import * as THREE from 'https://esm.sh/three';
const pageData={
overworld:{
title: "The Creeper",
desc: "Watch out in the center of the screen! The Creeper can blow any player up to smithereens if the player is not attentive of his surroundings. These green ninjas can sabotage you anywhere in the mines by exploding!",
color: "#55FF55"
},
nether:{
title: "The Hoglin",
desc: "A massive, aggressive beast found in the Crimson Forests of the Nether. Watch out for its massive tusks and bulky body charging towards you!",
color: "#E28E80"
},
end:{
title: "The Enderman",
desc: "Don't look into its eyes. The Enderman wanders the barren islands of The End, ready to teleport. Built with elongated block shapes.",
color: "#AA00FF"
  }
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 15);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(15, 25, 10);
scene.add(dirLight);
const currentEnv = new THREE.Group();
scene.add(currentEnv);
let activeMob = null;
function createPixelTexture(color1, color2){
const canvas = document.createElement('canvas');
canvas.width = 64;
canvas.height = 64;
const ctx = canvas.getContext('2d');
for(let i = 0; i < 64; i += 8){
for(let j = 0; j < 64; j += 8){
ctx.fillStyle = Math.random() > 0.5 ? color1 : color2;
ctx.fillRect(i, j, 8, 8);
 }
}
const tex = new THREE.CanvasTexture(canvas);
tex.magFilter = THREE.NearestFilter;
tex.wrapS = THREE.RepeatWrapping;
tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(20, 20);
return tex;
}
const textures={
grass: createPixelTexture('#557A27', '#415E1D'),
netherrack: createPixelTexture('#611515', '#4A0E0E'),
endstone: createPixelTexture('#EADDCA', '#D4C4A8')
};
function clearScene(){
while(currentEnv.children.length > 0){ 
currentEnv.remove(currentEnv.children[0]); 
 }
activeMob = null;
}
function buildCreeper(){
const group = new THREE.Group();
const mat = new THREE.MeshLambertMaterial({ color: 0x0DAA44 });
const black = new THREE.MeshLambertMaterial({ color: 0x000000 });
const head = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), mat);
head.position.set(0, 4, 0);
const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), black);
leftEye.position.set(-0.5, 4.2, 1.01);
const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), black);
rightEye.position.set(0.5, 4.2, 1.01);
const mouth = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 0.1), black);
mouth.position.set(0, 3.5, 1.01);
const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 1), mat);
body.position.set(0, 1.5, 0);
const legGeo = new THREE.BoxGeometry(1, 1.5, 1);
const fl = new THREE.Mesh(legGeo, mat); fl.position.set(-0.5, -0.75, 0.5);
const fr = new THREE.Mesh(legGeo, mat); fr.position.set(0.5, -0.75, 0.5);
const bl = new THREE.Mesh(legGeo, mat); bl.position.set(-0.5, -0.75, -0.5);
const br = new THREE.Mesh(legGeo, mat); br.position.set(0.5, -0.75, -0.5);
group.add(head, leftEye, rightEye, mouth, body, fl, fr, bl, br);
group.position.y = 1.5;
return group;
 }

function buildHoglin(){
const group = new THREE.Group();
const bodyMat = new THREE.MeshLambertMaterial({ color: 0xbd7164 }); 
const darkMat = new THREE.MeshLambertMaterial({ color: 0x4a2c22 }); 
const tuskMat = new THREE.MeshLambertMaterial({ color: 0xdcd1c2 }); 
const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 4), bodyMat);
body.position.set(0, 3, 0);
const mane = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 4.2), darkMat);
mane.position.set(0, 4.5, 0);
const head = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2.5), bodyMat);
head.position.set(0, 3.2, 2.8); 
const snout = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1), darkMat);
snout.position.set(0, 2.8, 4.5);
const tuskGeo = new THREE.BoxGeometry(0.3, 2, 0.3);
const rightTusk = new THREE.Mesh(tuskGeo, tuskMat);
rightTusk.position.set(0.8, 3.8, 4.5);
rightTusk.rotation.x=-Math.PI/6; 
const leftTusk = new THREE.Mesh(tuskGeo, tuskMat);
leftTusk.position.set(-0.8, 3.8, 4.5);
leftTusk.rotation.x = -Math.PI / 6;
const legGeo = new THREE.BoxGeometry(0.8, 2, 0.8);
const fl = new THREE.Mesh(legGeo, bodyMat); fl.position.set(-0.8, 1, 1.5);
const fr = new THREE.Mesh(legGeo, bodyMat); fr.position.set(0.8, 1, 1.5);
const bl = new THREE.Mesh(legGeo, bodyMat); bl.position.set(-0.8, 1, -1.5);
const br = new THREE.Mesh(legGeo, bodyMat); br.position.set(0.8, 1, -1.5);
group.add(body, mane, head, snout, rightTusk, leftTusk, fl, fr, bl, br);
group.position.y = 0.5; 
return group;
 }
function buildEnderman(){
const group = new THREE.Group();
const mat = new THREE.MeshLambertMaterial({ color: 0x111111 });
const eyeMat = new THREE.MeshLambertMaterial({ color: 0xAA00FF });
const head = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), mat);
head.position.set(0, 8, 0);
const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.1), eyeMat);
leftEye.position.set(-0.5, 8, 1.01);
const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.1), eyeMat);
rightEye.position.set(0.5, 8, 1.01);
const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 1), mat);
body.position.set(0, 5.5, 0);
const limbGeo = new THREE.BoxGeometry(0.5, 5, 0.5);
const la = new THREE.Mesh(limbGeo, mat); la.position.set(-1, 4.5, 0);
const ra = new THREE.Mesh(limbGeo, mat); ra.position.set(1, 4.5, 0);
const ll = new THREE.Mesh(limbGeo, mat); ll.position.set(-0.4, 1.5, 0);
const rl = new THREE.Mesh(limbGeo, mat); rl.position.set(0.4, 1.5, 0);
group.add(head, leftEye, rightEye, body, la, ra, ll, rl);
return group;
}
function loadDimension(dim){
clearScene();
const groundGeo = new THREE.PlaneGeometry(200, 200);
const ground = new THREE.Mesh(groundGeo);
ground.rotation.x = -Math.PI / 2;
currentEnv.add(ground);
document.getElementById('mob-title').innerText = pageData[dim].title;
document.getElementById('mob-desc').innerText = pageData[dim].desc;
document.getElementById('mob-title').style.color = pageData[dim].color;
const navButtons = document.querySelectorAll('#dimension-nav button');
navButtons.forEach(btn=>{
btn.classList.remove('active');
btn.style.borderColor = '#555';
if(btn.dataset.dim === dim) {
btn.classList.add('active');
btn.style.borderColor = pageData[dim].color;
  }
});
if(dim === 'overworld'){
scene.fog = new THREE.FogExp2(0x87CEEB, 0.03);
document.body.style.backgroundColor = '#87CEEB';
ambientLight.color.setHex(0xffffff);
ambientLight.intensity = 0.7;
ground.material = new THREE.MeshLambertMaterial({ map: textures.grass });
const leafMat = new THREE.MeshLambertMaterial({ color: 0x2d5e1e });
const woodMat = new THREE.MeshLambertMaterial({ color: 0x5C4033 });
for(let i = 0; i < 35; i++){
const tree = new THREE.Group();
const trunk = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 1), woodMat);
trunk.position.y = 2.5;
const leaves = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), leafMat);
leaves.position.y = 7.5;
tree.add(trunk, leaves);
const x = (Math.random() - 0.5) * 80;
const z = (Math.random() - 0.5) * 80;
if(Math.abs(x) < 8 && Math.abs(z) < 8)
continue;
tree.position.set(x, 0, z);
currentEnv.add(tree);
}
activeMob = buildCreeper();
 } 
else if(dim === 'nether'){
scene.fog = new THREE.FogExp2(0x4a0000, 0.04);
document.body.style.backgroundColor = '#4a0000';
ambientLight.color.setHex(0xff5555);
ambientLight.intensity = 1.2;
ground.material = new THREE.MeshLambertMaterial({ map: textures.netherrack });
const lavaMat = new THREE.MeshLambertMaterial({ color: 0xff4400, emissive: 0xaa2200 });
for(let i = 0; i < 15; i++){
const pillar = new THREE.Mesh(new THREE.BoxGeometry(3, Math.random() * 20 + 10, 3), lavaMat);
const x = (Math.random() - 0.5) * 80;
const z = (Math.random() - 0.5) * 80;
if(Math.abs(x) < 10 && Math.abs(z) < 10)
continue;
pillar.position.set(x, 0, z);
currentEnv.add(pillar);
  }
activeMob = buildHoglin();
}
else if(dim === 'end'){
scene.fog = new THREE.FogExp2(0x0a001a, 0.02);
document.body.style.backgroundColor = '#0a001a';
ambientLight.color.setHex(0xaaaaaa);
ambientLight.intensity = 0.4;
ground.material = new THREE.MeshLambertMaterial({ map: textures.endstone });
const obsidianMat = new THREE.MeshLambertMaterial({ color: 0x110022 });
for(let i = 0; i < 10; i++){
const pillar = new THREE.Mesh(new THREE.BoxGeometry(4, Math.random() * 30 + 20, 4), obsidianMat);
const x = (Math.random() - 0.5) * 80;
const z = (Math.random() - 0.5) * 80;
if(Math.abs(x) < 12 && Math.abs(z) < 12)
continue;
pillar.position.set(x, 0, z);
currentEnv.add(pillar);
  }
activeMob = buildEnderman();
}
if(activeMob)
currentEnv.add(activeMob);
  }
document.querySelectorAll('#dimension-nav button').forEach(btn=>{
btn.addEventListener('click', (e)=>{
loadDimension(e.target.dataset.dim);
});
});
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth/2;
const windowHalfY = window.innerHeight/2;
document.addEventListener('mousemove', (event)=>{
mouseX = (event.clientX - windowHalfX);
mouseY = (event.clientY - windowHalfY);
});
loadDimension('overworld');
function animate(){
requestAnimationFrame(animate);
if(activeMob){
activeMob.rotation.y += 0.005; 
 } 
targetX = mouseX * 0.01;
targetY = mouseY * 0.01;
camera.position.x += (targetX - camera.position.x)*0.05;
camera.position.y += (-targetY + 6 - camera.position.y)*0.05;
camera.lookAt(0, 4, 0);
renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', ()=>{
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});