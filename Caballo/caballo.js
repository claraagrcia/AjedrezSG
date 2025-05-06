import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
 
class caballo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

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
          child.material = new THREE.MeshNormalMaterial();
        }
      });
      caballo.add ( object ) ;
    } , null , null ) ;

    //*******************Base*********************** */

    //Hacemos la caracola
    var caracola = new THREE.Object3D();

    var material = new THREE.MeshNormalMaterial();

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
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 0.5,
      sizeY : 0.5,
      sizeZ : 0.5,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.sizeX = 0.5;
        this.guiControls.sizeY = 0.5;
        this.guiControls.sizeZ = 0.5;
        
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

export { caballo };
