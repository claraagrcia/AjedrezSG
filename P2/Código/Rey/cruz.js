import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
 
class cruz extends THREE.Object3D {
  constructor(gui,titleGui) { 
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Material
    this.Mat = new THREE.MeshNormalMaterial;
   
      
    

    var brazo = new THREE.Object3D();
    var anteBrazo = new THREE.Object3D();

    var manoGeo = new THREE.SphereGeometry(0.35);
    manoGeo.translate(0, -2, 0);
    var mano = new THREE.Mesh(manoGeo, this.Mat);
    anteBrazo.add(mano);

    var anteBrazoGeo = new THREE.CylinderGeometry(0.3, 0.2, 2);
    anteBrazoGeo.translate(0, -1, 0);
    var anteBrazoMesh = new THREE.Mesh(anteBrazoGeo, this.Mat);
    anteBrazo.add(anteBrazoMesh);
    anteBrazo.position.y = -2.5;

    anteBrazo.rotation.z = 3*Math.PI/5;
    

    var hombroGeo = new THREE.SphereGeometry(0.5);
    var brazoGeo = new THREE.CylinderGeometry(0.35, 0.3, 2.5);
    brazoGeo.translate(0, -1.25, 0);

    var hombro = new THREE.Mesh(hombroGeo, this.Mat);
    brazo.add(hombro);
    var brazoMesh = new THREE.Mesh(brazoGeo, this.Mat);
    brazo.add(brazoMesh);

    var codoGeo = new THREE.SphereGeometry(0.3);
    codoGeo.translate(0, -2.5, 0);
    var codo = new THREE.Mesh(codoGeo, this.Mat);
    brazo.add(codo);
    brazo.rotation.z = -Math.PI/6;
    brazo.rotation.x = -Math.PI/5;

    brazo.add(anteBrazo);
    this.add(brazo);

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

export { cruz };
