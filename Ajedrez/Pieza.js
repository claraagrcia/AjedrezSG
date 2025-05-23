import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.module.js'
import { lila,blanco,rojo } from './Tablero.js';

class Pieza extends THREE.Object3D {
    constructor(color,casilla) {
        super();
        this.color = new THREE.Color(color).getHex();;
        this.casilla = casilla;
        this.seleccionada = false;
        this.tipo;
        this.colorInicial = color;
    }
    
    //método abstracto (se implementa en cada clase concreta)
    movimientoPosibles(tablero) {
        throw new Error("Este método debe ser implementado por la subclase.");
    }

    //método abstracto (se implementa en cada clase concreta)
    onClick(tablero) {
        throw new Error("Este método debe ser implementado por la subclase.");
    }

    mover(casilla_seleccionada,tablero,escena,spotLight=null) {
        var destino = casilla_seleccionada.obtenerPosicionMundo(); 
        const posicionActual = this.getMesh().position;
        const parent = this.getMesh().parent;
        const destinoLocal = parent.worldToLocal(destino.clone());

        if(casilla_seleccionada.pieza != null) {
            escena.pointLight.color.set(rojo);
        }

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

                //Si la casilla seleccionada tiene una pieza, la borramos
                if(casilla_seleccionada.pieza != null) {
                    if(casilla_seleccionada.pieza.colorInicial == lila) {
                        var index = tablero.piezas_seleccionables_lilas.indexOf(casilla_seleccionada.pieza.getMesh());
                        if(index != -1) {
                            tablero.piezas_seleccionables_lilas.splice(index,1);
                        }
                    }
                    else if(casilla_seleccionada.pieza.colorInicial == blanco) {
                        var index = tablero.piezas_seleccionables_blancas.indexOf(casilla_seleccionada.pieza.getMesh());
                        if(index != -1) {
                            tablero.piezas_seleccionables_blancas.splice(index,1);
                        }
                    }
                    casilla_seleccionada.removePieza();
                }

                //Actualizamos la pieza y la casilla
                this.casilla.actualizarPieza(null);
                casilla_seleccionada.actualizarPieza(this);
                this.actualizarCasilla(casilla_seleccionada);

                //Cambiamos el turno y la cámara
                if(escena.turno == "lila") {
                    console.log("Turno: blanco");
                    escena.turno = "blanco";
                    escena.cambiarCamara(escena.turno);
                  }
                  else {
                    console.log("Turno: lila");
                    escena.turno = "lila";
                    escena.cambiarCamara(escena.turno);
                  }

                  escena.pointLight.color.set(blanco);

                  if(casilla_seleccionada.pieza != null && this.tipo == "Reina") {
                    escena.remove(spotLight);
                    escena.setAmbientIntensity(0.5);
                  }

            })
            .start();
    }

    getMesh() {
        throw new Error("Este método debe ser implementado por la subclase.");
    }

    actualizarCasilla(casilla_nueva) {
        this.casilla = casilla_nueva;
    }

    changeColor(nuevo_color) {
        this.color = nuevo_color;

        // Recorremos todos los hijos del Object3D
        this.getMesh().traverse((child) => {
            if (child.isMesh && child.material && child.material.color) {
            child.material.color.set(nuevo_color);
            }
        });
    }
}

export {Pieza};