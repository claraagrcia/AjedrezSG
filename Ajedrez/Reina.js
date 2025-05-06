import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
import { lila } from './Tablero.js';
 
class Reina extends Pieza {
  constructor(color) {
    super(color);
   
    // Material
    this.Mat = new THREE.MeshStandardMaterial({color: color});
    
    //Creamos la base por revolución
    var shape_base = new THREE.Shape();
    shape_base.moveTo(0,0.52);
    shape_base.lineTo(1.52,0.52);
    shape_base.lineTo(1.52,0.88);
    shape_base.quadraticCurveTo(1.47,1,1.35,1.05);
    shape_base.quadraticCurveTo(1.62,1.46,1.13,1.65);
    shape_base.lineTo(1.12,1.77);
    shape_base.quadraticCurveTo(1.08,1.83,1,1.86);
    shape_base.quadraticCurveTo(0.88,1.95,0.92,2.1);
    shape_base.bezierCurveTo(1.04,2.12,1.01,2.38,0.88,2.36);
    shape_base.lineTo(0,2.36);

    var puntos_base = shape_base.extractPoints(20).shape;

    var Geom_base = new THREE.LatheGeometry(puntos_base,24,0,Math.PI*2);
    Geom_base.translate(0,-0.52,0);
    var base = new THREE.Mesh(Geom_base,this.Mat);

    //Creamos el cuerpo
    var Geom_cuerpo = new THREE.CylinderGeometry(0.8,0.8,3,32,32);
    Geom_cuerpo.translate(0,3.34,0);
    var cuerpo_brush = new CSG.Brush(Geom_cuerpo,this.Mat);

    //Hacemos los huecos de la columna
    this.evaluador = new CSG.Evaluator();
    var huecos = this.generarHuecos(20,0.1,3);    
    var cuerpo = this.evaluador.evaluate(cuerpo_brush,huecos,CSG.SUBTRACTION);

    //Creamos la base del capitel por revolución
    var shape_base_capitel = new THREE.Shape();
    shape_base_capitel.moveTo(0,0);
    shape_base_capitel.lineTo(1.87,0);
    shape_base_capitel.bezierCurveTo(1.99,-0.01,1.99,0.21,1.89,0.22);
    shape_base_capitel.quadraticCurveTo(1.84,0.46,2.01,0.6);
    shape_base_capitel.lineTo(2.01,1.09);
    shape_base_capitel.lineTo(0,1.09);

    var puntos_base_capitel = shape_base_capitel.extractPoints(30).shape;

    var Geom_base_capitel = new THREE.LatheGeometry(puntos_base_capitel,24,0,Math.PI*2);
    Geom_base_capitel.scale(0.5,0.5,0.5);
    Geom_base_capitel.translate(0,4.84,0);
    var base_capitel = new THREE.Mesh(Geom_base_capitel,this.Mat);

    //Hacemos las espirales del capitel

    //Primero hacemos una base por extrusión
    var shape_base_espirales = new THREE.Shape();
    shape_base_espirales.moveTo(-0.8,0);
    shape_base_espirales.lineTo(0.8,0);
    shape_base_espirales.bezierCurveTo(1.02,-0.59,2.13,-0.62,2.24,0);
    shape_base_espirales.quadraticCurveTo(2.35,0.72,1.63,0.83);
    shape_base_espirales.lineTo(-1.61,0.83);
    shape_base_espirales.quadraticCurveTo(-2.35,0.62,-2.22,0);
    shape_base_espirales.bezierCurveTo(-2.14,-0.61,-0.97,-0.64,-0.8,0);

    var optionsExtr = {depth: 1.5, steps:2, bevelEnabled: true};
    var geom_base_espirales = new THREE.ExtrudeGeometry(shape_base_espirales,optionsExtr);
    geom_base_espirales.scale(0.8,0.8,0.8);
    geom_base_espirales.translate(0,5.4,-0.65);
    var base_espirales = new THREE.Mesh(geom_base_espirales,this.Mat);

    //Hacemos las espirales de la parte delantera
    var espirales_delanteras = new THREE.Object3D();

    var espiral1 = this.crearEspiral(3,500,0.1,0.5,0);
    var espiral2 = this.crearEspiral(3,500,0.1,0.5,0);
    espiral2.rotateY(Math.PI);
    espiral2.position.set(0,0,1.5);

    var geom_cilindro = new THREE.CylinderGeometry(0.04,0.04,2.5,32,32);
    geom_cilindro.rotateZ(Math.PI/2);
    geom_cilindro.translate(0,6.05,0.75);
    var cilindro = new THREE.Mesh(geom_cilindro,this.Mat);

    espirales_delanteras.add(espiral1);
    espirales_delanteras.add(espiral2);
    espirales_delanteras.add(cilindro);

    //Hacemos las espirales de la parte trasera
    var espirales_traseras = espirales_delanteras.clone(true);
    espirales_traseras.position.set(0,0,-1.6);

    //Corona
    var corona = new THREE.Object3D();

    var geom_cilindro_corona = new THREE.CylinderGeometry(1.1,1.1,0.4,32,32);
    geom_cilindro_corona.translate(0,6.8,0);
    var cilindro_corona_mesh = new THREE.Mesh(geom_cilindro_corona,this.Mat);

    var geom_toro_corona = new THREE.TorusGeometry(1.1,0.1,32);
    geom_toro_corona.rotateX(Math.PI/2);
    geom_toro_corona.translate(0,7,0);
    var toro_corona_mesh = new THREE.Mesh(geom_toro_corona,this.Mat);

    var shape_punta = new THREE.Shape();
    shape_punta.moveTo(-1,0);
    shape_punta.lineTo(1,0);
    shape_punta.lineTo(1,1);
    shape_punta.lineTo(0,3);
    shape_punta.lineTo(-1,1);
    shape_punta.lineTo(-1,0);

    var options_extr_puntas = {depth: 0.5, steps:2, bevelEnabled: false};

    for(let i=0; i<8; i++) {
      var geom_punta = new THREE.ExtrudeGeometry(shape_punta,options_extr_puntas);
      geom_punta.scale(0.5,0.5,0.5);
      geom_punta.rotateX(0.2);
      geom_punta.translate(0,7,0.75);
      geom_punta.rotateY(2*Math.PI*i/8);
      var punta_mesh = new THREE.Mesh(geom_punta,this.Mat);
      corona.add(punta_mesh);
    }
   
    corona.add(toro_corona_mesh);
    corona.add(cilindro_corona_mesh);

    //Lanza
    var lanza = new THREE.Object3D();

    var geom_palo = new THREE.CylinderGeometry(0.1,0.1,6,32,32);
    geom_palo.translate(0,3.125,0);
    var palo_mesh = new THREE.Mesh(geom_palo,this.Mat);

    var geom_bolita = new THREE.SphereGeometry(0.15);
    geom_bolita.translate(0,0.075,0);
    var bolita_mesh = new THREE.Mesh(geom_bolita,this.Mat);

    var geom_adorno = new THREE.TorusGeometry(0.1,0.05,32);
    geom_adorno.rotateX(Math.PI/2);
    geom_adorno.translate(0,0.125,0);
    var adorno_mesh1 = new THREE.Mesh(geom_adorno,this.Mat);
    var adorno_mesh2 = new THREE.Mesh(geom_adorno,this.Mat);
    var adorno_mesh3 = new THREE.Mesh(geom_adorno,this.Mat);
    adorno_mesh2.translateY(6);
    adorno_mesh3.translateY(5.8);

    var geom_punta_superior = new THREE.ConeGeometry(0.2,1,4);
    geom_punta_superior.translate(0,6.9,0);
    var punta_superior_mesh = new THREE.Mesh(geom_punta_superior,this.Mat);

    var geom_punta_inferior = new THREE.ConeGeometry(0.2,0.4,4);
    geom_punta_inferior.rotateZ(Math.PI);
    geom_punta_inferior.translate(0,6.2,0);
    var punta_inferior_mesh = new THREE.Mesh(geom_punta_inferior,this.Mat);

    lanza.translateX(2.4);
    lanza.translateZ(0.4);
    lanza.rotateZ(-0.2);

    lanza.add(punta_inferior_mesh);
    lanza.add(punta_superior_mesh);
    lanza.add(adorno_mesh3);
    lanza.add(adorno_mesh2);
    lanza.add(adorno_mesh1);
    lanza.add(bolita_mesh);
    lanza.add(palo_mesh);

    //Brazos
    var brazo_dcho = this.crearBrazo(0,0.2);
    brazo_dcho.translateX(-2);
    brazo_dcho.translateY(5.4);
    brazo_dcho.rotateZ(-0.1);

    var brazo_izq = this.crearBrazo(-0.3,2);
    brazo_izq.translateX(2);
    brazo_izq.translateY(5.4);
    brazo_izq.rotateZ(0.2);
  
    var reina = new THREE.Object3D();
    reina.add(base);
    reina.add(cuerpo);
    reina.add(base_capitel);
    reina.add(base_espirales);
    reina.add(espirales_delanteras);
    reina.add(espirales_traseras);
    reina.add(corona);
    reina.add(lanza);
    reina.add(brazo_dcho);
    reina.add(brazo_izq);
    
    reina.scale.set(0.2,0.2,0.2);
    if(color == lila) {
      reina.rotateY(Math.PI);
    }
    this.add(reina);

  }

