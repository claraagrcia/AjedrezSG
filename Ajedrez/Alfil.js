import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
 
class Alfil extends Pieza {
  constructor(color) {
    super(color);
    
    // Material
    var Mat = new THREE.MeshStandardMaterial({color: color});
    
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

    var puntos = shape_cabeza.extractPoints(20).shape;

    var Geom_cabeza = new THREE.LatheGeometry(puntos,24,0,Math.PI*2);
    Geom_cabeza.translate(0,8,0.25);
    var brush_cabeza = new CSG.Brush(Geom_cabeza,Mat);

    // Bola superior de la cabeza
    var bola_cabeza = new THREE.SphereGeometry(0.5,32,32);
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

    var puntos_base = shape_base.extractPoints(20).shape;

    var Geom_base = new THREE.LatheGeometry(puntos_base,24,0,Math.PI*2);
    Geom_base.scale(2,1,2);
    Geom_base.translate(0,-1.1,0);
    var mesh_base = new THREE.Mesh(Geom_base,Mat);
    
    
    var alfil = new THREE.Object3D();
    alfil.add(cuerpo);
    alfil.add(cabeza);
    alfil.add(mesh_bola_cabeza);
    alfil.add(mesh_base);

    alfil.scale.set(0.1, 0.1, 0.1);
    alfil.translateY(0.11);

    this.add(alfil);

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
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 1.0,
      sizeY : 1.0,
      sizeZ : 1.0,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.sizeX = 1.0;
        this.guiControls.sizeY = 1.0;
        this.guiControls.sizeZ = 1.0;
        
        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;
        
        this.guiControls.posX = 0.0;
        this.guiControls.posY = 0.0;
        this.guiControls.posZ = 0.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI/2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI/2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.01).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.01).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.01).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.01).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
   
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { Alfil };
