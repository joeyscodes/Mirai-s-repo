/* ================================================
   MIRAI – 3D TORII GATE & PARTICLE FLOW
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Loader
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => { setTimeout(() => { loader.classList.add('hidden'); document.body.style.overflow = ''; }, 600); });
    document.body.style.overflow = 'hidden';
  }

  // Navbar & Mobile
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const hero = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) navbar.classList.remove('scrolled'); else navbar.classList.add('scrolled'); }); }, { threshold: 0 });
    if (hero) observer.observe(hero); else navbar.classList.add('scrolled');
  }
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('active')));
  }

  // Scroll Reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // Form
  const form = document.getElementById('reservationForm');
  const confirmMsg = document.getElementById('confirmationMsg');
  if (form && confirmMsg) {
    form.addEventListener('submit', (e) => { e.preventDefault(); form.style.display = 'none'; confirmMsg.style.display = 'block'; confirmMsg.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  }

  // THREE.JS HERO
  const canvas = document.getElementById('hero-canvas');
  if (canvas && window.innerWidth > 768 && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030b17);
    scene.fog = new THREE.Fog(0x030b17, 5, 25);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.8, 7.2);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Lights
    scene.add(new THREE.AmbientLight(0x1a2b4c));
    const spotLight = new THREE.SpotLight(0x3b82f6, 0.8, 20, Math.PI/4);
    spotLight.position.set(2, 5, 4);
    spotLight.castShadow = true;
    scene.add(spotLight);
    const backLight = new THREE.PointLight(0x0f2b5c, 0.5);
    backLight.position.set(-2, 1, -3);
    scene.add(backLight);

    // Reflective Floor
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x030b17, roughness: 0.3, metalness: 0.9 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), floorMat);
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -0.8;
    floor.receiveShadow = true;
    scene.add(floor);

    // 3D Torii Gate
    const gateGroup = new THREE.Group();
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xe8111d, roughness: 0.3, metalness: 0.5, emissive: new THREE.Color(0x330000) });
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.9, emissive: new THREE.Color(0x010101) });

    const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 0.35), pillarMat);
    pillarL.position.set(-1.6, 0.9, 0);
    pillarL.castShadow = true; pillarL.receiveShadow = true;
    gateGroup.add(pillarL);
    const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 0.35), pillarMat);
    pillarR.position.set(1.6, 0.9, 0);
    pillarR.castShadow = true; pillarR.receiveShadow = true;
    gateGroup.add(pillarR);
    
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 0.6), beamMat);
    topBeam.position.set(0, 2.65, 0);
    topBeam.castShadow = true; topBeam.receiveShadow = true;
    gateGroup.add(topBeam);
    const secBeam = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.25, 0.5), beamMat);
    secBeam.position.set(0, 2.2, 0);
    secBeam.castShadow = true;
    gateGroup.add(secBeam);

    gateGroup.position.set(0, -0.3, 0);
    scene.add(gateGroup);

    // Floating Blue Particle Flow (The "Vibes")
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3.5 + Math.random() * 4.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.7;
      const y = Math.random() * 5 - 1;
      
      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;
      
      colors[i*3] = 0.2;    // R
      colors[i*3+1] = 0.5;  // G
      colors[i*3+2] = 1.0;  // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8
    });
    
    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.0005;
      
      // Rotate gate slowly
      gateGroup.rotation.y += 0.001;
      
      // Animate particle positions in a flowing river manner
      const positionsArr = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positionsArr[i3];
        const y = positionsArr[i3+1];
        const z = positionsArr[i3+2];
        
        // Flow forward along the ring
        positionsArr[i3+1] += Math.sin(x + time) * 0.01;
        positionsArr[i3] += Math.cos(z + time) * 0.005;
        positionsArr[i3+2] += Math.sin(y + time) * 0.008;
        
        // Reset if out of bounds
        if (Math.abs(positionsArr[i3+1]) > 4.5) positionsArr[i3+1] *= -0.9;
        if (Math.abs(positionsArr[i3]) > 5.5) positionsArr[i3] *= -0.9;
        if (Math.abs(positionsArr[i3+2]) > 4.5) positionsArr[i3+2] *= -0.9;
      }
      geometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        renderer.setSize(0, 0);
      } else {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }
});