  generarHuecos(num_huecos,radio,altura) {

    var huecos = null;

    for (let i=0; i<num_huecos;i++) {
      var geom_hueco_columna = new THREE.CylinderGeometry(radio,radio,altura,32,32);
      geom_hueco_columna.translate(0,3.34,0.75);
      geom_hueco_columna.rotateY(i*2*Math.PI/num_huecos);
      var hueco_brush = new CSG.Brush(geom_hueco_columna,this.Mat);
      if(i==0) {
        huecos = hueco_brush;
      }
      else {
        huecos = this.evaluador.evaluate(hueco_brush,huecos,CSG.ADDITION);
      } 
    }

    return huecos;
  }

  crearCurvaEspiral(vueltas,pasos,radioInicial,radioFinal,altura) {
    const puntos = [];
  
    for (let i = 0; i <= pasos; i++) {
      const t = i / pasos;
      const angulo = t * Math.PI * 2 * vueltas;
      const radio = radioInicial + t * (radioFinal - radioInicial);
      const x = Math.cos(angulo) * radio;
      const y = Math.sin(angulo) * radio;
      const z = altura * t;
  
      puntos.push(new THREE.Vector3(x, y, z));
    }
  
    return puntos;
  }

  crearEspiral(vueltas,pasos,radioInicial,radioFinal,altura) {
    var shape_espiral = new THREE.Shape();
    shape_espiral.absarc(0,0,0.04,0,2*Math.PI-0.01);

    var puntos_espiral=this.crearCurvaEspiral(3,500,0.1,0.5,0);
    var path_espiral = new THREE.CatmullRomCurve3(puntos_espiral);
    var options = {steps: 50, curveSegments: 4, extrudePath: path_espiral};
  
    var geom_espiral = new THREE.ExtrudeGeometry(shape_espiral,options);
    geom_espiral.rotateZ(Math.PI/2);
    geom_espiral.translate(-1.25,5.55,0.75);
    var espiral = new THREE.Mesh(geom_espiral,this.Mat);
    
    return espiral;
  }

