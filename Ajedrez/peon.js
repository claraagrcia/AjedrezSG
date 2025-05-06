import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from './Pieza.js';
 
class peon extends Pieza {
  constructor(color) {
    super(color);
    
    //Creamos un objeto 3d peon
    var peon = new THREE.Object3D();
    
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
    var points = shape.extractPoints(20).shape;

    //Definimos la geometria
    var geometry = new THREE.LatheGeometry(points,24, 0, Math.PI*2);

    //Contruimos el Mesh
    var mesh = new THREE.Mesh( geometry, material);

    //Lo añadimos como hijo del Object3D
    peon.add (mesh);

    //*****************Cabeza**************** */
    //Para ello definimos las geometrias necesarias
    var esfera = new THREE.SphereGeometry(1.3, 32, 16 );
    var cubo = new THREE.BoxGeometry(2, 2, 2);
    var cilindro1 = new THREE.CylinderGeometry(0.7,0.7,3);
    var cilindro2 = new THREE.CylinderGeometry(0.7,0.7,3);
    var cilindro3 = new THREE.CylinderGeometry(0.7,0.7,3);

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
    peon.add(resultado);

    //creamos la esfera de dentro de la cabeza, la posicionamos y la añadimos al objeto
    var geometryCabeza = new THREE.SphereGeometry(0.7);
    geometryCabeza.translate(0, 4.5, 0);
    var cabeza = new THREE.Mesh(geometryCabeza, material);
    peon.add(cabeza);

    //Añadimos el peon al grafo de escena
    peon.scale.set(0.15,0.15,0.15);
    this.add(peon);
    
  }

}

export { peon };
