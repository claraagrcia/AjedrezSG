import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
import { lila,verde,blanco } from './Tablero.js';
 
class peon extends Pieza {
  constructor(color,casilla) {
    super(color,casilla);
    
    //Creamos un objeto 3d peon
    this.peon = new THREE.Object3D();
    
    //*********************Cuerpo********************** */

    //Creamos el contorno que vamos a revolucionar para hacer el contorno del cuerpo del peon
    var shape = new THREE.Shape();
    shape.moveTo(0,0);
    shape.lineTo(2.0);
    shape.lineTo(2.0, 0.25);
    shape.lineTo(1.8, 0.4);
    shape.quadraticCurveTo(1.7, 0.8, 1.5, 0.8);
    shape.lineTo(1.5, 1.0);
    shape.bezierCurveTo(1.0, 1.2, 0.9, 1.4, 0.9, 2,7);
    shape.lineTo(0.9, 3.0);
    shape.quadraticCurveTo(1.5, 3.0, 1.2, 3.25);
    shape.quadraticCurveTo(1.2, 3.5, 0.6, 3.5);
    shape.lineTo(0, 3.5);

    //Creamos el material
    var material = new THREE.MeshStandardMaterial({color: color});

    //Extraemos los puntos del shape
    var points = shape.extractPoints(10).shape;

    //Definimos la geometria
    var geometry = new THREE.LatheGeometry(points,24, 0, Math.PI*2);

    //Contruimos el Mesh
    var mesh = new THREE.Mesh( geometry, material);

    //Lo añadimos como hijo del Object3D
    this.peon.add (mesh);

    //*****************Cabeza**************** */
    //Para ello definimos las geometrias necesarias
    var esfera = new THREE.SphereGeometry(1.3);
    var cubo = new THREE.BoxGeometry(2, 2, 2);
    var cilindro1 = new THREE.CylinderGeometry(0.7,0.7,3,16,16);
    var cilindro2 = new THREE.CylinderGeometry(0.7,0.7,16,16);
    var cilindro3 = new THREE.CylinderGeometry(0.7,0.7,16,16);

    //Posicionamos los cilindros en forma de cruz
    cilindro2.rotateX(Math.PI/2);
    cilindro3.rotateX(Math.PI/2);
    cilindro3.rotateY(Math.PI/2);

    // Creamos los brush
    var BrushEsfera = new CSG.Brush(esfera, material);
    var BrushCubo = new CSG.Brush(cubo, material);
    var Brush1 = new CSG.Brush(cilindro1, material);
    var Brush2 = new CSG.Brush(cilindro2, material);
    var Brush3 = new CSG.Brush(cilindro3, material);

    //creamos el evaluador
    var evaluador = new CSG.Evaluator();

    //Realizamos las operaciones booleanas
    var tmp1 = evaluador.evaluate(BrushCubo, BrushEsfera , CSG.INTERSECTION);
    var tmp2 = evaluador.evaluate(Brush1, Brush2, CSG.ADDITION);
    var tmp3 = evaluador.evaluate(tmp2,Brush3, CSG.ADDITION);
    var resultado = evaluador.evaluate(tmp1, tmp3, CSG.SUBTRACTION);
    //Posicionamos y añadimos al objeto3d
    resultado.position.y = 4.5;
    this.peon.add(resultado);

    //creamos la esfera de dentro de la cabeza, la posicionamos y la añadimos al objeto
    var geometryCabeza = new THREE.SphereGeometry(0.7,10);
    geometryCabeza.translate(0, 4.5, 0);
    var cabeza = new THREE.Mesh(geometryCabeza, material);
    this.peon.add(cabeza);

    //Añadimos el peon al grafo de escena
    this.peon.scale.set(0.15,0.15,0.15);

    this.peon.userData.refPieza = this;
    this.add(this.peon);
    
  }

  getMesh() {
    return this.peon;
  }

  onClick(tablero) {
    this.seleccionada = !this.seleccionada;
    let casillas_validas = this.movimientoPosibles(tablero);

    casillas_validas.forEach(casilla_valida => {
      if(this.seleccionada) {
        casilla_valida.setColor(verde);
      }
      else {
        casilla_valida.setColor(casilla_valida.colorInicial);
      }
    }) 

    return casillas_validas;
  }

  movimientoPosibles(tablero) {

    let casillas_validas = [];
    let casilla_actual;
    let i=this.casilla.posX;
    let j=this.casilla.posY;
    
    if(this.color == blanco) {

      if(j<7) {

        //casilla de delante
        casilla_actual = tablero[i][j+1];
        if(casilla_actual.pieza == null) {
          casillas_validas.push(casilla_actual);
        }

        //Casilla de más adelante si es el primer movimiento
        if(j==1) {
          casilla_actual = tablero[i][j+2];
          if(casilla_actual.pieza == null) {
            casillas_validas.push(casilla_actual);
          }
        }
    
        //casilla derecha
        if(i<7) {
          casilla_actual = tablero[i+1][j+1];
          if(casilla_actual.pieza != null && casilla_actual.pieza.color != this.color) {
            casillas_validas.push(casilla_actual);
          }  
        }
    
        //casilla derecha
        if(i>0) {
          casilla_actual = tablero[i-1][j+1];
          if(casilla_actual.pieza != null && casilla_actual.pieza.color != this.color) {
            casillas_validas.push(casilla_actual);
          }
        } 
      }
    }

    else if(this.color == lila) {

      if(j>0) {

        //casilla de delante
        casilla_actual = tablero[i][j-1];
        if(casilla_actual.pieza == null) {
          casillas_validas.push(casilla_actual);
        }

        //Casilla de más adelante si es el primer movimiento
        if(j==6) {
          casilla_actual = tablero[i][j-2];
          if(casilla_actual.pieza == null) {
            casillas_validas.push(casilla_actual);
          }
        }
    
        //casilla derecha
        if(i<7) {
          casilla_actual = tablero[i+1][j-1];
          if(casilla_actual.pieza != null && casilla_actual.pieza.color != this.color) {
            casillas_validas.push(casilla_actual);
          }  
        }
    
        //casilla derecha
        if(i>0) {
          casilla_actual = tablero[i-1][j-1];
          if(casilla_actual.pieza != null && casilla_actual.pieza.color != this.color) {
            casillas_validas.push(casilla_actual);
          }
        } 
      }
    }

    return casillas_validas;
  }

}

export { peon };
