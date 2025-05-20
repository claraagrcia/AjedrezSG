import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import * as TWEEN from '../libs/tween.module.js'
import { Pieza } from './Pieza.js';
import { lila,verde } from './Tablero.js';
 
class Reina extends Pieza {
  constructor(color,casilla) {
    super(color,casilla);
   
    // Material
    this.Mat = new THREE.MeshStandardMaterial({color: color});

    var loader = new THREE.TextureLoader ( ) ;
    var textura = loader.load("../imgs/marmol-blanco.jpg");
    var materialMarmol = new THREE.MeshStandardMaterial({map:textura , color: color});

    const materialDorado = new THREE.MeshStandardMaterial({
      color: 0xffd700,       // Color dorado (hex)
      metalness: 0.9,        // Máxima apariencia metálica
      roughness: 0.2,        // Un poco rugoso para dar realismo
    });
    
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

    var puntos_base = shape_base.extractPoints(10).shape;

    var Geom_base = new THREE.LatheGeometry(puntos_base,24,0,Math.PI*2);
    Geom_base.translate(0,-0.52,0);
    var base = new THREE.Mesh(Geom_base, materialMarmol);

    //Creamos el cuerpo
    var Geom_cuerpo = new THREE.CylinderGeometry(0.8,0.8,3,10,10);
    Geom_cuerpo.translate(0,3.34,0);
    var cuerpo_brush = new CSG.Brush(Geom_cuerpo, materialMarmol);

    //Hacemos los huecos de la columna
    this.evaluador = new CSG.Evaluator();
    var huecos = this.generarHuecos(20,0.1,3);    
    var cuerpo = this.evaluador.evaluate(cuerpo_brush,huecos,CSG.SUBTRACTION);
    cuerpo.material = materialMarmol;

    //Creamos la base del capitel por revolución
    var shape_base_capitel = new THREE.Shape();
    shape_base_capitel.moveTo(0,0);
    shape_base_capitel.lineTo(1.87,0);
    shape_base_capitel.bezierCurveTo(1.99,-0.01,1.99,0.21,1.89,0.22);
    shape_base_capitel.quadraticCurveTo(1.84,0.46,2.01,0.6);
    shape_base_capitel.lineTo(2.01,1.09);
    shape_base_capitel.lineTo(0,1.09);

    var puntos_base_capitel = shape_base_capitel.extractPoints(10).shape;

    var Geom_base_capitel = new THREE.LatheGeometry(puntos_base_capitel,24,0,Math.PI*2);
    Geom_base_capitel.scale(0.5,0.5,0.5);
    Geom_base_capitel.translate(0,4.84,0);
    var base_capitel = new THREE.Mesh(Geom_base_capitel, materialMarmol);

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
    var base_espirales = new THREE.Mesh(geom_base_espirales,materialMarmol);

    //Hacemos las espirales de la parte delantera
    var espirales_delanteras = new THREE.Object3D();

    var espiral1 = this.crearEspiral(3,500,0.1,0.5,0);
    var espiral2 = this.crearEspiral(3,500,0.1,0.5,0);
    espiral2.rotateY(Math.PI);
    espiral2.position.set(0,0,1.5);

    var geom_cilindro = new THREE.CylinderGeometry(0.04,0.04,2.5,10,10);
    geom_cilindro.rotateZ(Math.PI/2);
    geom_cilindro.translate(0,6.05,0.75);
    var cilindro = new THREE.Mesh(geom_cilindro,materialMarmol);

    espirales_delanteras.add(espiral1);
    espirales_delanteras.add(espiral2);
    espirales_delanteras.add(cilindro);

    //Hacemos las espirales de la parte trasera
    var espirales_traseras = espirales_delanteras.clone(true);
    espirales_traseras.position.set(0,0,-1.6);

    //Corona
    var corona = new THREE.Object3D();

    var geom_cilindro_corona = new THREE.CylinderGeometry(1.1,1.1,0.4,10,10);
    geom_cilindro_corona.translate(0,6.8,0);
    var cilindro_corona_mesh = new THREE.Mesh(geom_cilindro_corona,materialDorado);

    var geom_toro_corona = new THREE.TorusGeometry(1.1,0.1,10);
    geom_toro_corona.rotateX(Math.PI/2);
    geom_toro_corona.translate(0,7,0);
    var toro_corona_mesh = new THREE.Mesh(geom_toro_corona,materialDorado);

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
      var punta_mesh = new THREE.Mesh(geom_punta, materialDorado);
      corona.add(punta_mesh);
    }
   
    corona.add(toro_corona_mesh);
    corona.add(cilindro_corona_mesh);


