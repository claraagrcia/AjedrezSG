import * as THREE from '../libs/three.module.js'

class Pieza extends THREE.Object3D {
    constructor(color,casilla) {
        super();
        this.color = color;
        this.casilla = casilla;
    }
}

export {Pieza};