// Three.js 3D Earth Visualization with Interactive Controls
let scene, camera, renderer, earth, stars, controls
const asteroids = []
let isFullscreen = false

// Initialize the 3D scene
function initEarth() {
  const container = document.getElementById("earth-model")
  const canvas = document.getElementById("earth-canvas")

  // Scene setup
  scene = new THREE.Scene()

  // Camera setup
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.z = 3

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Create Earth
  createEarth()

  // Create starfield
  createStars()

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 3, 5)
  scene.add(directionalLight)

  // Mouse controls
  setupControls()

  // Handle window resize
  window.addEventListener("resize", onWindowResize)

  // Start animation
  animate()
}

function createEarth() {
  const loader = new THREE.TextureLoader();

  const texture = loader.load("/static/textures/earth/earth_daymap.jpg");
  const normalMap = loader.load("/static/textures/earth/earth_normal.jpg");
  const specularMap = loader.load("/static/textures/earth/earth_specular.png");

  const geometry = new THREE.SphereGeometry(1, 64, 64);

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    normalMap: normalMap,
    specularMap: specularMap,
    specular: new THREE.Color(0x333333),
    shininess: 15,
  });

  earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  // Add atmosphere
  const atmosphereGeometry = new THREE.SphereGeometry(1.03, 64, 64);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x3a7bd5,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  earth.add(atmosphere);
}


// Create starfield background
function createStars() {
  const starGeometry = new THREE.BufferGeometry()
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
    transparent: true,
  })

  const starVertices = []
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = (Math.random() - 0.5) * 2000
    starVertices.push(x, y, z)
  }

  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3))
  stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)
}

// Setup mouse controls for rotation and zoom
function setupControls() {
  controls = {
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: 0, y: 0 },
  }

  const canvas = document.getElementById("earth-canvas")

// Fullscreen Panel Control
const fullscreenPanel = document.getElementById("fullscreenPanel");
const closePanelBtn = document.getElementById("closePanelBtn");

function openPanel() {
  fullscreenPanel.style.right = "0";
}

function closePanel() {
  fullscreenPanel.style.right = "-450px";
}

closePanelBtn.addEventListener("click", closePanel);

  // Mouse down
  canvas.addEventListener("mousedown", (e) => {
    controls.isDragging = true
    controls.previousMousePosition = { x: e.clientX, y: e.clientY }
  })

  // Mouse move
  canvas.addEventListener("mousemove", (e) => {
    if (controls.isDragging) {
      const deltaX = e.clientX - controls.previousMousePosition.x
      const deltaY = e.clientY - controls.previousMousePosition.y

      controls.rotation.y += deltaX * 0.005
      controls.rotation.x += deltaY * 0.005

      controls.previousMousePosition = { x: e.clientX, y: e.clientY }
    }
  })

  // Mouse up
  canvas.addEventListener("mouseup", () => {
    controls.isDragging = false
  })

  // Mouse leave
  canvas.addEventListener("mouseleave", () => {
    controls.isDragging = false
  })

  // Touch controls for mobile
  canvas.addEventListener("touchstart", (e) => {
    controls.isDragging = true
    controls.previousMousePosition = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  })

  canvas.addEventListener("touchmove", (e) => {
    if (controls.isDragging) {
      const deltaX = e.touches[0].clientX - controls.previousMousePosition.x
      const deltaY = e.touches[0].clientY - controls.previousMousePosition.y

      controls.rotation.y += deltaX * 0.005
      controls.rotation.x += deltaY * 0.005

      controls.previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }
  })

  canvas.addEventListener("touchend", () => {
    controls.isDragging = false
  })

  // Mouse wheel for zoom
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault()
    const zoomSpeed = 0.001
    camera.position.z += e.deltaY * zoomSpeed
    camera.position.z = Math.max(1.5, Math.min(5, camera.position.z))
  })
}

// Add asteroid marker to the Earth
function addAsteroidMarker(latitude, longitude, asteroidData) {
  // Convert lat/long to 3D coordinates
  const phi = (90 - latitude) * (Math.PI / 180)
  const theta = (longitude + 180) * (Math.PI / 180)

  const radius = 1.05
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  // Create marker
  const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16)
  const markerMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
  })
  const marker = new THREE.Mesh(markerGeometry, markerMaterial)
  marker.position.set(x, y, z)

  // Add pulsing animation
  marker.userData = {
    asteroidData: asteroidData,
    pulsePhase: Math.random() * Math.PI * 2,
  }

  earth.add(marker)
  asteroids.push(marker)

  console.log("[v0] Added asteroid marker:", asteroidData.name, "at", latitude, longitude)
}

// После того, как инициализировали renderer, camera и earth:
const canvas = document.getElementById("earth-canvas");
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

canvas.addEventListener("click", (event) => {
  if (!isFullscreen) return; // только в fullscreen

  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(earth, true);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    const radius = 1; // радиус Земли
    const lat = 90 - (Math.acos(point.y / radius) * 180 / Math.PI);
    const lon = ((Math.atan2(point.z, -point.x) * 180 / Math.PI) - 180) % 360;

    document.getElementById("latitude").value = lat.toFixed(2);
    document.getElementById("longitude").value = lon.toFixed(2);
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  // Apply rotation from controls
  earth.rotation.y = controls.rotation.y
  earth.rotation.x = controls.rotation.x

  // Auto-rotate slowly when not dragging
  if (!controls.isDragging) {
    controls.rotation.y += 0.001
  }

  // Animate asteroid markers (pulsing effect)
  asteroids.forEach((marker) => {
    marker.userData.pulsePhase += 0.05
    const scale = 1 + Math.sin(marker.userData.pulsePhase) * 0.3
    marker.scale.set(scale, scale, scale)
  })

  // Rotate stars slowly
  if (stars) {
    stars.rotation.y += 0.0001
  }

  renderer.render(scene, camera)
}

// Handle window resize
function onWindowResize() {
  const container = document.getElementById("earth-model");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Fullscreen toggle
function toggleFullscreen() {
  const container = document.getElementById("earth-model");
  isFullscreen = !isFullscreen;

  if (isFullscreen) {
    container.classList.add("fullscreen");
    openPanel();
  } else {
    container.classList.remove("fullscreen");
    closePanel();
  }

  onWindowResize();
}


// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initEarth()

  // Setup fullscreen button
  const fullscreenBtn = document.getElementById("fullscreen-btn")
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", toggleFullscreen)
  }

  // ESC key to exit fullscreen
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isFullscreen) {
      toggleFullscreen()
    }
  })
})

// Export function for form integration
window.addAsteroidToEarth = addAsteroidMarker
