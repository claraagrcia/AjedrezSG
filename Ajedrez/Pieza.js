import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.module.js'
import { lila,blanco } from './Tablero.js';

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

    mover(casilla_seleccionada,tablero) {
        var destino = casilla_seleccionada.obtenerPosicionMundo(); 
        const posicionActual = this.getMesh().position;
        const parent = this.getMesh().parent;
        const destinoLocal = parent.worldToLocal(destino.clone());

        new TWEEN.Tween(posicionActual)
            .to({
            x: destinoLocal.x,
            y: destinoLocal.y,
            z: destinoLocal.z
            }, 1000) 
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
            
            })
            .onComplete(() => {
                console.log("Movimiento completado");

                //Si la casilla seleccionada tiene una pieza, borrarla
                console.log(casilla_seleccionada.pieza);
                if(casilla_seleccionada.pieza != null) {
                    if(casilla_seleccionada.pieza.color == lila) {
                        var index = tablero.piezas_seleccionables_lilas.indexOf(casilla_seleccionada.pieza.getMesh());
                        tablero.piezas_seleccionables_lilas.splice(index,1);
                    }
                    else if(casilla_seleccionada.pieza.color == blanco) {
                        var index = tablero.piezas_seleccionables_blancas.indexOf(casilla_seleccionada.pieza.getMesh());
                        tablero.piezas_seleccionables_blancas.splice(index,1);
                    }
                    casilla_seleccionada.removePieza();
                }

                //Actualizamos la pieza y la casilla
                this.casilla.actualizarPieza(null);
                casilla_seleccionada.actualizarPieza(this);
                this.actualizarCasilla(casilla_seleccionada);
            })
            .start();
    }

    getMesh() {
        throw new Error("Este método debe ser implementado por la subclase.");
    }

    actualizarCasilla(casilla_nueva) {
        this.casilla = casilla_nueva;
    }
}

export {Pieza};