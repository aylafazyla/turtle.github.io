const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scaleSlider = document.getElementById("scale");
const trunkWidthSlider = document.getElementById("trunkWidth");
const depthSlider = document.getElementById("depth");
const angleSlider = document.getElementById("angle");
const randomizeButton = document.getElementById("randomize");
const cycleColorButton = document.getElementById("cycleColor");

const scaleValue = document.getElementById("scaleValue");
const trunkWidthValue = document.getElementById("trunkWidthValue");
const depthValue = document.getElementById("depthValue");
const angleValue = document.getElementById("angleValue");

let colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
let isCycling = true;
let hue = 0;

function resizeCanvas() {
  const container = document.getElementById("canvas-container");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  draw();
}

function drawTree(x, y, size, angle, depth) {
  if (depth === 0) return;

  const x1 = x + size * Math.cos(angle);
  const y1 = y - size * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x1, y1);

  if (isCycling) {
    ctx.strokeStyle = `hsl(${(hue + depth * 30) % 360}, 100%, 50%)`;
  } else {
    ctx.strokeStyle = colors[depth % colors.length];
  }

  const trunkWidth = parseInt(trunkWidthSlider.value);
  ctx.lineWidth = Math.max(
    1,
    trunkWidth * (depth / parseInt(depthSlider.value))
  );
  ctx.stroke();

  const newSize = (size * Math.sqrt(2)) / 2;
  const angleRad = (parseFloat(angleSlider.value) * Math.PI) / 180;

  drawTree(x1, y1, newSize, angle - angleRad, depth - 1);
  drawTree(x1, y1, newSize, angle + angleRad, depth - 1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const depth = parseInt(depthSlider.value);
  const scale = parseInt(scaleSlider.value);
  drawTree(canvas.width / 2, canvas.height - 50, scale, Math.PI / 2, depth);

  if (isCycling) {
    hue = (hue + 1) % 360;
    requestAnimationFrame(draw);
  }
}

function randomizeColors() {
  colors = Array(6)
    .fill()
    .map(
      () =>
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
    );
  if (!isCycling) draw();
}

function toggleCycleColor() {
  isCycling = !isCycling;
  if (isCycling) {
    cycleColorButton.textContent = "Stop Cycle";
    draw();
  } else {
    cycleColorButton.textContent = "Cycle Color";
    draw();
  }
}

function updateSliderValues() {
  scaleValue.textContent = scaleSlider.value;
  trunkWidthValue.textContent = trunkWidthSlider.value;
  depthValue.textContent = depthSlider.value;
  angleValue.textContent = angleSlider.value;
}

scaleSlider.addEventListener("input", () => {
  updateSliderValues();
  draw();
});
trunkWidthSlider.addEventListener("input", () => {
  updateSliderValues();
  draw();
});
depthSlider.addEventListener("input", () => {
  updateSliderValues();
  draw();
});
angleSlider.addEventListener("input", () => {
  updateSliderValues();
  draw();
});
randomizeButton.addEventListener("click", randomizeColors);
cycleColorButton.addEventListener("click", toggleCycleColor);

window.addEventListener("resize", resizeCanvas);

updateSliderValues();
resizeCanvas();
