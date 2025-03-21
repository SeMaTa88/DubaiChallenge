// script.js

// تنظیمات صحنه، دوربین و رندرر
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// گروه‌های اصلی برای مدیریت المان‌های بازی
const mazeGroup = new THREE.Group();
const pelletGroup = new THREE.Group();
scene.add(mazeGroup);
scene.add(pelletGroup);

// تعریف نقشه بازی به صورت آرایه (1: دیوار، 2: خوراکی، 0: فضای خالی)
const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1]
];
const wallSize = 4;

// ایجاد دیوارها و خوراکی‌ها بر اساس آرایه maze
for (let i = 0; i < maze.length; i++) {
  for (let j = 0; j < maze[i].length; j++) {
    const x = j * wallSize - (maze[i].length * wallSize) / 2;
    const z = i * wallSize - (maze.length * wallSize) / 2;
    if (maze[i][j] === 1) {
      // ایجاد یک مکعب به عنوان دیوار
      const geometry = new THREE.BoxGeometry(wallSize, wallSize, wallSize);
      const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
      const wall = new THREE.Mesh(geometry, material);
      wall.position.set(x, wallSize / 2, z);
      mazeGroup.add(wall);
    } else if (maze[i][j] === 2) {
      // ایجاد یک کره کوچک به عنوان خوراکی
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const pellet = new THREE.Mesh(geometry, material);
      pellet.position.set(x, 1, z);
      pelletGroup.add(pellet);
    }
  }
}

// ایجاد پک‌من (استفاده از کره با برش برای نمایش دهان)
const pacGeometry = new THREE.SphereGeometry(1.5, 32, 32, Math.PI / 4, Math.PI * 1.5);
const pacMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
const pacman = new THREE.Mesh(pacGeometry, pacMaterial);
pacman.position.set(0, 1.5, 0);
scene.add(pacman);

// ایجاد چند شبح با رنگ‌های متفاوت
const ghostColors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];
const ghosts = [];
for (let i = 0; i < ghostColors.length; i++) {
  const ghostGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const ghostMaterial = new THREE.MeshPhongMaterial({ color: ghostColors[i] });
  const ghost = new THREE.Mesh(ghostGeometry, ghostMaterial);
  ghost.position.set(-10 + i * 5, 1.5, 10);
  ghosts.push(ghost);
  scene.add(ghost);
}

// افزودن نورپردازی به صحنه
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// تنظیمات اولیه دوربین
camera.position.set(0, 20, 20);
camera.lookAt(0, 0, 0);

// کنترل‌های کیبورد برای حرکت پک‌من
const keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// تابع بازی (حلقه انیمیشن)
function animate() {
  requestAnimationFrame(animate);

  // سرعت حرکت پک‌من
  const speed = 0.2;
  if (keys['ArrowUp']) pacman.position.z -= speed;
  if (keys['ArrowDown']) pacman.position.z += speed;
  if (keys['ArrowLeft']) pacman.position.x -= speed;
  if (keys['ArrowRight']) pacman.position.x += speed;

  // بررسی برخورد پک‌من با خوراکی‌ها (جمع‌آوری خوراکی در صورت نزدیک شدن)
  pelletGroup.children.slice().forEach((pellet) => {
    if (pacman.position.distanceTo(pellet.position) < 2) {
      pelletGroup.remove(pellet);
    }
  });

  // حرکت تصادفی اولیه برای شبح‌ها
  ghosts.forEach((ghost) => {
    ghost.position.x += (Math.random() - 0.5) * 0.1;
    ghost.position.z += (Math.random() - 0.5) * 0.1;
  });

  renderer.render(scene, camera);
}
animate();

// واکنش به تغییر اندازه صفحه
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
