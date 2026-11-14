//https://youtu.be/zKHmT_uJnEU?si=oF7uICrVB5dEY5Sg mi video :3
class cositas {
  constructor() {
    this.fondo = null;
    this.izq = [];
    this.der = [];
    this.bueno1 = null;
    this.bueno2 = null;
    this.malo1 = null;
    this.malo2 = null;
    this.malo3 = null;
    this.sonidoAmbiente = null;
    this.sonidoSip = null;
    this.sonidoNop = null;
  }
}

class Personaje {
  constructor(x, y, cositas) {
    this.x = x;
    this.y = y;
    this.w = 65;  
    this.h = 95; 
    this.vel = 6;
    this.cositas = cositas;
    this.dir = "derecha";
    this.frame = 0;
    this.moviendo = false;
  }
  
  actualizar() {
    this.moviendo = false;
    
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65) || keyIsDown(97)) {
      this.x -= this.vel;
      this.dir = "izquierda";
      this.moviendo = true;
    }
    
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) || keyIsDown(100)) {
      this.x += this.vel;
      this.dir = "derecha";
      this.moviendo = true;
    }
    
    this.x = constrain(this.x, 10, width - this.w - 10);
    
    if (this.moviendo) {
      if (frameCount % 8 === 0) {
        this.frame = (this.frame + 1) % 3;
      }
    } else {
      this.frame = 0;
    }
  }
  
  dibujar() {
    push();
    imageMode(CORNER);
    
    let actual = null;
    
    if (this.dir === "izquierda") {
      if (this.cositas.izq.length > this.frame) {
        actual = this.cositas.izq[this.frame];
      }
    } else {
      if (this.cositas.der.length > this.frame) {
        actual = this.cositas.der[this.frame];
      }
    }
    
    if (actual && actual.width > 0) {
      image(actual, this.x, this.y, this.w, this.h);
    } else {
      fill(243, 213, 182);
      stroke(44, 62, 80);
      rect(this.x, this.y, this.w, this.h, 6);
    }
    
    pop();
  }
}

class Item {
  constructor(cositas) {
    this.cositas = cositas;
    this.reiniciar();
  }
  
  reiniciar() {
    this.tamano = 45;
    this.x = random(40, width - 40);
    this.y = random(-400, -50);
    this.vel = random(2.5, 4.0);
    this.esBueno = random(1) > 0.4;
    
    if (this.esBueno) {
      this.tipo = int(random(1, 3)); 
    } else {
      this.tipo = int(random(1, 4)); 
    }
  }
  
  mover() {
    this.y += this.vel;
    if (this.y > height + 40) {
      this.reiniciar();
    }
  }
  
  dibujar() {
    push();
    imageMode(CENTER);
    
    let img = null;
    
    if (this.esBueno) {
      if (this.tipo === 1) img = this.cositas.bueno1;
      else if (this.tipo === 2) img = this.cositas.bueno2;
    } else {
      if (this.tipo === 1) img = this.cositas.malo1;
      else if (this.tipo === 2) img = this.cositas.malo2;
      else if (this.tipo === 3) img = this.cositas.malo3;
    }
    
    if (img && img.width > 0) {
      image(img, this.x, this.y, this.tamano, this.tamano);
    } else {
      if (this.esBueno) fill(39, 174, 96);
      else fill(231, 76, 60);
      noStroke();
      ellipse(this.x, this.y, this.tamano, this.tamano);
    }
    
    pop();
  }
  
  colisiona(jugador) {
    let d = dist(this.x, this.y, jugador.x + jugador.w / 2, jugador.y + jugador.h / 2);
    return d < (this.tamano / 2 + 18);
  }
}

class Juego {
  constructor(cositas) {
    this.cositas = cositas;
    this.jugador = new Personaje(width / 2 - 30, height - 120, this.cositas);
    
    this.items = [];
    for (let i = 0; i < 5; i++) {
      this.items.push(new Item(this.cositas));
    }
    
    this.puntos = 0;
    this.vidas = 3;
    this.tiempoMax = 30;
    this.tiempoInicio = 0;
    this.estado = 0; 
  }
  
  loop() {
    if (this.estado === 0) {
      this.pantallaInicio();
    } else if (this.estado === 1) {
      this.pantallaJuego();
    } else if (this.estado === 2) {
      this.pantallaDerrota();
    } else if (this.estado === 3) {
      this.pantallaVictoria();
    } else if (this.estado === 4) {
      this.pantallaCreditos();
    }
  }
  
