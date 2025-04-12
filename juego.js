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

app.init({width: ancho, height: alto }).then(() => {
  pixiListo();
});

async function pixiListo() {
  console.log("pixi listo");

  document.body.appendChild(app.canvas);

  ponerEventListeners();

  window.__PIXI_APP__ = app;

  await PIXI.Assets.load("cubo.png");
  await PIXI.Assets.load("piedra.png");

  mundo = new MundoIsometrico(app.stage, {
    filas: 12,
    columnas: 12,
    tamañoTile: { ancho: 64, alto: 32 },
    origenX: ancho / 2,
    origenY: 400
  });

  crearCursorBloque(mundo);

  ultimoFrame = performance.now();

  app.ticker.add(() => gameLoop());
}

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
      case "1":          tipoBloque = "tierra"; break;
      case "2":          tipoBloque = "piedra"; break;
      case "ArrowUp":    cursorPos.j--; break;
      case "ArrowDown":  cursorPos.j++; break;
      case "ArrowLeft":  cursorPos.i--; break;
      case "ArrowRight": cursorPos.i++; break;
      case "PageUp":     cursorPos.k++; break;     // subir
      case "PageDown":   cursorPos.k = Math.max(0, cursorPos.k - 1); break; // bajar
      case " ":          mundo.ponerBloque(cursorPos.i, cursorPos.j, tipoBloque, cursorPos.k); break;
      case "Delete":     mundo.quitarBloque(cursorPos.i, cursorPos.j, cursorPos.k); break;
    }
    actualizarCursorBloque(mundo); // ← asegurate de tener referencia al mundo
  });
}

function cuandoSeMueveElMouse(evento) {
  mouse = { x: evento.x, y: evento.y };
  if(mundo == null){return}
  mundo.resaltarBloque(evento.x, evento.y);
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