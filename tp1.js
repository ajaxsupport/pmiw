const ESTADO_CORRER        = 0;
const ESTADO_SALTAR        = 1;
const ESTADO_SERIO         = 2;
const ESTADO_ENOJADO       = 3;
const ESTADO_POSE          = 4;
const ESTADO_CORRER_VOLVER = 5;

let estadoActual;

let fondo;
let animCorrer  = new Array(2);
let animSaltar  = new Array(1);
let animSerio   = new Array(1);
let animEnojado = new Array(1);
let animPose    = new Array(1);

let contadorTiempo = 0;
let velocidadAnimacion = 10;
let posX, posY;
let posYBase = 380;
let anchoSprite = 150;
let altoSprite = 150;

function preload() {
  fondo = loadImage("assets/fondo.png");
  
  for (let i = 0; i < animCorrer.length; i++) {
    animCorrer[i] = loadImage("assets/tartagliacorrer" + i + ".png");
  }
  
  for (let i = 0; i < animSaltar.length; i++) {
    animSaltar[i] = loadImage("assets/tartagliasaltar.png");
  }
  for (let i = 0; i < animSerio.length; i++) {
    animSerio[i] = loadImage("assets/tartagliaserio.png");
  }
  for (let i = 0; i < animEnojado.length; i++) {
    animEnojado[i] = loadImage("assets/tartagliaenojado.png");
  }
  for (let i = 0; i < animPose.length; i++) {
    animPose[i] = loadImage("assets/tartagliapose.png");
  }
}

function setup() {
  createCanvas(800, 600);
  reiniciarEscena();
}

function draw() {
  image(fondo, 0, 0, width, height);
  contadorTiempo++;
  
  switch (estadoActual) {
    
    case ESTADO_CORRER:
      posX -= 3;
      dibujarAnimacion(animCorrer, posX, posY, anchoSprite, altoSprite, true);
      if (posX <= 350) {
        cambiarEstado(ESTADO_SALTAR);
      }
      break;
      
    case ESTADO_SALTAR:
      if (contadorTiempo < 40) {
        posY = posYBase - sin(radians(contadorTiempo * 4.5)) * 100;
      } else {
        posY = posYBase;
        cambiarEstado(ESTADO_SERIO);
      }
      dibujarAnimacion(animSaltar, posX, posY, anchoSprite, altoSprite, true);
      break;
      
    case ESTADO_SERIO:
      dibujarAnimacion(animSerio, posX, posY, anchoSprite, altoSprite, true);
      if (contadorTiempo > 40) {
        cambiarEstado(ESTADO_ENOJADO);
      }
      break;
      
    case ESTADO_ENOJADO:
      dibujarAnimacion(animEnojado, posX, posY, anchoSprite, altoSprite, true);
      break;
      
    case ESTADO_POSE:
      dibujarAnimacion(animPose, posX, posY, anchoSprite, altoSprite, true);
      if (contadorTiempo > 30) { 
        cambiarEstado(ESTADO_CORRER_VOLVER);
      }
      break;

    case ESTADO_CORRER_VOLVER:
      posX += 5;
      dibujarAnimacion(animCorrer, posX, posY, anchoSprite, altoSprite, false);
      break;
  }
}

function mousePressed() {
  if (estadoActual === ESTADO_ENOJADO || estadoActual === ESTADO_SERIO) {
    cambiarEstado(ESTADO_POSE);
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    reiniciarEscena();
  }
}

function dibujarAnimacion(frames, x, y, ancho, alto, espejar) {
  let indice = obtenerFrameActual(frames.length);
  
  push();
  if (espejar) {
    translate(x + ancho, y);
    scale(-1, 1);
    image(frames[indice], 0, 0, ancho, alto);
  } else {
    image(frames[indice], x, y, ancho, alto);
  }
  pop();
}

function cambiarEstado(nuevoEstado) {
  estadoActual = nuevoEstado;
  contadorTiempo = 0;
}

function obtenerFrameActual(totalFrames) {
  return floor(contadorTiempo / velocidadAnimacion) % totalFrames;
}

function reiniciarEscena() {
  posX = 750;
  posY = posYBase;
  cambiarEstado(ESTADO_CORRER);
}
