function initThreeJS(elementId) {
  const container = document.getElementById(elementId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(container.clientWidth, container.clientWidth);
  container.appendChild(renderer.domElement);

  const shape = new THREE.Shape();
  const width = 2.5;
  const height = 2.5;
  const radius = 0.2;

  shape.moveTo(-width / 2 + radius, -height / 2);
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
  shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    bevelEnabled: false
  });

  const material = new THREE.MeshPhongMaterial({ color: 0xFF90BC, wireframe: false });
  const roundedRect = new THREE.Mesh(geometry, material);
  scene.add(roundedRect);

  const light = new THREE.PointLight(0xF9F9E0, 1, 100);
  light.position.set(0, 0, 10);
  scene.add(light);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    roundedRect.rotation.x += 0.005;
    roundedRect.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  animate();

  return renderer;
}

const renderers = [];

const items = ['Manicure', 'Pedicure', 'Nail Art', 'Gel Polish', 'Acrylics'];

for (let i = 1; i <= items.length; i++) {
  renderers.push(initThreeJS(`cad${i}`, items[i-1]));
}

function updateRendererSizes() {
  for (let i = 0; i < renderers.length; i++) {
    const container = document.getElementById(`cad${i + 1}`);
    const renderer = renderers[i];
    const canvas = renderer.domElement;
    const width = container.clientWidth;
    const height = container.clientWidth;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
  }
}


function loadGallery() {
  const urlParams = new URLSearchParams(window.location.search);
  const gallery = urlParams.get('gallery') || 'manicure';
  
  fetch(`galleries/${gallery}.json`)
      .then(response => response.json())
      .then(data => {
          document.getElementById('gallery-title').textContent = data.title;
          const galleryContainer = document.getElementById('gallery');
          galleryContainer.innerHTML = '';
          
          data.images.forEach(image => {
              const galleryItem = document.createElement('div');
              galleryItem.className = 'gallery-item';
              
              const img = document.createElement('img');
              img.src = image.src;
              img.alt = image.description;
              
              const description = document.createElement('p');
              description.textContent = image.description;
              
              galleryItem.appendChild(img);
              galleryItem.appendChild(description);
              galleryContainer.appendChild(galleryItem);
          });
      })
      .catch(error => {
          console.error('Error loading gallery:', error);
          document.getElementById('gallery').innerHTML = '<p>Error loading gallery. Please try again later.</p>';
      });
}


window.addEventListener('resize', updateRendererSizes);

updateRendererSizes();

function toggleNav() {
  const nav = document.getElementById("side-nav");
  const navButton = document.querySelector(".nav-button");
  if (nav.style.width === "250px") {
    nav.style.width = "0";
    navButton.innerHTML = "☰ Menu";
  } else {
    nav.style.width = "250px";
    navButton.innerHTML = "✕ Close";
  }
}