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
        tierra: PIXI.Texture.from("tierra.png"),
        piedra : PIXI.Texture.from("piedra.png"),
        bedrock : PIXI.Texture.from("bedrock.png")
        // podés sumar más: piedra, pasto, etc.
      };
  
      this.bloques = [];  // Guarda los sprites [i][j][k]
      this.matriz = [];   // Guarda el tipo de bloque [i][j][k]
  
      this.inicializarMatriz(this.filas,this.columnas,this.alturaMaxima);
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
  
    inicializarMatriz(filas,columnas,altura) {
      for (let i = 0; i < filas; i++) {
        console.log(perlin.get(0, i/10) * 12);
        this.matriz[i] = [];
        for (let j = 0; j < columnas; j++) {
          this.matriz[i][j] = [];
          for (let k = 0; k < altura; k++) {
            this.matriz[i][j][k] = this.valorSegunPerlinPos(i,j,k);
          }
        }
      }
      console.log(this.matriz);
    }
    valorSegunPerlinPos(i,j,k){
      let alturaSuperficie = perlin.get(i/10,j/10) * 6 + 6;
      if(k < alturaSuperficie){
        return 1;
      }
      return 0;
    }
  
    generarMapaDesdeMatriz() {
      for (let i = 0; i < this.filas; i++) {
        for (let j = 0; j < this.columnas; j++) {
          for (let k = 0; k < this.matriz[i][j].length; k++) {
            if(this.matriz[i][j][k]  == 1){
              this.asignarTipo(i,j,k);
              this.ponerBloque(i,j,this.matriz[i][j][k],k)
            }
          }
        }
      }
    }
    
    asignarTipo(i,j,k){
      if(k < 1){
        this.matriz[i][j][k] = "bedrock"
        return
      }
      if(this.matriz[i][j][k+1]==0){
        this.matriz[i][j][k] = "tierra";
        return;
      }
      this.matriz[i][j][k] = "piedra"
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
        sprite.width = 71;
        sprite.height = 71;
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
}