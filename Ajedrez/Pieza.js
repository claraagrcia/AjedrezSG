import * as THREE from '../libs/three.module.js'

class Pieza extends THREE.Object3D {
    constructor(color) {
        super();
        this.color = color;
    }
    
    //método abstracto (se implementa en cada clase concreta)
    movimientoPosibles(tablero) {
        throw new Error("Este método debe ser implementado por la subclase.");
    }
}

export {Pieza};