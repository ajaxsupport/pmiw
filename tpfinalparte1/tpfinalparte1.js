// link de mi video :D https://youtu.be/ZkNFFMpBkG4?si=2CnzmHyfO8833fx6

let pantalla = "inicio", ancho = 800, alto = 450, creditosY = 0;
let portada, fondoChat, audioFondo, frameLibro = 0;
let libro = [], chat = [], historia = {}, imgs = [];

function preload() {
  portada = loadImage("data/imagenportada.jpg");
  fondoChat = loadImage("data/fondo.jpg");
  audioFondo = loadSound("data/personas.mp3");

  libro[0] = loadImage("data/libro_cerrado1.png");
  libro[1] = loadImage("data/libro_abierto1.png");
  libro[2] = loadImage("data/libro_abierto2.png");
  libro[3] = loadImage("data/libro_cerrado2.png");

  imgs[0] = loadImage("data/meme_profe.jpg");
}

function setup() {
  createCanvas(ancho, alto);
  textFont("Trebuchet MS");
  crearGraficosExtras();
  armarHistoria();
}

function draw() {
  if (pantalla == "inicio") {
    dibujarInicio();
  } else if (pantalla == "creditos") {
    dibujarCreditos();
  } else {
    dibujarJuego(pantalla);
  }
}

function mousePressed() {
  if (typeof userStartAudio === "function") {
    userStartAudio();
  }

  if (pantalla == "inicio") {
    if (mouseX > 290 && mouseX < 510 && mouseY > 300 && mouseY < 336) {
      if (audioFondo && !audioFondo.isPlaying()) {
        audioFondo.loop();
      }
      cambiarNodo(0);
    }
  } else if (pantalla == "creditos") {
    if (mouseX > 280 && mouseX < 520 && mouseY > 380 && mouseY < 420) {
      pantalla = "inicio";
    }
  } else {
    let nodo = historia[pantalla];
    if (nodo && nodo.esFinal) {
      if (mouseX > 130 && mouseX < 380 && mouseY > 360 && mouseY < 405) {
        pantalla = "inicio";
        chat = [];
      } else if (mouseX > 420 && mouseX < 670 && mouseY > 360 && mouseY < 405) {
        creditosY = alto;
        pantalla = "creditos";
      }
    } else if (nodo) {
      if (nodo.opcionA && mouseX > 40 && mouseX < 390 && mouseY > 355 && mouseY < 395) {
        cambiarNodo(nodo.opcionA.siguiente);
      } else if (nodo.opcionB && mouseX > 410 && mouseX < 760 && mouseY > 355 && mouseY < 395) {
        cambiarNodo(nodo.opcionB.siguiente);
      }
    }
  }
}

function cambiarNodo(id) {
  pantalla = id;
  let nodo = historia[id];
  chat = [];
  if (nodo && nodo.mensajes) {
    for (let i = 0; i < nodo.mensajes.length; i++) {
      chat.push(nodo.mensajes[i]);
    }
  }
}

function dibujarBoton(x, y, w, h, textoBoton) {
  let hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  noStroke();
  if (hover) {
    fill(250, 115, 165);
  } else {
    fill(235, 100, 150);
  }
  rect(x, y, w, h, 8);
  
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text(textoBoton, x + w / 2, y + h / 2);
  textStyle(NORMAL);
}

function dibujarInicio() {
  if (portada) {
    image(portada, 0, 0, ancho, alto);
    fill(0, 150);
    rect(0, 0, ancho, alto);
  } else {
    background(10, 15, 25);
  }

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(34);
  textStyle(BOLD);
  text("PRIMER DIA DE FACULTAD", ancho / 2, 90);
  textStyle(NORMAL);

  dibujarBoton(290, 300, 220, 36, "Jugar");
}

