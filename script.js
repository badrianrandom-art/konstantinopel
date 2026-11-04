const canvas = document.getElementById('animCanvas');
const ctx = canvas.getContext('2d');
const subtitleBox = document.getElementById('subtitle-box');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let camera = { x: 0, y: 0, zoom: 1, targetZoom: 1 };
let frameCount = 0;

const storyScript = [
    { frame: 30, text: "Tahun 1453: Di bawah langit Konstantinopel..." },
    { frame: 180, text: "Sultan Mehmed II memimpin pasukan Ottoman mengepung benteng raksasa." },
    { frame: 330, text: "Meriam raksasa menghujam tembok pertahanan lapis baja kota." },
    { frame: 480, text: "Pertempuran epik sejarah pun dimulai demi sebuah takdir baru." }
];

function updateSubtitle() {
    let currentText = "";
    for (let s of storyScript) {
        if (frameCount >= s.frame) currentText = s.text;
    }
    if (subtitleBox.innerText !== currentText) {
        subtitleBox.style.opacity = 0;
        setTimeout(() => {
            subtitleBox.innerText = currentText;
            subtitleBox.style.opacity = 1;
        }, 400);
    }
}

function drawEnvironment() {
    let gradSky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradSky.addColorStop(0, '#1a0b2e');
    gradSky.addColorStop(0.5, '#5c1d24');
    gradSky.addColorStop(1, '#8f421f');
    ctx.fillStyle = gradSky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0508';
    ctx.fillRect(canvas.width * 0.6, canvas.height * 0.35, 30, canvas.height * 0.35);
    ctx.fillRect(canvas.width * 0.75, canvas.height * 0.3, 35, canvas.height * 0.4);
    
    ctx.beginPath();
    ctx.arc(canvas.width * 0.68, canvas.height * 0.4, 70, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#1c1014';
    ctx.fillRect(canvas.width * 0.5, canvas.height * 0.55, canvas.width * 0.5, canvas.height * 0.45);
    ctx.strokeStyle = '#2c1b22';
    ctx.lineWidth = 4;
    for(let i = canvas.height * 0.6; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.5, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function drawNavy() {
    ctx.fillStyle = '#080d16';
    ctx.fillRect(0, canvas.height * 0.75, canvas.width * 0.5, canvas.height * 0.25);

    ctx.fillStyle = '#26140a';
    ctx.beginPath();
    ctx.moveTo(50, canvas.height * 0.8);
    ctx.lineTo(200, canvas.height * 0.8);
    ctx.lineTo(170, canvas.height * 0.88);
    ctx.lineTo(80, canvas.height * 0.88);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#4a2c1b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(125, canvas.height * 0.8);
    ctx.lineTo(125, canvas.height * 0.65);
    ctx.stroke();

    ctx.fillStyle = '#e0ded7';
    ctx.beginPath();
    ctx.moveTo(127, canvas.height * 0.66);
    ctx.lineTo(165, canvas.height * 0.72);
    ctx.lineTo(127, canvas.height * 0.78);
    ctx.closePath();
    ctx.fill();
}

function drawSultan(x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#990000';
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.lineTo(25, 60);
    ctx.lineTo(-25, 60);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(-10, 90);
    ctx.moveTo(0, 50);
    ctx.lineTo(15, 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(-20, 35);
    ctx.moveTo(0, 20);
    ctx.lineTo(30, 15);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.ellipse(0, -8, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, -18, 12, 10);

    ctx.restore();
}

function animate() {
    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera.x = Math.sin(frameCount * 0.002) * 15;

    ctx.save();
    ctx.translate(camera.x, 0);

    drawEnvironment();
    drawNavy();

    let sultanX = canvas.width * 0.25 + Math.sin(frameCount * 0.05) * 2;
    let sultanY = canvas.height * 0.75;
    drawSultan(sultanX, sultanY);

    ctx.restore();

    updateSubtitle();
    requestAnimationFrame(animate);
}

animate();
