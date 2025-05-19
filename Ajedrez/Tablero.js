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
        // this.casillas[0][0].setPieza(new torre(blanco));
        // this.casillas[7][0].setPieza(new torre(blanco));

        let caballoBlanco1 = new caballo(blanco,this.casillas[1][0]);
        this.casillas[1][0].setPieza(caballoBlanco1);
        this.piezas_seleccionables_blancas.push(caballoBlanco1.caballo);

        let caballoBlanco2 = new caballo(blanco,this.casillas[6][0]);
        this.casillas[6][0].setPieza(caballoBlanco2);
        this.piezas_seleccionables_blancas.push(caballoBlanco2.caballo);

        // let alfilBlanco1 = new Alfil(blanco,this.casillas[2][0]);
        // this.casillas[2][0].setPieza(alfilBlanco1);
        // this.piezas_seleccionables_blancas.push(alfilBlanco1.alfil);

        // let alfilBlanco2 = new Alfil(blanco,this.casillas[5][0]);
        // this.casillas[5][0].setPieza(alfilBlanco2);
        // this.piezas_seleccionables_blancas.push(alfilBlanco2.alfil);


        // this.casillas[3][0].setPieza(new Rey(blanco));
        // let reinaBlanca = new Reina(blanco,this.casillas[4][3]);
        // this.casillas[4][3].setPieza(reinaBlanca);
        // this.piezas_seleccionables_blancas.push(reinaBlanca.reina);


        // this.casillas[0][7].setPieza(new torre(lila));
        // this.casillas[7][7].setPieza(new torre(lila));

        let caballoLila1 = new caballo(lila,this.casillas[1][7]);
        this.casillas[1][7].setPieza(caballoLila1);
        this.piezas_seleccionables_lilas.push(caballoLila1.caballo);

        let caballoLila2 = new caballo(lila,this.casillas[6][7]);
        this.casillas[6][7].setPieza(caballoLila2);
        this.piezas_seleccionables_lilas.push(caballoLila2.caballo);
        
        // this.casillas[1][7].setPieza(new caballo(lila));
        // this.casillas[6][7].setPieza(new caballo(lila));

        let alfilLila1 = new Alfil(lila,this.casillas[2][7]);
        this.casillas[2][7].setPieza(alfilLila1);
        this.piezas_seleccionables_lilas.push(alfilLila1.alfil);

        let alfilLila2 = new Alfil(lila,this.casillas[5][7]);
        this.casillas[5][7].setPieza(alfilLila2);
        this.piezas_seleccionables_lilas.push(alfilLila2.alfil);

        // this.casillas[2][7].setPieza(new Alfil(lila));
        // this.casillas[5][7].setPieza(new Alfil(lila));

        // this.casillas[3][7].setPieza(new Rey(lila));
        let reinaLila = new Reina(lila,this.casillas[4][5]);
        this.casillas[4][5].setPieza(reinaLila);
        this.piezas_seleccionables_lilas.push(reinaLila.reina);

        //Peones
        for(let i=0; i<8; i++) {
            let peonBlanco = new peon(blanco,this.casillas[i][1]);
            let peonLila = new peon(lila,this.casillas[i][6]);
            this.casillas[i][1].setPieza(peonBlanco);
            this.casillas[i][6].setPieza(peonLila);
            this.piezas_seleccionables_blancas.push(peonBlanco.peon);
            this.piezas_seleccionables_lilas.push(peonLila.peon);
        }
        
    }

    createGUI (gui,titleGui) {
       
    }
    
    update () {
    
    }
}

export {Tablero};