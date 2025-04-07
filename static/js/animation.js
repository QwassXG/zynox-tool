/**
 * 3D Animation
 * Creates the 3D animated background using Three.js
 */

class BackgroundAnimation {
    constructor() {
        this.container = document.getElementById('canvas-container');
        // If container doesn't exist, exit early
        if (!this.container) {
            console.log('Canvas container not found, skipping animation');
            return;
        }
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        
        this.init();
    }
    
    init() {
        // Check if container exists
        if (!this.container) return;
        
        // Setup scene
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 30;
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Create particles
        this.createParticles();
        
        // Add light
        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);
        
        const directionalLight = new THREE.DirectionalLight(0x5865F2, 1);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
        
        // Setup event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Start animation loop
        this.animate();
    }
    
    createParticles() {
        // Create particles
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [
            new THREE.Color(0x5865F2), // discord blue
            new THREE.Color(0xEB459E), // neon pink
            new THREE.Color(0x57F287)  // discord green
        ];
        
        for (let i = 0; i < particleCount; i++) {
            // Random position within a sphere
            const r = Math.random() * 50 + 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            vertices.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        // Create materials
        const materials = [
            new THREE.PointsMaterial({
                size: 0.5,
                color: colors[0],
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            }),
            new THREE.PointsMaterial({
                size: 0.7,
                color: colors[1],
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            }),
            new THREE.PointsMaterial({
                size: 0.3,
                color: colors[2],
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
            })
        ];
        
        // Create multiple particle systems
        this.particles = [];
        
        for (let i = 0; i < 3; i++) {
            const particles = new THREE.Points(geometry.clone(), materials[i]);
            particles.rotation.x = Math.random() * Math.PI;
            particles.rotation.y = Math.random() * Math.PI;
            particles.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.002,
                    y: (Math.random() - 0.5) * 0.002,
                    z: (Math.random() - 0.5) * 0.002
                }
            };
            this.scene.add(particles);
            this.particles.push(particles);
        }
        
        // Add some glowing spheres
        const sphereCount = 5;
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        
        for (let i = 0; i < sphereCount; i++) {
            const colorIndex = i % colors.length;
            const material = new THREE.MeshPhongMaterial({
                color: colors[colorIndex],
                emissive: colors[colorIndex],
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.7,
                shininess: 100
            });
            
            const sphere = new THREE.Mesh(sphereGeometry, material);
            const r = Math.random() * 30 + 15;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            sphere.position.x = r * Math.sin(phi) * Math.cos(theta);
            sphere.position.y = r * Math.sin(phi) * Math.sin(theta);
            sphere.position.z = r * Math.cos(phi);
            
            sphere.scale.set(
                Math.random() * 1.5 + 0.5,
                Math.random() * 1.5 + 0.5,
                Math.random() * 1.5 + 0.5
            );
            
            sphere.userData = {
                originalPosition: sphere.position.clone(),
                speed: Math.random() * 0.01 + 0.005,
                amplitude: Math.random() * 5 + 3,
                offset: Math.random() * Math.PI * 2
            };
            
            this.scene.add(sphere);
        }
    }
    
    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    }
    
    onMouseMove(event) {
        this.mouseX = (event.clientX / this.width) * 2 - 1;
        this.mouseY = -(event.clientY / this.height) * 2 + 1;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate particle systems
        this.particles.forEach(particles => {
            particles.rotation.x += particles.userData.rotationSpeed.x;
            particles.rotation.y += particles.userData.rotationSpeed.y;
            particles.rotation.z += particles.userData.rotationSpeed.z;
        });
        
        // Move camera slightly based on mouse position
        this.camera.position.x += (this.mouseX * 10 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouseY * 10 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // Animate spheres
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.userData.originalPosition) {
                const time = Date.now() * 0.001;
                const { originalPosition, speed, amplitude, offset } = child.userData;
                
                child.position.x = originalPosition.x + Math.sin(time * speed + offset) * amplitude;
                child.position.y = originalPosition.y + Math.cos(time * speed + offset) * amplitude;
                child.position.z = originalPosition.z + Math.sin(time * speed * 1.5 + offset) * amplitude * 0.5;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize background animation when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new BackgroundAnimation();
    } catch (error) {
        console.error('Error initializing background animation:', error);
    }
});
