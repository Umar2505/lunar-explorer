window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaMouse = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        moon.rotation.x += deltaMouse.y * 0.00005;
        moon.rotation.y += deltaMouse.x * 0.00005;
        // Apply the moon's rotation to the marker's position
        markerPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), moon.rotation.y);

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            camera.position.z -= 1;
            break;
        case 'ArrowDown':
            camera.position.z += 1;
            break;
        case 'ArrowLeft':
            moon.position.x -= 1;
            break;
        case 'ArrowRight':
            moon.position.x += 1;
            break;
        default:
            break;
    }
});