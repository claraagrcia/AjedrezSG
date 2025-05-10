import * as THREE from '../libs/three.module.js'
import { Pieza } from './Pieza.js';

class Casilla extends THREE.Object3D{

    constructor(posi,posj,color) {
        super();

        this.pieza = null;
        this.posX = posi;
        this.posY = posj;
        
        var geom_casilla = new THREE.BoxGeometry(1,0.05,1);
        geom_casilla.translate(0,-0.025,0);
        var material = new THREE.MeshStandardMaterial({color: color});
        this.casilla = new THREE.Mesh(geom_casilla,material);
        this.add(this.casilla);
    }

    setPieza(pieza) {
        this.pieza = pieza;
        this.add(pieza);
    }

    resaltarColor(nuevo_color) {
        this.casilla.material.color.set(nuevo_color);
    }
}

export {Casilla};