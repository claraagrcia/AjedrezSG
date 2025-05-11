import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.module.js'

class Pieza extends THREE.Object3D {
    constructor(color,casilla) {
        super();
        this.color = color;
        this.casilla = casilla;
        this.seleccionada = false;
    }
    
    //método abstracto (se implementa en cada clase concreta)
    movimientoPosibles(tablero) {
        throw new Error("Este método debe ser implementado por la subclase.");
    }

    //método abstracto (se implementa en cada clase concreta)
    onClick(tablero) {
        throw new Error("Este método debe ser implementado por la subclase.");
    }

    mover(destino) {
        const posicionActual = this.getMesh().position;

        new TWEEN.Tween(posicionActual)
            .to({
            x: destino.x,
            y: destino.y,
            z: destino.z
            }, 1000) // duración en milisegundos
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
            // Actualizar posición si necesitas lógica adicional
            })
            .onComplete(() => {
            console.log("Movimiento completado");
            })
            .start();
    }

    getMesh() {
        throw new Error("Este método debe ser implementado por la subclase.");
    }
}

export {Pieza};