function dibujarCreditos() {
  background(10, 16, 22);

  let lineas = [
    "Créditos",
    "",
    "Abigail Rodriguez Paez",
    "Lucrecia Leguizamon",
    "",
    "Materia: PMIW",
    "TP Final - Parte 1"
  ];

  if (creditosY > 100) {
    creditosY -= 1.2;
  } else {
    creditosY = 100;
  }

  textAlign(CENTER, TOP);
  for (let i = 0; i < lineas.length; i++) {
    if (i === 0) {
      fill(37, 211, 102);
      textSize(26);
      textStyle(BOLD);
    } else {
      fill(230);
      textSize(16);
      textStyle(NORMAL);
    }
    text(lineas[i], ancho / 2, creditosY + i * 36);
  }

  if (frameCount % 10 === 0) {
    frameLibro = (frameLibro + 1) % libro.length;
  }
  if (libro[frameLibro]) {
    image(libro[frameLibro], 630, 170, 110, 110);
  }

  dibujarBoton(280, 380, 240, 40, "Volver al inicio");
}

function dibujarJuego(id) {
  let nodo = historia[id];
  background(11, 20, 26);

  if (fondoChat) {
    image(fondoChat, 0, 52, ancho, 298);
    fill(10, 15, 25, 140);
    rect(0, 52, ancho, 298);
  }

  fill(31, 44, 51);
  rect(0, 0, ancho, 52);

  if (imgs[1]) {
    image(imgs[1], 12, 8, 36, 36);
  }

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);
  text("Avi", 58, 20);
  textSize(11);
  fill(180);
  text("en línea", 58, 38);

  dibujarChatBurbujas(60, 330);

  if (nodo && nodo.esFinal) {
    fill(0, 220);
    rect(40, 230, 720, 100, 12);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(nodo.texto, ancho / 2, 260);
    textSize(13);
    fill(37, 211, 102);
    text(nodo.subtitulo, ancho / 2, 295);
    
    dibujarBoton(130, 360, 250, 45, "Volver al inicio");
    dibujarBoton(420, 360, 250, 45, "Créditos");
  } else if (nodo) {
    dibujarBoton(40, 355, 350, 40, "A) " + nodo.opcionA.texto);
    dibujarBoton(410, 355, 350, 40, "B) " + nodo.opcionB.texto);
  }
}

function dibujarChatBurbujas(yInicio, yFin) {
  let y = yInicio;
  for (let i = 0; i < chat.length; i++) {
    y = dibujarUnaBurbuja(chat[i], y);
    if (y > yFin) break;
  }
}

function dibujarUnaBurbuja(m, y) {
  let esLu = m.quien == "lu";
  let esSistema = m.quien == "sistema";
  let maxAncho = 420;

  if (esSistema) {
    fill(255, 220);
    textAlign(CENTER, TOP);
    textSize(11);
    text(m.texto, ancho / 2, y);
    return y + 24;
  }

  let altoB = 42;
  if (m.tipo == "audio" || m.tipo == "foto" || m.tipo == "meme") {
    altoB = 75;
  }

  let x = esLu ? ancho - maxAncho - 24 : 24;
  if (esLu) {
    fill(0, 92, 75);
  } else {
    fill(31, 44, 51);
  }
  noStroke();
  rect(x, y, maxAncho, altoB, 10);

  if (!esLu && imgs[1]) {
    image(imgs[1], x + 6, y + 6, 24, 24);
  }

  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  let textoX = esLu ? x + 10 : x + 36;
  text(m.texto, textoX, y + 8, maxAncho - 48, 60);

  if (m.tipo == "foto" && imgs[2]) {
    image(imgs[2], textoX, y + 28, 60, 40);
  } else if (m.tipo == "meme" && imgs[0]) {
    image(imgs[0], textoX, y + 28, 90, 42);
  } else if (m.tipo == "audio") {
    fill(37, 211, 102);
    rect(textoX, y + 42, 140, 5, 2);
    ellipse(textoX + 6, y + 44, 10, 10);
  }

  return y + altoB + 6;
}

function crearGraficosExtras() {
  imgs[1] = crearAvatarCirculo(color(0, 150, 214), "A");
  imgs[2] = crearCajitaConsigna();
}