    //Brazos
    var brazo_dcho = this.crearBrazoDerecho(0,0.2, materialMarmol);
    brazo_dcho.translateX(-2);
    brazo_dcho.translateY(5.4);
    brazo_dcho.rotateZ(-0.1);

    this.brazo_izq = this.crearBrazoIzquierdo(0,2, materialMarmol);
    this.brazo_izq.translateX(2);
    this.brazo_izq.translateY(5.4);
    this.brazo_izq.rotateZ(0.2);
  
    this.reina = new THREE.Object3D();
    this.reina.add(base);
    this.reina.add(cuerpo);
    this.reina.add(base_capitel);
    this.reina.add(base_espirales);
    this.reina.add(espirales_delanteras);
    this.reina.add(espirales_traseras);
    this.reina.add(corona);
    //this.reina.add(this.lanza);
    this.reina.add(brazo_dcho);
    this.reina.add(this.brazo_izq);
    
    this.reina.scale.set(0.2,0.2,0.2);


    this.reina.userData.refPieza = this;
    this.add(this.reina);
  }

  getMesh() {
    return this.reina;
  }

  onClick(tablero) {
    //this.lucha();
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

  crearBrazoDerecho(anguloX, anguloZ, material) {
    var brazo = new THREE.Object3D();
    var parte_inf = new THREE.Object3D();

    //Manos
    var geom_mano = new THREE.SphereGeometry(0.3);
    geom_mano.translate(0,-1.5,0);
    var mano = new THREE.Mesh(geom_mano, material);

    //Antebrazos
    var geom_antebrazo = new THREE.CylinderGeometry(0.2,0.15,1.5,32,32);
    geom_antebrazo.translate(0, -0.75,0);
    var antebrazo = new THREE.Mesh(geom_antebrazo, material);
    
    //Codos
    var geom_codo = new THREE.SphereGeometry(0.2);
    var codo = new THREE.Mesh(geom_codo,material);

    parte_inf.add(codo);
    parte_inf.add(antebrazo);
    parte_inf.add(mano);

    parte_inf.translateY(-1.2);
    parte_inf.rotateZ(anguloZ);
    parte_inf.rotateX(anguloX);

    //Parte superior del brazo
    var geom_brazo_sup = new THREE.CylinderGeometry(0.25,0.2,1.2,32,32);
    geom_brazo_sup.translate(0,-0.6,0);
    var brazo_sup = new THREE.Mesh(geom_brazo_sup, material);

    //Hombros
    var geom_hombro = new THREE.SphereGeometry(0.35);
    var hombro = new THREE.Mesh(geom_hombro, material);

    brazo.add(parte_inf);
    brazo.add(brazo_sup);
    brazo.add(hombro);

    brazo.brazo_sup = brazo_sup;
    brazo.parte_inf = parte_inf;

    return brazo;
   
  }

  crearBrazoIzquierdo(anguloX, anguloZ, material) {

    var brazo = new THREE.Object3D();
    var parte_inf = new THREE.Object3D();

    //Lanza
    var materialMango = new THREE.MeshStandardMaterial({color: 0x6c3b2a});
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x9c9c9c,      // color plateado claro
        metalness: 0.8,       // completamente metálico
        roughness: 0.2,      // muy pulido, casi como espejo
        envMapIntensity: 1.5,  // reflejos intensos si hay envMap
        flatShading: true
    });
    this.lanza = new THREE.Object3D();

    var geom_palo = new THREE.CylinderGeometry(0.1,0.1,6,10,10);
    geom_palo.translate(0,3.125,0);
    var palo_mesh = new THREE.Mesh(geom_palo, materialMango);

    var geom_bolita = new THREE.SphereGeometry(0.15,10);
    geom_bolita.translate(0,0.075,0);
    var bolita_mesh = new THREE.Mesh(geom_bolita,this.Mat);

    var geom_adorno = new THREE.TorusGeometry(0.1,0.05,10);
    geom_adorno.rotateX(Math.PI/2);
    geom_adorno.translate(0,0.125,0);
    var adorno_mesh1 = new THREE.Mesh(geom_adorno,this.Mat);
    var adorno_mesh2 = new THREE.Mesh(geom_adorno,this.Mat);
    var adorno_mesh3 = new THREE.Mesh(geom_adorno,this.Mat);
    adorno_mesh2.translateY(6);
    adorno_mesh3.translateY(5.8);

    var geom_punta_superior = new THREE.ConeGeometry(0.2,1,4);
    geom_punta_superior.translate(0,6.9,0);
    var punta_superior_mesh = new THREE.Mesh(geom_punta_superior,metalMaterial);

    var geom_punta_inferior = new THREE.ConeGeometry(0.2,0.4,4);
    geom_punta_inferior.rotateZ(Math.PI);
    geom_punta_inferior.translate(0,6.2,0);
    var punta_inferior_mesh = new THREE.Mesh(geom_punta_inferior,metalMaterial);

    this.lanza.rotation.set(0,0,-Math.PI/2);
    this.lanza.position.x = -4.5;
    

    this.lanza.add(punta_inferior_mesh);
    this.lanza.add(punta_superior_mesh);
    this.lanza.add(adorno_mesh3);
    this.lanza.add(adorno_mesh2);
    this.lanza.add(adorno_mesh1);
    this.lanza.add(bolita_mesh);
    this.lanza.add(palo_mesh);

    //Manos
    var geom_mano = new THREE.SphereGeometry(0.3);
    geom_mano.translate(0,-1.5,0);
    var mano = new THREE.Mesh(geom_mano, material);

    this.mano = new THREE.Object3D();
    this.mano.position.set(0, -1.5, 0); // igual que la posición de la mano
    this.mano.rotation.z = -Math.PI/4;
    this.mano.add(this.lanza);

    mano.add(this.mano);

    //Antebrazos
    var geom_antebrazo = new THREE.CylinderGeometry(0.2,0.15,1.5,32,32);
    geom_antebrazo.translate(0, -0.75,0);
    var antebrazo = new THREE.Mesh(geom_antebrazo, material);
    
    //Codos
    var geom_codo = new THREE.SphereGeometry(0.2);
    var codo = new THREE.Mesh(geom_codo,material);

    parte_inf.add(codo);
    parte_inf.add(antebrazo);
    parte_inf.add(mano);

    parte_inf.translateY(-1.2);
    parte_inf.rotateZ(anguloZ);
    parte_inf.rotateX(anguloX);

    //Parte superior del brazo
    var geom_brazo_sup = new THREE.CylinderGeometry(0.25,0.2,1.2,32,32);
    geom_brazo_sup.translate(0,-0.6,0);
    var brazo_sup = new THREE.Mesh(geom_brazo_sup, material);

    //Hombros
    var geom_hombro = new THREE.SphereGeometry(0.35);
    var hombro = new THREE.Mesh(geom_hombro, material);

    brazo.add(parte_inf);
    brazo.add(brazo_sup);
    brazo.add(hombro);

    brazo.brazo_sup = brazo_sup;
    brazo.parte_inf = parte_inf;

    return brazo;
   
  }

  customBackIn(overshoot) {
    return function(t) {
      return t * t * ((overshoot + 1) * t - overshoot);
    };
  }

  lucha(pieza_seleccionada,casilla_seleccionada,tablero,escena) {
console.log(this.reina.rotation.y);
    const brazo_izq = this.brazo_izq;
    const mano = this.mano;
    const lanza = this.lanza;

    // Posición actual
const origen = new THREE.Vector3();
this.reina.getWorldPosition(origen);

// Posición del objetivo
const destino = new THREE.Vector3();
casilla_seleccionada.pieza.getMesh().getWorldPosition(destino);

// Dirección en plano XZ
const dx = destino.x - origen.x;
const dz = destino.z - origen.z;

// Calculamos ángulo (asumiendo que el peón por defecto mira en Z+)
const angulo = Math.atan2(dx, dz);
    new TWEEN.Tween(this.reina.rotation)
    .to({ y: angulo }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

    //Estiramos el brazo tween 1
    new TWEEN.Tween({parte_superior: this.brazo_izq.rotation.z, parte_inferior: this.brazo_izq.parte_inf.rotation.z})
    .to({
      parte_superior: Math.PI/2-0.2,
      parte_inferior: 0,
    }, 1000) 
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function(obj) {
      brazo_izq.rotation.z = obj.parte_superior;
      brazo_izq.parte_inf.rotation.z = obj.parte_inferior;
    })
    .onComplete(() => {

      //Giramos lanza tween 2
      new TWEEN.Tween({rotX: 0})
      .to({
        rotX: Math.PI*9,
      }, 2500) 
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(obj) {
        mano.rotation.z = 0;
        mano.rotation.y = -obj.rotX;
      })
      .onComplete(() => {

        //Doblamos el brazo tween 3
        new TWEEN.Tween({rot_brazo: this.brazo_izq.parte_inf.rotation.z, rot_mano : this.mano.rotation.y})
        .to({
          rot_brazo: Math.PI/2,
          rot_mano: this.mano.rotation.y+Math.PI/2
        }, 1500) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function(obj) {
          brazo_izq.parte_inf.rotation.z = obj.rot_brazo;
          mano.rotation.y = obj.rot_mano;
        })
        .onComplete(() => {

          //Impulsamos el brazo tween 4
          new TWEEN.Tween({rot_brazo: this.brazo_izq.parte_inf.rotation.y})
          .to({
            rot_brazo: -Math.PI/6,
          }, 1500) 
          .easing(this.customBackIn(10))
          .onUpdate(function(obj) {
            brazo_izq.parte_inf.rotation.y = obj.rot_brazo;
          })
          .onComplete(() => {
            //lanza.mover(casilla_seleccionada,tablero,escena);
            
            
            const worldPosition = new THREE.Vector3();
            lanza.getWorldPosition(worldPosition);

            var destino = casilla_seleccionada.obtenerPosicionMundo(); 
            const posicionActual = lanza.position;
            const parent = lanza.parent;
            const destinoLocal = parent.worldToLocal(destino.clone());
             
            //Tiramos la lanza tween 5
            new TWEEN.Tween(posicionActual)
            .to({
            x: destinoLocal.x -6,
            y: destinoLocal.y,
            z: destinoLocal.z
            }, 800) 
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function(obj) {
              lanza.position.set(obj.x, obj.y, obj.z);
            })
            .onComplete(() => {

              casilla_seleccionada.pieza.changeColor(0xFF6961);
              //pieza_seleccionada.mover(casilla_seleccionada,tablero,escena);

              //Volvemos hacia atrás el impulso tween 6
              new TWEEN.Tween({rot_brazo: this.brazo_izq.parte_inf.rotation.y})
              .to({
                rot_brazo: 0,
              }, 1500) 
              .easing(TWEEN.Easing.Quadratic.Out)
              .onUpdate(function(obj) {
                brazo_izq.parte_inf.rotation.y = obj.rot_brazo;
              })
              .onComplete(() => {
                
                //Desdoblamos el brazo tween 7
                  new TWEEN.Tween({rot_brazo: this.brazo_izq.parte_inf.rotation.z, rot_mano : this.mano.rotation.y})
                  .to({
                    rot_brazo: 0,
                    rot_mano: this.mano.rotation.y+Math.PI/2
                  }, 1500) 
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .onUpdate(function(obj) {
                    brazo_izq.parte_inf.rotation.z = obj.rot_brazo;
                    mano.rotation.y = obj.rot_mano;
                  })
                  .onComplete(() => { 

                    new TWEEN.Tween({parte_superior: this.brazo_izq.rotation.z, parte_inferior: this.brazo_izq.parte_inf.rotation.z})
                    .to({
                      parte_superior: 0,
                      parte_inferior: 2,
                    }, 1000) 
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(function(obj) {
                      mano.rotation.z = -0.7;
                      brazo_izq.rotation.z = obj.parte_superior;
                      brazo_izq.parte_inf.rotation.z = obj.parte_inferior;
                      
                    })
                    .onComplete(() => {

                      pieza_seleccionada.mover(casilla_seleccionada,tablero,escena);
                    })
                    .start();
                  })
                  .start();
                
              })
              .start();
              
            })

            .yoyo(true)
            .repeat(1)
            .start();
            
          })
          .start();
        })
        .start();
          
      })
      .start();
        
    })
    .start();
  }

  movimientoPosibles(tablero) {

    let casillas_validas = [];
    let casilla_actual;
    let i=this.casilla.posX;
    let j=this.casilla.posY;
    
    //Arriba
    while (j>0) {
      j--;
      casilla_actual = tablero[i][j];

      if(casilla_actual.pieza!=null) {
        j=0;
        if(casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
      else {
        casillas_validas.push(casilla_actual);
      }
    }

    //Abajo
    j=this.casilla.posY;
    while (j<7) {
      j++;
      casilla_actual = tablero[i][j];
      if(casilla_actual.pieza!=null) {
        j=7;
        if(casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
      else {
        casillas_validas.push(casilla_actual);
      }
    }

    //Derecha
    j=this.casilla.posY;
    while(i<7) {
      i++;
      casilla_actual = tablero[i][j];
      if(casilla_actual.pieza!=null) {
        i=7;
        if(casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
      else {
        casillas_validas.push(casilla_actual);
      }
    }

    //Izquierda
    i=this.casilla.posX;
    while (i>0) {
      i--;
      casilla_actual = tablero[i][j];
      if(casilla_actual.pieza!=null) {
        i=0;
        if(casilla_actual.pieza.color != this.color) {
          casillas_validas.push(casilla_actual);
        }
      }
      else {
        casillas_validas.push(casilla_actual);
      }
    }

    //Diagonal ++
    i=this.casilla.posX;
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

export { Reina };
