import QRCode from 'qrcode';
import qrIconUrl from './qr-code.svg?url';

// Module scripts are deferred, so DOM is ready when this runs
const qrInput = document.getElementById('qrInput');
const qrContainer = document.getElementById('qrContainer');
const qrCanvas = document.getElementById('qrCanvas');
const saveBtn = document.getElementById('saveBtn');
const createBtn = document.getElementById('createBtn');

// Ensure input is accessible (for PWA compatibility)
if (qrInput) {
    qrInput.setAttribute('tabindex', '0');
    
    // In PWA standalone mode, sometimes the keyboard doesn't show without explicit focus
    // Try multiple approaches to ensure keyboard appears
    qrInput.addEventListener('touchstart', () => {
        // Don't preventDefault - let native behavior work first
        // Then force focus after a short delay
        setTimeout(() => {
            qrInput.focus();
            // Don't set selection range - let user's tap position determine cursor location
        }, 100);
    }, { passive: true });
    
    qrInput.addEventListener('touchend', () => {
        // Focus on touchend to ensure keyboard appears
        // Don't preventDefault - let native tap-to-select behavior work
        qrInput.focus();
    }, { passive: true });
    
    qrInput.addEventListener('click', () => {
        qrInput.focus();
    });
}

const qrIconImg = document.querySelector('.create-btn img');
if (qrIconImg) {
    qrIconImg.src = qrIconUrl;
}

// Update version display (injected by Vite at build time)
const version = __APP_VERSION__;
const versionSpan = document.getElementById('version');
if (versionSpan) {
    versionSpan.textContent = `v${version}`;
}

let currentQRData = '';
let resizeTimeout = null;

// Handle window resize - regenerate QR code if one is displayed
window.addEventListener('resize', () => {
    // Debounce resize events to avoid regenerating too frequently
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(() => {
        if (currentQRData && !qrContainer.classList.contains('hidden')) {
            generateQRCode(currentQRData);
        }
    }, 150);
});

// Generate QR code on button click
createBtn.addEventListener('click', () => {
    const text = qrInput.value.trim();
    
    if (text) {
        generateQRCode(text);
    } else {
        hideQRCode();
    }
});

// Also allow Enter key to create QR code
qrInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createBtn.click();
    }
});

// Generate QR code
function generateQRCode(text) {
    currentQRData = text;
    
    // Calculate QR code size based on container width
    // Container respects CSS max-width (500px mobile, 600px desktop)
    const container = document.querySelector('.container');
    const containerWidth = container.offsetWidth;
    const qrSize = containerWidth;
    
    // Set canvas size to ensure square aspect ratio
    qrCanvas.width = qrSize;
    qrCanvas.height = qrSize;
    
    // Clear previous QR code
    const ctx = qrCanvas.getContext('2d');
    ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    
    // Generate new QR code
    QRCode.toCanvas(qrCanvas, text, {
        width: qrSize,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, (error) => {
        if (error) {
            console.error('Error generating QR code:', error);
            return;
        }
        
        // Show QR container
        qrContainer.classList.remove('hidden');
    });
}

// Hide QR code
function hideQRCode() {
    qrContainer.classList.add('hidden');
    currentQRData = '';
}

// Download QR code as image
saveBtn.addEventListener('click', () => {
    if (!currentQRData) return;
    
    // Convert canvas to blob and download
    qrCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bullishQR-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
});

