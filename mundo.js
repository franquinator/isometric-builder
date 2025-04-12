class MundoIsometrico {
    constructor(stage, opciones = {}) {
        
      this.stage = stage;
      this.filas = opciones.filas || 10;
      this.columnas = opciones.columnas || 10;
      this.alturaMaxima = opciones.alturaMaxima || 5; // número máximo de bloques en Z
      this.tamañoTile = opciones.tamañoTile || { ancho: 64, alto: 32 };
      this.origenX = opciones.origenX || 400;
      this.origenY = opciones.origenY || 0;
  
        
      this.texturas = {
        tierra: PIXI.Texture.from("cubo.png"),
        piedra : PIXI.Texture.from("piedra.png")
        // podés sumar más: piedra, pasto, etc.
      };
  
      this.bloques = [];  // Guarda los sprites [i][j][k]
      this.matriz = [];   // Guarda el tipo de bloque [i][j][k]
  
      this.inicializarMatriz();
      this.generarMapaDesdeMatriz();
    }
  
    isoToScreen(i, j, k = 0) {
        const { ancho, alto } = this.tamañoTile;
        return {
          x: (i - j) * ancho / 2 + this.origenX,
          y: (i + j) * alto / 2 + this.origenY - k  * (alto + 4)
        };
      }
      screenToIso(x, y) {
        const { ancho, alto } = this.tamañoTile;
        const dx = x - this.origenX;
        const dy = y - this.origenY;
      
        const i = (dy / (alto / 2) + dx / (ancho / 2)) / 2;
        const j = (dy / (alto / 2) - dx / (ancho / 2)) / 2;
      
        return {
          i: Math.floor(i + 2),
          j: Math.floor(j + 2)
        };
      }
  
    inicializarMatriz() {
      for (let i = 0; i < this.filas; i++) {
        this.matriz[i] = [];
        for (let j = 0; j < this.columnas; j++) {
          this.matriz[i][j] = [];
          this.matriz[i][j][0] = "tierra"; // bloque base
          // podés dejarlo vacío si querés empezar sin nada
        }
      }
    }
  
    generarMapaDesdeMatriz() {
      this.bloques = [];
  
      for (let i = 0; i < this.filas; i++) {
        this.bloques[i] = [];
        for (let j = 0; j < this.columnas; j++) {
          this.bloques[i][j] = [];
          for (let k = 0; k < this.matriz[i][j].length; k++) {
            const tipo = this.matriz[i][j][k];
            if (tipo) {
              const sprite = this.ponerBloque(i, j, tipo, k);
              this.bloques[i][j][k] = sprite;
            }
          }
        }
      }
    }
  
    ponerBloque(i, j, tipo = "tierra", k = null) {
        const textura = this.texturas[tipo];
        if (!textura) {
          console.warn(`No hay textura para el tipo "${tipo}"`);
          return;
        }
      
        // Asegurar que existan las estructuras de datos
        if (!this.matriz[i]) this.matriz[i] = [];
        if (!this.matriz[i][j]) this.matriz[i][j] = [];
      
        if (k === null) {
          // Si no se especifica la altura, apilar encima del último
          k = this.matriz[i][j].length;
        }
      
        // Guardar el tipo de bloque en la matriz lógica
        this.matriz[i][j][k] = tipo;
      
        // Crear y posicionar el sprite
        const sprite = new PIXI.Sprite(textura);
        const pos = this.isoToScreen(i, j, k);
      
        sprite.x = pos.x;
        sprite.y = pos.y;
        sprite.anchor.set(0.5, 1);
        sprite.width = 85;
        sprite.height = 85;
        sprite.zIndex = i + j + k * 100;
        this.bloqueResaltado = null;

        
        sprite.eventMode = "static";
        sprite.cursor = "pointer";
        sprite.on("pointerdown", () => {
          console.log("¡Tocaste este sprite!", sprite);
        });
      
        this.stage.addChild(sprite);
      
        // Guardar el sprite
        if (!this.bloques[i]) this.bloques[i] = [];
        if (!this.bloques[i][j]) this.bloques[i][j] = [];
        this.bloques[i][j][k] = sprite;
      
        return sprite;
      }
  
    reiniciarMundo() {
      // Eliminar todos los sprites actuales
      for (let fila of this.bloques) {
        if (fila) {
          for (let columna of fila) {
            if (columna) {
              for (let sprite of columna) {
                if (sprite) this.stage.removeChild(sprite);
              }
            }
          }
        }
      }
  
      // Limpiar datos
      this.bloques = [];
      this.inicializarMatriz();
      this.generarMapaDesdeMatriz();
    }
    quitarBloque(i, j, k) {
        // Verificar que exista el bloque
        const sprite = this.bloques?.[i]?.[j]?.[k];
        if (!sprite) return;
      
        // Eliminar sprite del escenario
        this.stage.removeChild(sprite);
      
        // Eliminar referencias
        this.bloques[i][j][k] = null;
        this.matriz[i][j][k] = null;
    }
    resaltarBloque(x, y) {
        // Quitar resaltado anterior
        // if (this.bloqueResaltado) {
        //   this.bloqueResaltado.tint = 0xFFFFFF; // color original
        //   this.bloqueResaltado = null;
        // }
      
        // const { i, j } = this.screenToIso(x, y);
        // const ii = Math.floor(i + 0.5);
        // const jj = Math.floor(j + 0.5);
      
        // const pila = this.bloques[ii]?.[jj];
        // if (pila && pila.length > 0) {
        //   const sprite = pila[pila.length - 1]; // bloque más alto
        //   sprite.tint = 0xFFFF66; // amarillo brillante
        //   this.bloqueResaltado = sprite;
        // }
      }
      clickIzquierdo(x, y) {
        const { i, j } = this.screenToIso(x, y);
        const ii = Math.floor(i + 0.5);
        const jj = Math.floor(j + 0.5);
      
        const pila = this.bloques[ii]?.[jj];
        if (pila && pila.length > 0) {
          const k = pila.length - 1;
          this.quitarBloque(ii, jj, k);
        }
      }
      guardarMundo() {
        const datos = {
          filas: this.filas,
          columnas: this.columnas,
          matriz: this.matriz
        };
      
        const json = JSON.stringify(datos);
        localStorage.setItem("mundo", json);
        console.log("Mundo guardado:", json);
      
        return json;
      }
      cargarMundo(json) {
        try {
          const datos = JSON.parse(localStorage.getItem("mundo"));
      
          this.filas = datos.filas;
          this.columnas = datos.columnas;
          this.matriz = datos.matriz;
      
          this.reiniciarMundo(); // limpia la escena
          this.generarMapaDesdeMatriz(); // vuelve a dibujar todo
      
          console.log("Mundo cargado con éxito.");
        } catch (error) {
          console.error("Error al cargar el mundo:", error);
        }
      }
      
      
}