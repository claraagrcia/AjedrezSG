import { Casilla } from "./Casilla.js"; 
import * as THREE from '../libs/three.module.js'
import { caballo } from "./caballo.js";
import { Alfil } from "./Alfil.js";
import { Reina } from "./Reina.js";
import { peon } from "./peon.js";
import { Rey } from "./Rey.js";

export let blanco = 0xFFFFFF;
export let lila = 0xD29BFD;
export let verde = 0x98FF96;
export let rojo = 0xFF6961;

class Tablero extends THREE.Object3D {
    constructor(gui,titleGui) {
        super();

        this.createGUI(gui,titleGui);
        this.piezas_seleccionables_lilas = [];
        this.piezas_seleccionables_blancas = [];

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

        //Reina blanca
        let reinaBlanca = new Reina(blanco,this.casillas[4][2]);
        this.casillas[4][2].setPieza(reinaBlanca);
        this.piezas_seleccionables_blancas.push(reinaBlanca.reina);

        //Peones
        for(let i=0; i<8; i++) {
            let peonLila = new peon(lila,this.casillas[i][6]);
            this.casillas[i][6].setPieza(peonLila);
            this.piezas_seleccionables_lilas.push(peonLila.peon);
        }
    }

    createGUI (gui,titleGui) {
       
    }
    
    update () {
    
    }
}

export {Tablero};