  pantallaInicio() {
    if (this.cositas.sonidoAmbiente && this.cositas.sonidoAmbiente.isPlaying()) {
      this.cositas.sonidoAmbiente.stop();
    }

    background(255, 182, 193);
    
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(33);
    textStyle(BOLD);
    text("¡LLEGA EL PROFESOR!", width / 2 + 2, 72);
    fill(255);
    text("¡LLEGA EL PROFESOR!", width / 2, 70);
    textStyle(NORMAL);
    
    fill(20, 20, 20, 200);
    noStroke();
    rect(80, 100, 640, 180, 10);
    
    fill(255);
    textSize(14);
    textAlign(LEFT, TOP);
    text("• Movete con flechas izq / der o las teclas A y D.", 110, 125);
    text("• Agarrá mates y apuntes (necesitás 10 para hacerte amiga).", 110, 155);
    text("• Evitá las redes sociales y chats (tenés 3 vidas).", 110, 185);
    text("• Tenés 30 segundos antes de que entre el profesor.", 110, 215);
    
    crearBoton(290, 310, 220, 40, "Comenzar");
    
    fill(50, 50, 50);
    textSize(13);
    textAlign(CENTER, CENTER);
    text("Créditos: Leguizamon Lucrecia y Rodriguez Paez Abigail", width / 2, 380);
  }
  
  pantallaJuego() {
    if (this.cositas.sonidoAmbiente && !this.cositas.sonidoAmbiente.isPlaying()) {
      this.cositas.sonidoAmbiente.loop();
    }

    if (this.cositas.fondo && this.cositas.fondo.width > 0) {
      image(this.cositas.fondo, 0, 0, width, height);
      fill(255, 182, 193, 70);
      rect(0, 0, width, height);
    } else {
      background(255, 192, 203);
    }
    
    fill(220, 140, 160);
    noStroke();
    rect(0, height - 50, width, 50);
    
    let transcurrido = (millis() - this.tiempoInicio) / 1000;
    let restante = max(0, ceil(this.tiempoMax - transcurrido));
    
    if (restante === 0) {
      if (this.cositas.sonidoAmbiente && this.cositas.sonidoAmbiente.isPlaying()) {
        this.cositas.sonidoAmbiente.stop();
      }
      if (this.puntos >= 10) {
        this.estado = 3;
      } else {
        this.estado = 2;
      }
    }
    
    this.jugador.actualizar();
    this.jugador.dibujar();
    
    for (let i = 0; i < this.items.length; i++) {
      let obj = this.items[i];
      obj.mover();
      obj.dibujar();
      
      if (obj.colisiona(this.jugador)) {
        if (obj.esBueno) {
          this.puntos++;
          if (this.cositas.sonidoSip) {
            this.cositas.sonidoSip.play();
          }
          obj.reiniciar();
          
          if (this.puntos >= 10) {
            if (this.cositas.sonidoAmbiente && this.cositas.sonidoAmbiente.isPlaying()) {
              this.cositas.sonidoAmbiente.stop();
            }
            this.estado = 3;
          }
        } else {
          // Sonido de error disparado instantáneamente al colisionar
          if (this.cositas.sonidoNop) {
            this.cositas.sonidoNop.play();
          }
          this.vidas--;
          obj.reiniciar();
          if (this.vidas <= 0) {
            if (this.cositas.sonidoAmbiente && this.cositas.sonidoAmbiente.isPlaying()) {
              this.cositas.sonidoAmbiente.stop();
            }
            this.estado = 2;
          }
        }
      }
    }
    
    fill(15, 15, 15, 230);
    noStroke();
    rect(15, 12, width - 30, 42, 8);
    
    fill(255);
    textSize(15);
    textAlign(LEFT, CENTER);
    text("Puntos: " + this.puntos + " / 10", 35, 33);
    textAlign(CENTER, CENTER);
    text("Tiempo: " + restante + "s", width / 2, 33);
    textAlign(RIGHT, CENTER);
    text("Vidas: " + "❤️ ".repeat(this.vidas), width - 35, 33);
  }
  
  pantallaDerrota() {
    if (this.cositas.sonidoAmbiente && this.cositas.sonidoAmbiente.isPlaying()) {
      this.cositas.sonidoAmbiente.stop();
    }

    background(255, 182, 193);
    
    fill(0);
    textSize(35);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("¡LLEGÓ EL PROFESOR Y SE ODIAN!", width / 2 + 2, height / 2 - 52);
    fill(255);
    text("¡LLEGÓ EL PROFESOR Y SE ODIAN!", width / 2, height / 2 - 54);
    textStyle(NORMAL);
    
    fill(30, 30, 30);
    textSize(16);
    text("No alcanzaste a ordenar o te quedaste sin vidas.", width / 2, height / 2 - 10);
    
    crearBoton(width / 2 - 230, height / 2 + 35, 210, 40, "Jugar de nuevo");
    crearBoton(width / 2 + 20, height / 2 + 35, 210, 40, "Créditos");
  }
  
