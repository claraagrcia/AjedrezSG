import { Casilla } from "./Casilla.js"; 
import * as THREE from '../libs/three.module.js'
import { torre } from "./torre.js";
import { caballo } from "./caballo.js";
import { Alfil } from "./Alfil.js";
import { Reina } from "./Reina.js";
import { peon } from "./peon.js";
import { Rey } from "./Rey.js";

export let blanco = 0xFFFFFF;
export let lila = 0xD29BFD;
export let verde = 0x98FF96;

class Tablero extends THREE.Object3D {
    constructor(gui,titleGui) {
        super();

        this.createGUI(gui,titleGui);
        this.piezas_seleccionables = [];

        this.casillas = [];
        for(let i=0; i<8; i++) {
            this.casillas[i] = [];

            for(let j=0; j<8; j++) {
                let color = (i+j)%2 === 0 ? blanco : lila;
                this.casillas[i][j] = new Casilla(i,j,color);
                this.casillas[i][j].position.x = i-3.5;
                this.casillas[i][j].position.z = j-3.5;
                this.add(this.casillas[i][j]);
            }
        }

        this.inicializarTablero();
    }

    inicializarTablero() {
        // this.casillas[0][0].setPieza(new torre(blanco));
        // this.casillas[7][0].setPieza(new torre(blanco));

        // this.casillas[1][0].setPieza(new caballo(blanco));
        // this.casillas[6][0].setPieza(new caballo(blanco));

        // this.casillas[2][0].setPieza(new Alfil(blanco));
        // this.casillas[5][0].setPieza(new Alfil(blanco));

        // this.casillas[3][0].setPieza(new Rey(blanco));
        // this.casillas[4][0].setPieza(new Reina(blanco));


        // this.casillas[0][7].setPieza(new torre(lila));
        // this.casillas[7][7].setPieza(new torre(lila));
        
        // this.casillas[1][7].setPieza(new caballo(lila));
        // this.casillas[6][7].setPieza(new caballo(lila));

        // this.casillas[2][7].setPieza(new Alfil(lila));
        // this.casillas[5][7].setPieza(new Alfil(lila));

        // this.casillas[3][7].setPieza(new Rey(lila));
         let casilla = this.casillas[4][5];
         let reinaLila = new Reina(lila,casilla);
         casilla.setPieza(reinaLila);
         this.piezas_seleccionables.push(reinaLila.reina);

        //Peones
        for(let i=0; i<8; i++) {
            this.casillas[i][1].setPieza(new peon(blanco));
            this.casillas[i][6].setPieza(new peon(lila));
        }
        
        //reinaLila.movimientoPosibles(this.casillas);
    }

    createGUI (gui,titleGui) {
       
    }
    
    update () {
    
    }
}

export {Tablero};