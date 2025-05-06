import { Casilla } from "./Casilla.js"; 
import * as THREE from '../libs/three.module.js'
import { torre } from "./torre.js";
import { caballo } from "./caballo.js";
import { Alfil } from "./Alfil.js";
import { Reina } from "./Reina.js";
import { peon } from "./peon.js";

class Tablero extends THREE.Object3D {
    constructor(gui,titleGui) {
        super();

        this.createGUI(gui,titleGui);

        this.casillas = [];
        for(let i=0; i<8; i++) {
            this.casillas[i] = [];

            for(let j=0; j<8; j++) {
                let color = (i+j)%2 === 0 ? 0xFFFFFF : 0xD29BFD;
                this.casillas[i][j] = new Casilla(i,j,color);
                this.casillas[i][j].position.x = i-3.5;
                this.casillas[i][j].position.z = j-3.5;
                this.add(this.casillas[i][j]);
            }
        }

        this.inicializarTablero();
    }

    inicializarTablero() {
        //this.casillas[0][0].setPieza(new torre(0xFFFFFF));

        this.casillas[1][0].setPieza(new caballo(0xFFFFFF));
        this.casillas[6][0].setPieza(new caballo(0xFFFFFF));

        this.casillas[2][0].setPieza(new Alfil(0xFFFFFF));
        this.casillas[5][0].setPieza(new Alfil(0xFFFFFF));

        this.casillas[4][0].setPieza(new Reina(0xFFFFFF));
        
        this.casillas[1][7].setPieza(new caballo(0xD29BFD));
        this.casillas[6][7].setPieza(new caballo(0xD29BFD));

        this.casillas[2][7].setPieza(new Alfil(0xD29BFD));
        this.casillas[5][7].setPieza(new Alfil(0xD29BFD));

        this.casillas[4][7].setPieza(new Reina(0xD29BFD));

        //Peones
        for(let i=0; i<8; i++) {
            this.casillas[i][1].setPieza(new peon(0xFFFFFF));
            this.casillas[i][6].setPieza(new peon(0xD29BFD));
        }
    }

    createGUI (gui,titleGui) {
       
    }
    
    update () {
    
    }
}

export {Tablero};