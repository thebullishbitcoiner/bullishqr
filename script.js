import QRCode from 'qrcode';

const qrInput = document.getElementById('qrInput');
const qrContainer = document.getElementById('qrContainer');
const qrCanvas = document.getElementById('qrCanvas');
const saveBtn = document.getElementById('saveBtn');
const createBtn = document.getElementById('createBtn');

// Update version display (injected by Vite at build time)
const version = __APP_VERSION__;
const versionSpan = document.getElementById('version');
if (versionSpan) {
    versionSpan.textContent = `v${version}`;
}

let currentQRData = '';

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
    
    // Clear previous QR code
    const ctx = qrCanvas.getContext('2d');
    ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    
    // Generate new QR code
    QRCode.toCanvas(qrCanvas, text, {
        width: 300,
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