  pantallaVictoria() {
    if (this.cositas.sonidoAmbiente && this.cositas.sonidoAmbiente.isPlaying()) {
      this.cositas.sonidoAmbiente.stop();
    }

    background(255, 182, 193);
    
    fill(0);
    textSize(35);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("¡SE HICIERON AMIGAS CON ÉXITO!", width / 2 + 2, height / 2 - 52);
    fill(255);
    text("¡SE HICIERON AMIGAS CON ÉXITO!", width / 2, height / 2 - 54);
    textStyle(NORMAL);
    
    fill(30, 30, 30);
    textSize(16);
    text("¡Salvaron el primer día de facultad juntas!", width / 2, height / 2 - 10);
    
    crearBoton(width / 2 - 230, height / 2 + 35, 210, 40, "Jugar de nuevo");
    crearBoton(width / 2 + 20, height / 2 + 35, 210, 40, "Créditos");
  }

  pantallaCreditos() {
    if (this.cositas.sonidoAmbiente && this.cositas.sonidoAmbiente.isPlaying()) {
      this.cositas.sonidoAmbiente.stop();
    }

    background(255, 182, 193);
    
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("CRÉDITOS", width / 2 + 2, 72);
    fill(255);
    text("CRÉDITOS", width / 2, 70);
    textStyle(NORMAL);
    
    fill(20, 20, 20, 200);
    noStroke();
    rect(150, 110, 500, 180, 10);
    
    fill(255);
    textSize(18);
    textStyle(BOLD);
    text("Lucrecia Leguizamon", width / 2, 160);
    text("Abigail Rodriguez Paez", width / 2, 210);
    textStyle(NORMAL);
    
    textSize(14);
    fill(220, 220, 220);
    text("Materia: PMIW", width / 2, 250);
    
    crearBoton(width / 2 - 110, 320, 220, 40, "Volver al inicio");
  }
  
  clicRaton() {
    if (this.estado === 0) {
      if (mouseX > 290 && mouseX < 510 && mouseY > 310 && mouseY < 350) {
        this.estado = 1;
        this.tiempoInicio = millis();
      }
    } else if (this.estado === 2 || this.estado === 3) {
      if (mouseX > width / 2 - 230 && mouseX < width / 2 - 20 && mouseY > height / 2 + 35 && mouseY < height / 2 + 75) {
        this.reiniciar();
      }
      if (mouseX > width / 2 + 20 && mouseX < width / 2 + 230 && mouseY > height / 2 + 35 && mouseY < height / 2 + 75) {
        this.estado = 4;
      }
    } else if (this.estado === 4) {
      if (mouseX > width / 2 - 110 && mouseX < width / 2 + 110 && mouseY > 320 && mouseY < 360) {
        this.estado = 0;
      }
    }
  }

  teclaPresionada() {
    if ((this.estado === 2 || this.estado === 3) && (key === 'r' || key === 'R')) {
      this.reiniciar();
    } else if (this.estado === 0 && keyCode === ENTER) {
      this.estado = 1;
      this.tiempoInicio = millis();
    }
  }
  
  reiniciar() {
    this.puntos = 0;
    this.vidas = 3;
    this.estado = 1;
    this.tiempoInicio = millis();
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].reiniciar();
    }
  }
}

function crearBoton(x, y, w, h, texto) {
  let hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  noStroke();
  
  if (hover) {
    fill(60, 60, 60);
  } else {
    fill(15, 15, 15);
  }
  
  rect(x, y, w, h, 8);
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(texto, x + w / 2, y + h / 2);
  textStyle(NORMAL);
}

let juego;
let misCositas;

function preload() {
  misCositas = new cositas();
  
  misCositas.fondo = loadImage("data/fondo1.jpg");
  
  misCositas.izq[0] = loadImage("data/izquierda1.png");
  misCositas.izq[1] = loadImage("data/izquierda2.png");
  misCositas.izq[2] = loadImage("data/izquierda3.png");
  
  misCositas.der[0] = loadImage("data/derecha1.png");
  misCositas.der[1] = loadImage("data/derecha2.png");
  misCositas.der[2] = loadImage("data/derecha3.png");
  
  misCositas.bueno1 = loadImage("data/bueno1.png");
  misCositas.bueno2 = loadImage("data/bueno2.png");
  
  misCositas.malo1 = loadImage("data/malo1.png");
  misCositas.malo2 = loadImage("data/malo2.png");
  misCositas.malo3 = loadImage("data/malo3.png");

  misCositas.sonidoAmbiente = loadSound("data/muchagente.mp3");
  misCositas.sonidoSip = loadSound("data/sip.mp3");
  misCositas.sonidoNop = loadSound("data/nop.mp3");
}

function setup() {
  createCanvas(800, 400);
  textFont("Trebuchet MS");
  juego = new Juego(misCositas);
}

function draw() {
  juego.loop();
}

function mousePressed() {
  if (typeof userStartAudio === "function") {
    userStartAudio();
  }
  juego.clicRaton();
}

function keyPressed() {
  juego.teclaPresionada();
}