  crearBrazo(anguloX, anguloZ) {
    var brazo = new THREE.Object3D();
    var parte_inf = new THREE.Object3D();

    //Manos
    var geom_mano = new THREE.SphereGeometry(0.3);
    geom_mano.translate(0,-1.5,0);
    var mano = new THREE.Mesh(geom_mano,this.Mat);

    //Antebrazos
    var geom_antebrazo = new THREE.CylinderGeometry(0.2,0.15,1.5,32,32);
    geom_antebrazo.translate(0, -0.75,0);
    var antebrazo = new THREE.Mesh(geom_antebrazo,this.Mat);
    
    //Codos
    var geom_codo = new THREE.SphereGeometry(0.2);
    var codo = new THREE.Mesh(geom_codo,this.Mat);

    parte_inf.add(codo);
    parte_inf.add(antebrazo);
    parte_inf.add(mano);

    parte_inf.translateY(-1.2);
    parte_inf.rotateZ(anguloZ);
    parte_inf.rotateX(anguloX);

    //Parte superior del brazo
    var geom_brazo_sup = new THREE.CylinderGeometry(0.25,0.2,1.2,32,32);
    geom_brazo_sup.translate(0,-0.6,0);
    var brazo_sup = new THREE.Mesh(geom_brazo_sup,this.Mat);

    //Hombros
    var geom_hombro = new THREE.SphereGeometry(0.35);
    var hombro = new THREE.Mesh(geom_hombro,this.Mat);
  
    brazo.add(parte_inf);
    brazo.add(brazo_sup);
    brazo.add(hombro);

    return brazo;
   
  }
}

export { Reina };
