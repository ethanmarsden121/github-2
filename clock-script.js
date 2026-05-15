// ============================================
// UPDATE DIGITAL CLOCK EVERY SECOND
// ============================================

function updateClocks() {
    const now = new Date();

    // Time zones with their UTC offsets
    const timezones = {
        'clock-ny': 'America/New_York',
        'clock-london': 'Europe/London',
        'clock-tokyo': 'Asia/Tokyo',
        'clock-sydney': 'Australia/Sydney',
        'clock-dubai': 'Asia/Dubai',
        'clock-la': 'America/Los_Angeles'
    };

    // Update each timezone clock
    Object.entries(timezones).forEach(([elementId, timezone]) => {
        const timeString = now.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: timezone
        });

        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = timeString;
        }
    });

    // Update local clock
    const localTimeString = now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const localElement = document.getElementById('local-clock');
    if (localElement) {
        localElement.textContent = localTimeString;
    }
}

// ============================================
// INITIAL UPDATE AND SET INTERVAL
// ============================================

// Update immediately on page load
updateClocks();

// Update every second
setInterval(updateClocks, 1000);

// ============================================
// OPTIMIZE FOR BACKGROUND TABS
// ============================================

let animationId;

function animate() {
    updateClocks();
    animationId = requestAnimationFrame(animate);
}

// Pause animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animate();
        updateClocks(); // Update immediately when tab becomes visible
    }
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('🕐 Digital Clock with Multiple Time Zones loaded!');
console.log('Supported timezones: New York, London, Tokyo, Sydney, Dubai, Los Angeles');
