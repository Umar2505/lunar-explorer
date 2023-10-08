// New scene
const scene = new THREE.Scene();

// New camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// New renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Create the moon's geometry
const moonGeometry = new THREE.SphereGeometry(1, 32, 32);

// Load the moon's texture (you'll need to download a moon texture)
const textureLoader = new THREE.TextureLoader();
const moonTexture = textureLoader.load('/static/moon_globe/textures/moon_texture.jpg');
moonTexture.format = THREE.RGBAFormat;
moonTexture.magFilter = THREE.NearestFilter;
// Create the moon's material with the texture
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });

// Create the moon mesh
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.scale.set(7, 7, 7);

// Add the moon to the scene
scene.add(moon);

moon.position.set(0, 0, -10);

// Convert latitude and longitude to 3D coordinates
function convertLatLonToPosition(latitude, longitude) {
    const latRad = THREE.Math.degToRad(latitude);
    const lonRad = THREE.Math.degToRad(longitude);

    const moonRadius = 1;
    const x = moonRadius * Math.cos(latRad) * Math.sin(lonRad);
    const y = moonRadius * Math.sin(latRad);
    const z = moonRadius * Math.cos(latRad) * Math.cos(lonRad);

    return new THREE.Vector3(x, y, z);
}


// Create an array of seismometer positions with names
const seismometerPositions = [
    { name: "Apollo 11", latitude: 0.67322, longitude: 23.47315 },
    { name: "Apollo 12", latitude: -3.0099, longitude: 336.5752 },
    // Add positions and names for all Apollo seismometers
    { name: "Apollo 14", latitude: -3.64408, longitude: 342.52233 },
    { name: "Apollo 15", latitude: 26.13411, longitude: 3.62980 },
    { name: "Apollo 16", latitude: -8.9759, longitude: 15.4986 },
    { name: "Apollo 17", latitude: 20.19209, longitude: 30.76492 },
    // Add more positions and names for additional seismometers
];

// Create a group to hold the seismometer markers
const seismometerGroup = new THREE.Group();
moon.add(seismometerGroup);

// Create an array to hold the seismometer marker objects
const seismometerMarkers = [];
const seismometerLabels = []; // Declare the seismometerLabels array

// Function to update label's 2D position
function updateLabels() {
    for (let i = 0; i < seismometerMarkers.length; i++) {
        const marker = seismometerMarkers[i];
        const label = seismometerLabels[i];

        const markerPosition = marker.getWorldPosition(new THREE.Vector3());

        // Calculate the vector from the moon to the marker
        const moonToMarker = markerPosition.clone().sub(moon.position);

        // Calculate the dot product between the moon's position vector and moonToMarker
        const dotProduct = moonToMarker.dot(moon.position);

        // If the dot product is positive, the marker is in front of the moon, so show the label
        if (dotProduct < 0) {
            const screenPosition = markerPosition.clone();
            screenPosition.project(camera);
            const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-screenPosition.y * 0.5 + 0.5) * window.innerHeight - 10; // Adjust the label's vertical position

            label.style.left = x + 'px';
            label.style.top = y + 'px';
            label.style.display = 'block'; // Show label
        } else {
            // The marker is behind the moon, hide the label
            label.style.display = 'none';
        }
    }
}


// Create and add seismometer markers with labels to the moon for each position
for (const position of seismometerPositions) {
    const { name, latitude, longitude } = position;

    // Create the seismometer marker
    const markerGeometry = new THREE.SphereGeometry(0.01);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: "red" });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

    // Convert the latitude and longitude to 3D position
    const markerPosition = convertLatLonToPosition(latitude, longitude);

    // Apply the moon's rotation to the marker's position
    markerPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), moon.rotation.y);

    // Set the marker's position relative to the moon
    marker.position.copy(markerPosition);

    // Add the marker to the group and scene
    seismometerGroup.add(marker);

    // Create a label for the seismometer using HTML
    const label = document.createElement('div');
    label.className = 'seismometer-label';
    label.textContent = name; // Name of the seismometer

    // Append label to the document
    document.body.appendChild(label);

    // Store the marker and label for later use
    seismometerMarkers.push(marker);
    seismometerLabels.push(label);
}

function animate() {
    // Rotate the moon at a slower speed
    moon.rotation.y += 0.0005;

    // Update label positions
    updateLabels();

    // Render the scene
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
animate();

// Add a label container to the document
const labelContainer = document.createElement('div');
labelContainer.id = 'label-container';
document.body.appendChild(labelContainer);

