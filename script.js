let scene, camera, renderer, snakeMesh, foodMesh;
let snake, direction, food, score;
let gridSize = 10;
let snakeSize = 1;
let moveInterval;
let isGameOver = false;

const overlay = document.getElementById("overlay");

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 20;

    snakeMesh = new THREE.Group();
    scene.add(snakeMesh);

    resetGame();
    animate();
    moveInterval = setInterval(updateGame, 300); // slower movement
}

function resetGame() {
    snake = [{x: 0, y: 0, z: 0}];
    direction = {x: 1, y: 0, z: 0};
    score = 0;
    isGameOver = false;

    snakeMesh.clear();
    if (foodMesh) {
        scene.remove(foodMesh);
    }

    spawnFood();
    overlay.style.display = "none";
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        z: 0
    };
    let foodGeometry = new THREE.BoxGeometry(snakeSize, snakeSize, snakeSize);
    let foodMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    foodMesh = new THREE.Mesh(foodGeometry, foodMaterial);
    foodMesh.position.set(food.x, food.y, food.z);
    scene.add(foodMesh);
}

function updateGame() {
    if (isGameOver) return;

    let head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
        z: snake[0].z
    };

    // Check wall collision
    if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize ||
        snake.some(part => part.x === head.x && part.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        spawnFood();
        score++;
    } else {
        snake.pop();
    }

    renderSnake();
}

function renderSnake() {
    snakeMesh.clear();
    let snakeGeometry = new THREE.BoxGeometry(snakeSize, snakeSize, snakeSize);
    let snakeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});

    snake.forEach(part => {
        let segment = new THREE.Mesh(snakeGeometry, snakeMaterial);
        segment.position.set(part.x, part.y, part.z);
        snakeMesh.add(segment);
    });
}

function gameOver() {
    isGameOver = true;
    overlay.style.display = "flex";
    clearInterval(moveInterval);
}

function restartGame() {
    resetGame();
    moveInterval = setInterval(updateGame, 300);
}

// Direction control
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction.y === 0) direction = {x: 0, y: 1, z: 0};
    if (e.key === "ArrowDown" && direction.y === 0) direction = {x: 0, y: -1, z: 0};
    if (e.key === "ArrowLeft" && direction.x === 0) direction = {x: -1, y: 0, z: 0};
    if (e.key === "ArrowRight" && direction.x === 0) direction = {x: 1, y: 0, z: 0};
});

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();

addGameBoundary();

function addGameBoundary() {
    const boundaryMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        linewidth: 2
    });

    const half = gridSize / 2;

    const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(gridSize, 0, 0),
        new THREE.Vector3(gridSize, gridSize, 0),
        new THREE.Vector3(0, gridSize, 0),
        new THREE.Vector3(0, 0, 0)
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, boundaryMaterial);
    line.position.set(0, 0, -0.5); // کمی پایین‌تر تا زیر مار نمایش داده شود
    scene.add(line);
}