function crearAvatarCirculo(col, letra) {
  let g = createGraphics(72, 72);
  g.noStroke();
  g.fill(col);
  g.circle(36, 36, 70);
  g.fill(255);
  g.textAlign(CENTER, CENTER);
  g.textSize(28);
  g.textStyle(BOLD);
  g.text(letra, 36, 34);
  return g;
}

function crearCajitaConsigna() {
  let g = createGraphics(140, 96);
  g.background(240);
  g.fill(30);
  g.textSize(10);
  g.text("CONSIGNA TP", 8, 18);
  g.fill(80);
  g.text("12 pantallas", 8, 38);
  g.text("3 finales", 8, 54);
  g.text("800 x 450", 8, 70);
  g.stroke(120);
  g.line(8, 84, 130, 84);
  return g;
}

function armarHistoria() {
  historia[0] = {
    mensajes: [
      { quien: "sistema", texto: "Grupo de WhatsApp de la materia" },
      { quien: "avi", texto: "chicas el tp de programación para cuándo era?" }
    ],
    opcionA: { texto: "Seguir en el grupo", siguiente: 1 },
    opcionB: { texto: "Salir y revisar chats", siguiente: 1 }
  };

  historia[1] = {
    mensajes: [
      { quien: "sistema", texto: "Avi te habla por privado" }
    ],
    opcionA: { texto: "Abrir el chat", siguiente: 2 },
    opcionB: { texto: "Dejarlo un rato", siguiente: 2 }
  };

  historia[2] = {
    mensajes: [
      { quien: "avi", texto: "Holaaa, ¿pudiste hacer el trabajo de programación? ¿Qué camino decidís tomar?" }
    ],
    opcionA: { texto: "Responder amable y rápida", siguiente: 3 },
    opcionB: { texto: "Responder cortante o tarde", siguiente: 10 }
  };

  historia[3] = {
    mensajes: [
      { quien: "lu", texto: "Holaaa sí!! Ya lo estoy haciendo, después te cuento" },
      { quien: "avi", texto: "¡Qué bueno! ¿Te costó la parte de las funciones/loops?" }
    ],
    opcionA: { texto: "Mandar audio/captura explicando", siguiente: 4 },
    opcionB: { texto: "Mandar meme o chiste del profe", siguiente: 7 }
  };

  historia[4] = {
    mensajes: [
      { quien: "lu", texto: "🎤 Audio 0:42 — mirá, las funciones van con parámetros...", tipo: "audio" },
      { quien: "avi", texto: "graciasss, queres salir a fumar despues?" }
    ],
    opcionA: { texto: "Siii, porfa. Esperame afuera.", siguiente: 5 },
    opcionB: { texto: "Uhh, prefiero irme a estudiar sola.", siguiente: 6 }
  };

  historia[5] = {
    esFinal: true,
    texto: "Se quedan charlando afuera. Se ríen del TP y pegan re buena onda.",
    subtitulo: "FINAL 1 - Amigas (afinidad y buena onda por chat)",
    mensajes: [
      { quien: "lu", texto: "Siii, porfa. Esperame afuera." },
      { quien: "avi", texto: "jajaja te espero afuera en la puerta entonces 💚" },
      { quien: "sistema", texto: "FINAL 1: Amigas" }
    ]
  };

  historia[6] = {
    esFinal: true,
    texto: "Avi entiende. Siguen hablando solo cuando hay entregas.",
    subtitulo: "FINAL 3 - Compañeras de cursada",
    mensajes: [
      { quien: "lu", texto: "Uhh, prefiero irme a estudiar sola." },
      { quien: "avi", texto: "okeyyy, cualquier cosa del tp avisame" },
      { quien: "sistema", texto: "FINAL 3: Compañeras de cursada" }
    ]
  };

  historia[7] = {
    mensajes: [
      { quien: "lu", texto: "jsjsjs esto sos vos en clase", tipo: "meme" },
      { quien: "avi", texto: "AJSKJKASD lo amo, ¿querés fumar conmigo afuera de la facultad?" }
    ],
    opcionA: { texto: "Siii, porfa. Esperame afuera.", siguiente: 8 },
    opcionB: { texto: "Nono, me voy rápido después de clase.", siguiente: 9 }
  };

  historia[8] = {
    esFinal: true,
    texto: "Se quedan charlando afuera. El meme era solo el principio.",
    subtitulo: "FINAL 1 - Amigas (afinidad y buena onda por chat)",
    mensajes: [
      { quien: "lu", texto: "Siii, porfa. Esperame afuera." },
      { quien: "avi", texto: "jajaja te espero en la puerta entonces" },
      { quien: "sistema", texto: "FINAL 1: Amigas" }
    ]
  };

  historia[9] = {
    esFinal: true,
    texto: "Rieron el meme, pero cada una se va por su lado.",
    subtitulo: "FINAL 3 - Compañeras de cursada",
    mensajes: [
      { quien: "lu", texto: "Nono, me voy rápido después de clase." },
      { quien: "avi", texto: "jaja ok, nos vemos en clase entonces" },
      { quien: "sistema", texto: "FINAL 3: Compañeras de cursada" }
    ]
  };

  historia[10] = {
    mensajes: [
      { quien: "lu", texto: "sip" },
      { quien: "avi", texto: "Ah joya. Perdoná que te moleste, ¿me pasás la consigna?" }
    ],
    opcionA: { texto: "Mandar foto de la consigna seco", siguiente: 11 },
    opcionB: { texto: "Dejar en visto o responder sin ganas", siguiente: 14 }
  };

  historia[11] = {
    mensajes: [
      { quien: "lu", texto: "ahí te la mando", tipo: "foto" },
      { quien: "avi", texto: "Gracias." },
      { quien: "sistema", texto: "Quedan en hablar solo de la materia" }
    ],
    opcionA: { texto: "De nada, suerte en el parcial.", siguiente: 12 },
    opcionB: { texto: "Cualquier duda nos avisamos!", siguiente: 13 }
  };

  historia[12] = {
    esFinal: true,
    texto: "Cortan el chat. Relación estrictamente académica.",
    subtitulo: "FINAL 3 - Compañeras de cursada",
    mensajes: [
      { quien: "lu", texto: "De nada, suerte en el parcial." },
      { quien: "sistema", texto: "FINAL 3: Compañeras de cursada" }
    ]
  };

  historia[13] = {
    esFinal: true,
    texto: "Se ayudan para el parcial. Nada más.",
    subtitulo: "FINAL 3 - Compañeras de cursada",
    mensajes: [
      { quien: "lu", texto: "Cualquier duda nos avisamos!" },
      { quien: "avi", texto: "dale, gracias" },
      { quien: "sistema", texto: "FINAL 3: Compañeras de cursada" }
    ]
  };

  historia[14] = {
    mensajes: [
      { quien: "sistema", texto: "Dejaste el mensaje en visto" },
      { quien: "avi", texto: "Que mala, solo te pregunté" }
    ],
    opcionA: { texto: "Perdón, estaba haciendo cosas.", siguiente: 15 },
    opcionB: { texto: "? Que pesada.", siguiente: 16 }
  };

  historia[15] = {
    esFinal: true,
    texto: "Se calma. Siguen siendo solo compañeras de cursada.",
    subtitulo: "FINAL 3 - Compañeras de cursada",
    mensajes: [
      { quien: "lu", texto: "Perdón, estaba haciendo cosas." },
      { quien: "avi", texto: "ok, no hay drama" },
      { quien: "sistema", texto: "FINAL 3: Compañeras de cursada" }
    ]
  };

  historia[16] = {
    esFinal: true,
    texto: "Avi te silencia. Queda tensión. Chat frío.",
    subtitulo: "FINAL 2 - Se llevan mal (bloqueados / tensión)",
    mensajes: [
      { quien: "lu", texto: "? Que mala." },
      { quien: "sistema", texto: "Avi te bloqueó" },
      { quien: "sistema", texto: "FINAL 2: Se llevan mal" }
    ]
  };
}
