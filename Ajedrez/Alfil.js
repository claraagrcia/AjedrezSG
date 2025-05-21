import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
import { rojo,verde } from './Tablero.js';
 
class Alfil extends Pieza {
  constructor(color,casilla) {
    super(color,casilla);
    this.tipo = "Alfil";
    
    // Material
  
    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load("../imgs/flor.png");
    var Mat = new THREE.MeshStandardMaterial({color: color, normalMap: normalMap});

    //Creampos  la forma del cuerpo
    var shape1_cuerpo = new THREE.Shape();
    shape1_cuerpo.moveTo(0,-2);
    shape1_cuerpo.quadraticCurveTo(1,-2,1,-1);
    shape1_cuerpo.quadraticCurveTo(0.4,1,1,3);
    shape1_cuerpo.quadraticCurveTo(1,4,0,4);
    shape1_cuerpo.quadraticCurveTo(-1,4,-1,3);
    shape1_cuerpo.quadraticCurveTo(-0.4,1,-1,-1);
    shape1_cuerpo.quadraticCurveTo(-1,-2,0,-2);

    var points = shape1_cuerpo.extractPoints(10).shape;
    points.forEach((p) => {
        p.rotateAround(new THREE.Vector2(0,1),Math.PI/2);
    });

    var shape2_cuerpo = new THREE.Shape(points);

    // Hacemos un barrido con forma de hélice
    const radio = 4;
    const paso = 2;
    const num_vueltas = 15/(2*Math.PI);
    const espaciado = 0.1;

    var pts = this.crearHelice(radio,paso,num_vueltas,espaciado);
    var path = new THREE.CatmullRomCurve3(pts);
    var options = {steps: 50, curveSegments: 4, extrudePath: path};

    // Helice 1
    var Geom1_cuerpo = new THREE.ExtrudeGeometry(shape1_cuerpo, options);
    Geom1_cuerpo.scale(0.3,0.3,0.3);

    // Helice 2
    var Geom2_cuerpo = new THREE.ExtrudeGeometry(shape2_cuerpo,options);
    Geom2_cuerpo.scale(0.3,0.3,0.3);

    // Hacemos plana la parte de arriba del cuerpo
    var geomCubo = new THREE.BoxGeometry(3.5,1.5,2.3);
    geomCubo.translate(0,8.8,1);
 
    var brush1_cuerpo = new CSG.Brush(Geom1_cuerpo, Mat);
    var brush2_cuerpo = new CSG.Brush(Geom2_cuerpo,Mat);
    var cuboBrush = new CSG.Brush(geomCubo,Mat);

    var evaluador = new CSG.Evaluator();

    var union_cuerpos = evaluador.evaluate(brush1_cuerpo,brush2_cuerpo,CSG.ADDITION);
    var union_cubo = evaluador.evaluate(union_cuerpos,cuboBrush,CSG.ADDITION);
    var cuerpo = evaluador.evaluate(union_cubo,cuboBrush,CSG.SUBTRACTION);

    // Hacemos la cabeza por revolución
    var shape_cabeza = new THREE.Shape();
    shape_cabeza.moveTo(0,0);
    shape_cabeza.lineTo(1.6,0);
    shape_cabeza.quadraticCurveTo(2,0,2,0.5);
    shape_cabeza.quadraticCurveTo(2,1,1.5,0.9);
    shape_cabeza.quadraticCurveTo(1.6,1.2,1.45,1.4);
    shape_cabeza.quadraticCurveTo(1.3,1.6,1.1,1.7);
    shape_cabeza.quadraticCurveTo(1.4,1.8,1.7,2);
    shape_cabeza.quadraticCurveTo(1.9,2.3,2,2.7);
    shape_cabeza.quadraticCurveTo(1.7,4.7,0,6);

    var puntos = shape_cabeza.extractPoints(5).shape;

    var Geom_cabeza = new THREE.LatheGeometry(puntos,24,0,Math.PI*2);
    Geom_cabeza.translate(0,8,0.25);
    var brush_cabeza = new CSG.Brush(Geom_cabeza,Mat);

    // Bola superior de la cabeza
    var bola_cabeza = new THREE.SphereGeometry(0.5,10,10);
    bola_cabeza.scale(1,0.7,1);
    bola_cabeza.translate(0,14,0.25);
    var mesh_bola_cabeza = new THREE.Mesh(bola_cabeza,Mat);

    // Hacemos el hueco de la cabeza con un barrido
    var shape_hueco_cabeza = new THREE.Shape();
    shape_hueco_cabeza.moveTo(-1,0);
    shape_hueco_cabeza.lineTo(1,0);
    shape_hueco_cabeza.lineTo(1,0.25);
    shape_hueco_cabeza.lineTo(-1,0.25);
    shape_hueco_cabeza.lineTo(-1,0);

    // Curva
    var puntos_curva_cabeza = [];
    for (let i=0; i<1; i+=0.1) {
        puntos_curva_cabeza.push(new THREE.Vector3(i,Math.pow(i,0.3),0));
    }

    var path_cabeza = new THREE.CatmullRomCurve3(puntos_curva_cabeza);
    var options_cabeza = {steps: 50, curveSegments: 4, extrudePath: path_cabeza};
    
    var Geom_hueco_cabeza = new THREE.ExtrudeGeometry(shape_hueco_cabeza,options_cabeza);
    Geom_hueco_cabeza.scale(1.7,1.5,1.8);
    Geom_hueco_cabeza.translate(0,10.5,0);
    var bursh_hueco_cabeza = new CSG.Brush(Geom_hueco_cabeza,Mat);

    var cabeza = evaluador.evaluate(brush_cabeza,bursh_hueco_cabeza,CSG.SUBTRACTION);

    // Hacemos la base por revolución
    var shape_base = new THREE.Shape();
    shape_base.moveTo(0,0);
    shape_base.lineTo(1.6,0);
    shape_base.quadraticCurveTo(2,0,2,0.5);
    shape_base.quadraticCurveTo(2,1,1.5,0.9);
    shape_base.quadraticCurveTo(1.6,1.2,1.45,1.4);
    shape_base.quadraticCurveTo(1.3,1.6,1.1,1.7);
    shape_base.lineTo(0,1.7);

    var puntos_base = shape_base.extractPoints(5).shape;

    var Geom_base = new THREE.LatheGeometry(puntos_base,24,0,Math.PI*2);
    Geom_base.scale(2,1,2);
    Geom_base.translate(0,-1.1,0);
    var mesh_base = new THREE.Mesh(Geom_base,Mat);
    
    let contenedor = new THREE.Object3D(); 
    contenedor.add(cuerpo);
    contenedor.add(cabeza);
    contenedor.add(mesh_bola_cabeza);
    contenedor.add(mesh_base);

    contenedor.position.y = 1.1;

    this.alfil = new THREE.Object3D();
    this.alfil.add(contenedor);
    this.alfil.scale.set(0.1, 0.1, 0.1);

    this.alfil.userData.refPieza = this;
    this.add(this.alfil);

  }

