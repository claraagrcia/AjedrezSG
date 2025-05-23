import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import { Pieza } from './Pieza.js' 
import {lila,verde,rojo} from './Tablero.js'

class caballo extends Pieza {
  constructor(color,casilla) {
    super(color,casilla);
    this.tipo = "Caballo";

    //Creamos un objeto 3d caballo
    let contenedor = new THREE.Object3D();
    
    //*********************caballo********************** */

    //importamos el modelo del caballo
    var objectLoader = new OBJLoader ( ) ;

    objectLoader.load ( '../models/Seahorse2.0.obj' ,
    ( object ) => {
      //object.scale.set(0.5, 0.5, 0.5);
      object.position.set(0,1.9,0.3);
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({color: color});
        }
      });
      contenedor.add ( object ) ;
    } , null , null ) ;

    //*******************Base*********************** */

    //Hacemos la caracola
    var caracola = new THREE.Object3D();

    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load("../imgs/sand_normal_map.png");

    var material = new THREE.MeshPhysicalMaterial({color: 0xf5deb3, roughness:0.7, reflectivity:0.2, normalMap: normalMap});
    var materialCaracola = new THREE.MeshPhysicalMaterial({color: 0xd3d3d3, roughness:0.7, clearcoat:0.8});

    var toro1 = new THREE.TorusGeometry(0.8, 0.6,20,20);
    toro1.rotateX (Math.PI/2);
    toro1.rotateZ (Math.PI/10);
    var toroMesh1 = new THREE.Mesh(toro1, materialCaracola);
    caracola.add(toroMesh1);

    var toro2 = new THREE.TorusGeometry(0.6, 0.4,20,20);
    toro2.rotateX (Math.PI/2);
    toro2.rotateZ (Math.PI/10);
    toro2.translate(0, 0.7, 0);
    var toroMesh2 = new THREE.Mesh(toro2, materialCaracola);
    caracola.add(toroMesh2);

    var toro3 = new THREE.TorusGeometry(0.4, 0.2,20,20);
    toro3.rotateX (Math.PI/2);
    toro3.rotateZ (Math.PI/10);
    toro3.translate(0, 1.2, 0);
    var toroMesh3 = new THREE.Mesh(toro3, materialCaracola);
    caracola.add(toroMesh3);

    caracola.scale.set(0.5, 0.5, 0.5);
    
    contenedor.add(caracola);

    // Agregar burbujas
    var bubbleGeometry = new THREE.SphereGeometry(0.1,10);
    const bubbleMaterial = new THREE.MeshStandardMaterial({
      color: 0x87cefa, // azul clarito
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.3,
    });

    var bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble.position.set(0.3, 0.45, 0.4);
    contenedor.add(bubble);

    var bubble2 = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble2.position.set(-0.2, 0.55, 0.3);
    contenedor.add(bubble2);
    
    var bigBubbleGeometry = new THREE.SphereGeometry(0.2,10);
    var bigBubble = new THREE.Mesh(bigBubbleGeometry, bubbleMaterial);
    bigBubble.position.set(0.7, 0, -0.3);
    contenedor.add(bigBubble);

    var bigBubble2 = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bigBubble2.position.set(0.5, -0.1, -0.5);
    contenedor.add(bigBubble2);

    var soporte = new THREE.CylinderGeometry(1, 1, 0.3,20,20);
    soporte.translate(0, -0.3, 0);
    var soporteMesh = new THREE.Mesh(soporte, material);
    contenedor.add(soporteMesh);
    
    contenedor.position.y = 0.45;

    this.caballo = new THREE.Object3D();
    this.caballo.add(contenedor);
    this.caballo.scale.set(0.4,0.4,0.4);
  
    
    if(color == lila) {
      this.caballo.rotateY(Math.PI);
    }

    this.caballo.userData.refPieza = this;
    this.add(this.caballo);

  }

  getMesh() {
    return this.caballo;
  }

  onClick(tablero) {
    this.seleccionada = !this.seleccionada;
    let casillas_validas = this.movimientoPosibles(tablero);

    casillas_validas.forEach(casilla_valida => {
      if(this.seleccionada) {
        casilla_valida.setColor(verde);
        if(casilla_valida.pieza != null) {
          casilla_valida.setColor(rojo);
        }
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

    //L hacia delante
    if(j>1) {

      //Derecha
      if(i<7) {
        casilla_actual = tablero[i+1][j-2];
        if(casilla_actual.pieza == null || casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }

      //Izquierda
      if(i>0) {
        casilla_actual = tablero[i-1][j-2];
        if(casilla_actual.pieza == null || casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
    }

    //L hacia atrás
    if(j<6) {

      //Izquierda
      if(i>0) {
        casilla_actual = tablero[i-1][j+2];
        if(casilla_actual.pieza == null || casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }

      //Derecha
      if(i<7) {
        casilla_actual = tablero[i+1][j+2];
        if(casilla_actual.pieza == null || casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
    }

    //L hacia la derecha
    if(i<6) {

      //Arriba
      if(j>0) {
        casilla_actual = tablero[i+2][j-1];
        if(casilla_actual.pieza == null || casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }

      //Abajo
      if(j<7) {
        casilla_actual = tablero[i+2][j+1];
        if(casilla_actual.pieza == null || casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
    }

    //L hacia la izquierda
    if(i>1) {

      //Arriba
      if(j>0) {
        casilla_actual = tablero[i-2][j-1];
        if(casilla_actual.pieza == null || casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }

      //Abajo
      if(j<7) {
        casilla_actual = tablero[i-2][j+1];
        if(casilla_actual.pieza == null || casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
    }

    return casillas_validas;
  }
}

export { caballo };
