import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import { Pieza } from './Pieza.js' 

class caballo extends Pieza {
  constructor(color) {
    super(color);
    

    //Creamos un objeto 3d caballo
    var caballo = new THREE.Object3D();
    
    //*********************caballo********************** */

    //importamos el modelo del caballo
    var objectLoader = new OBJLoader ( ) ;

    objectLoader.load ( './Seahorse2.0.obj' ,
    ( object ) => {
      //object.scale.set(0.5, 0.5, 0.5);
      object.position.set(0,1.9,0.3);
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({color: color});
        }
      });
      caballo.add ( object ) ;
    } , null , null ) ;

    //*******************Base*********************** */

    //Hacemos la caracola
    var caracola = new THREE.Object3D();

    var material = new THREE.MeshStandardMaterial({color: color});

    var toro1 = new THREE.TorusGeometry(0.8, 0.6);
    toro1.rotateX (Math.PI/2);
    toro1.rotateZ (Math.PI/10);
    var toroMesh1 = new THREE.Mesh(toro1, material);
    caracola.add(toroMesh1);

    var toro2 = new THREE.TorusGeometry(0.6, 0.4);
    toro2.rotateX (Math.PI/2);
    toro2.rotateZ (Math.PI/10);
    toro2.translate(0, 0.7, 0);
    var toroMesh2 = new THREE.Mesh(toro2, material);
    caracola.add(toroMesh2);

    var toro3 = new THREE.TorusGeometry(0.4, 0.2);
    toro3.rotateX (Math.PI/2);
    toro3.rotateZ (Math.PI/10);
    toro3.translate(0, 1.2, 0);
    var toroMesh3 = new THREE.Mesh(toro3, material);
    caracola.add(toroMesh3);

    caracola.scale.set(0.5, 0.5, 0.5);
    
    caballo.add(caracola);

    // Agregar burbujas
    var bubbleGeometry = new THREE.SphereGeometry(0.1);
    const bubbleMaterial = new THREE.MeshStandardMaterial({
      color: 0x87cefa, // azul clarito
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.3,
    });

    var bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble.position.set(0.3, 0.45, 0.4);
    caballo.add(bubble);

    var bubble2 = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble2.position.set(-0.2, 0.55, 0.3);
    caballo.add(bubble2);
    
    var bigBubbleGeometry = new THREE.SphereGeometry(0.2);
    var bigBubble = new THREE.Mesh(bigBubbleGeometry, bubbleMaterial);
    bigBubble.position.set(0.7, 0, -0.3);
    caballo.add(bigBubble);

    var bigBubble2 = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bigBubble2.position.set(0.5, -0.1, -0.5);
    caballo.add(bigBubble2);

    var soporte = new THREE.CylinderGeometry(1, 1, 0.3);
    soporte.translate(0, -0.3, 0);
    var soporteMesh = new THREE.Mesh(soporte, material);
    caballo.add(soporteMesh);
    
    caballo.scale.set(0.3,0.3,0.3);
    caballo.translateY(0.135);
    this.add(caballo);

  }
}

export { caballo };
