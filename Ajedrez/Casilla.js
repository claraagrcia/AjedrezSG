import * as THREE from '../libs/three.module.js'
import { Pieza } from './Pieza.js';

class Casilla extends THREE.Object3D{
    constructor(posi,posj,color) {
        super();

        this.pieza = null;
        this.posX = posi;
        this.posY = posj;
        
        var geom_casilla = new THREE.BoxGeometry(1,0.05,1);
        var material_blanco = new THREE.MeshStandardMaterial({color: color});
        this.casilla = new THREE.Mesh(geom_casilla,material_blanco);
        this.casilla.translateY(-0.025);
        this.add(this.casilla);
    }

    setPieza(pieza) {
        this.pieza = pieza;
        this.add(pieza);
    }
}

export {Casilla};