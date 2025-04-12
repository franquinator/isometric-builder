function getUnitVector(objX, objY, mouseX, mouseY) {
  // Paso 1: Vector dirección
  let dx = mouseX - objX;
  let dy = mouseY - objY;

  // Paso 2: Magnitud (longitud del vector)
  let length = Math.sqrt(dx * dx + dy * dy);

  // Paso 3: Evitar dividir por cero
  if (length === 0) return { x: 0, y: 0 };

  // Paso 4: Normalizar
  return {
    x: dx / length,
    y: dy / length,
  };
}
function getUnitVector(posMouse, posObj) {
  // Paso 1: Vector dirección
  let dx = posMouse.x - posObj.x;
  let dy = posMouse.y - posObj.y;

  // Paso 2: Magnitud (longitud del vector)
  let length = Math.sqrt(dx * dx + dy * dy);

  // Paso 3: Evitar dividir por cero
  if (length === 0) return { x: 0, y: 0 };

  // Paso 4: Normalizar
  return {
    x: dx / length,
    y: dy / length,
  };
}
function vaMuyLento(x, y) {
  return velocidadLinear(x,y) < 0.1;
}
function velocidadLinear(x, y) {
  return Math.sqrt(x * x + y * y);
}
function distancia(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
function distancia(pos1, pos2) {
  return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2);
}
function normalizar(vel){

  let length = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

  if (length === 0) return { x: 0, y: 0 };

  return {
    x: vel.x / length,
    y: vel.y / length,
  };
}
function normalizar(x,y){

  let length = Math.sqrt(x * x + y * y);

  if (length === 0) return { x: 0, y: 0 };

  return {
    x: x / length,
    y: y / length,
  };
}