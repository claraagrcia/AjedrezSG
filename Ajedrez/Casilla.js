import * as THREE from '../libs/three.module.js'
import { Pieza } from './Pieza.js';

class Casilla extends THREE.Object3D{

    constructor(posi,posj,color) {
        super();

        this.pieza = null;
        this.posX = posi;
        this.posY = posj;
        this.colorInicial = color;
        
        var geom_casilla = new THREE.BoxGeometry(1,0.05,1);
        geom_casilla.translate(0,-0.025,0);
        var material = new THREE.MeshStandardMaterial({color: this.colorInicial});
        this.casilla = new THREE.Mesh(geom_casilla,material);
        this.casilla.userData = this;
        this.add(this.casilla);
    }

    setPieza(pieza) {
        this.pieza = pieza;
        this.add(pieza);
    }

    setColor(nuevo_color) {
        this.casilla.material.color.set(nuevo_color);
    }

    obtenerPosicionMundo() {
        const posicion = new THREE.Vector3();
        this.casilla.getWorldPosition(posicion);
        return posicion; 
    }

}

export {Casilla};