  getMesh() {
    return this.alfil;
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

  crearHelice(radio,paso,num_vueltas,espacio_entre_puntos) {
   
    let pts = [];
    const maxAngulo = num_vueltas * Math.PI * 2; // Ángulo total recorrido

    for (let i=0; i<=maxAngulo; i+=espacio_entre_puntos) {
      const x = radio * Math.cos(i);
      const y = paso*i;
      const z =radio * Math.sin(i);
      
      pts.push(new THREE.Vector3(x,y,z));
    }

    return pts;
  }
  
  movimientoPosibles(tablero) {

    let casillas_validas = [];
    let casilla_actual;
    let i=this.casilla.posX;
    let j=this.casilla.posY;
    
    //Diagonal ++
    while(i<7 && j>0) {
      i++;
      j--;
      casilla_actual = tablero[i][j];
      if(casilla_actual.pieza!=null) {
        i=7;
        j=0;
        if(casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
      else {
        casillas_validas.push(casilla_actual);
      }
    }

    //Diagonal +-
    i=this.casilla.posX;
    j=this.casilla.posY;
    while(i<7 && j<7) {
      i++;
      j++;
      casilla_actual = tablero[i][j];
      if(casilla_actual.pieza!=null) {
        i=7;
        j=7;
        if(casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
      else {
        casillas_validas.push(casilla_actual);
      }
    }

    //Diagonal --
    i=this.casilla.posX;
    j=this.casilla.posY;
    while(i>0 && j<7) {
      i--;
      j++;
      casilla_actual = tablero[i][j];
      if(casilla_actual.pieza!=null) {
        i=0;
        j=7;
        if(casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
      else {
        casillas_validas.push(casilla_actual);
      }
    }

    //Diagonal -+
    i=this.casilla.posX;
    j=this.casilla.posY;
    while(i>0 && j>0) {
      i--;
      j--;
      casilla_actual = tablero[i][j];
      if(casilla_actual.pieza!=null) {
        i=0;
        j=0;
        if(casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
      else {
        casillas_validas.push(casilla_actual);
      }
    }

    return casillas_validas;

  }
}

export { Alfil };
