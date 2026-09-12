app = new PIXI.Application();
ancho = 800;
alto = 800;

mouse = { x: 0, y: 0 };

gravedad = { x: 0, y: 3 };

slimeTontos = [];

slime = null;
mundo = null;

ultimoFrame = 0;
delta = 0;

let tipoBloque = "tierra";

let cursorBloque;       // el sprite
let cursorPos = { i: 0, j: 0, k: 0 }; // posición actual

const puntosBloque = [
  150, 0,   // Punta superior
  285, 70,  // Esquina derecha
  285, 230,  // Esquina inferior derecha
  150, 300,  // Punta inferior
  15, 230,   // Esquina inferior izquierda
  15, 70    // Esquina izquierda
];

// 2. CREAR UN SOLO POLÍGONO EN MEMORIA PARA TODOS
let hitAreaCompartido;

app.init({ width: ancho, height: alto }).then(() => {
  pixiListo();
});

async function pixiListo() {
  console.log("pixi listo");

  document.body.appendChild(app.canvas);

  app.canvas.addEventListener('contextmenu', function (evento) {
    evento.preventDefault();
  });

  ponerEventListeners();

  window.__PIXI_APP__ = app;

  await PIXI.Assets.load("tierra.png");
  await PIXI.Assets.load("piedra.png");
  await PIXI.Assets.load("bedrock.png");

  hitAreaCompartido = new PIXI.Polygon(puntosBloque);

  mundo = new MundoIsometrico(app.stage, {
    filas: 50,
    columnas: 50,
    alturaMaxima: 10,
    tamañoTile: { ancho: 64, alto: 32 },
    origenX: ancho / 2,
    origenY: 0
  });

  crearCursorBloque(mundo);

  ultimoFrame = performance.now();

  /*   let textura = PIXI.Texture.from("piedra.png"); */
  /*   crearBloque(0, 0, textura); */



  app.ticker.add(() => gameLoop());
}
/* function crearBloque(x, y, textura) {


  // 3. CREAR UNA SOLA PLANTILLA VISUAL (Se dibuja una sola vez)
  const plantillaVisual = new PIXI.Graphics();
  plantillaVisual.poly(puntosBloque);
  plantillaVisual.fill({ color: 0x00ff00, alpha: 0.3 });
  plantillaVisual.stroke({ color: 0x00ff00, width: 1.5 });
  plantillaVisual.x = x;
  plantillaVisual.y = y;
  const bloque = new PIXI.Sprite(textura);
  bloque.x = x;
  bloque.y = y;
  bloque.scale.set(.3, 0.3);

  bloque.eventMode = 'static';

  bloque.on("pointerdown", () => {
    console.log("¡Tocaste este sprite!", bloque);
    bloque.tint = "0xff0000"
  });

  // ASIGNACIÓN REUTILIZABLE: No duplica peso en memoria
  bloque.hitArea = hitAreaCompartido;

  // VISUALIZACIÓN EFICIENTE: Clonamos la plantilla (es instantáneo)
  const miVisualizador = plantillaVisual.clone();
  bloque.addChild(miVisualizador);

  // Tu evento limpio y sin ifs
  bloque.on('pointerdown', () => {
    console.log(`Bloque tocado en: ${x}, ${y}`);
  });

  mundo.stage.addChild(bloque);
} */
function ponerEventListeners() {
  window.onmousemove = (evento) => {
    cuandoSeMueveElMouse(evento);
  };
  // window.addEventListener("contextmenu", (e) => {
  //   e.preventDefault(); // Evita el menú del navegador
  //   colocarBloqueConClick(e);
  // });
  // window.addEventListener("mouseup", (e) => {
  //   if (e.button === 0) { // izquierdo
  //     //mundo.clickIzquierdo(e.x, e.y);
  //   }
  // });
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "1": tipoBloque = "tierra"; break;
      case "2": tipoBloque = "piedra"; break;
      case " ": mundo.ponerBloque(cursorPos.i, cursorPos.j, tipoBloque, cursorPos.k); break;
      case "Delete": mundo.quitarBloque(cursorPos.i, cursorPos.j, cursorPos.k); break;
    }
    actualizarCursorBloque(mundo);
  });
}

function cuandoSeMueveElMouse(evento) {
  mouse = { x: evento.clientX, y: evento.clientY };
  if (mundo == null) return;

  const iso = mundo.screenToIso(mouse.x, mouse.y);
  let i = Math.floor(iso.i);
  let j = Math.floor(iso.j);

  i = Math.max(0, Math.min(mundo.filas - 1, i));
  j = Math.max(0, Math.min(mundo.columnas - 1, j));

  cursorPos.i = i;
  cursorPos.j = j;

  const columna = mundo.matriz[i]?.[j];
  cursorPos.k = columna ? columna.length : 0;

  actualizarCursorBloque(mundo);
}
function gameLoop() {
  delta = performance.now() - ultimoFrame;
  ultimoFrame = performance.now();
}
function colocarBloqueConClick(evento) {
  const mouseX = evento.clientX;
  const mouseY = evento.clientY;

  const iso = mundo.screenToIso(mouseX, mouseY);
  const i = Math.floor(iso.i);
  const j = Math.floor(iso.j);

  // Buscar altura actual en esa celda
  let k = mundo.matriz[i]?.[j]?.length || 0;

  mundo.ponerBloque(i, j, "tierra", k);
}
function crearCursorBloque(mundo) {
  const textura = PIXI.Texture.from("cubo.png"); // o una textura especial
  cursorBloque = new PIXI.Sprite(textura);

  cursorBloque.anchor.set(0.5, 1);
  cursorBloque.width = 85;
  cursorBloque.height = 85;
  cursorBloque.alpha = 0.5; // medio transparente para distinguirlo
  cursorBloque.tint = 0xff0000; // rojo

  mundo.stage.addChild(cursorBloque);

  actualizarCursorBloque(mundo);
}
function actualizarCursorBloque(mundo) {
  const { i, j, k } = cursorPos;
  const pos = mundo.isoToScreen(i, j, k);
  cursorBloque.x = pos.x;
  cursorBloque.y = pos.y;
  cursorBloque.zIndex = i + j + k * 100 + 1;
}