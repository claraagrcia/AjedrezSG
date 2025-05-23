import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
 
class peon extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    //Creamos un objeto 3d peon
    var peon = new THREE.Object3D();
    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load("../imgs/flor.png");
    var Mat = new THREE.MeshStandardMaterial({color: 0xD29BFD, normalMap: normalMap, normalScale: new THREE.Vector2(1, 1)});
    //*********************Cuerpo********************** */

    //Creamos el contorno que vamos a revolucionar para hacer el contorno del cuerpo del peon
    var shape = new THREE.Shape();
    shape.moveTo(0,0);
    shape.lineTo(2.0,0);
    shape.lineTo(2.0, 0.25);
    shape.lineTo(1.8, 0.4);
    shape.quadraticCurveTo(1.7, 0.8, 1.5, 0.8);
    shape.lineTo(1.5, 1.0);
    shape.bezierCurveTo(1.0, 1.2, 0.9, 1.4, 0.9, 3);
    shape.quadraticCurveTo(1.5, 3.0, 1.2, 3.25);
    shape.quadraticCurveTo(1.2, 3.5, 0.6, 3.5);
    shape.lineTo(0, 3.5);

    //Creamos el material
    var material = new THREE.MeshStandardMaterial({color:0xD29BFD});

    //Extraemos los puntos del shape
    var points = shape.extractPoints(20).shape;

    //Definimos la geometria
    var geometry = new THREE.LatheGeometry(points,24, 0, Math.PI*2);

    //Contruimos el Mesh
    var mesh = new THREE.Mesh( geometry, Mat);

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
    this.add(peon);
    
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

export { peon };
