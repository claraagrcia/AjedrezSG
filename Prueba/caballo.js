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

    var material = new THREE.MeshStandardMaterial();
    //Manos
    var geom_mano = new THREE.SphereGeometry(0.3);
    geom_mano.translate(0,-1.5,0);
    var mano = new THREE.Mesh(geom_mano, material);

    this.mano = new THREE.Object3D();
    this.mano.position.set(0, -1.5, 0); // igual que la posición de la mano
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
    // parte_inf.rotateZ(anguloZ);
    // parte_inf.rotateX(anguloX);

    //Parte superior del brazo
    var geom_brazo_sup = new THREE.CylinderGeometry(0.25,0.2,1.2,32,32);
    geom_brazo_sup.translate(0,-0.6,0);
    var brazo_sup = new THREE.Mesh(geom_brazo_sup, material);

    //Hombros
    var geom_hombro = new THREE.SphereGeometry(0.35);
    var hombro = new THREE.Mesh(geom_hombro, material);

    // brazo.add(parte_inf);
    // brazo.add(brazo_sup);
    // brazo.add(hombro);

    // brazo.brazo_sup = brazo_sup;
    // brazo.parte_inf = parte_inf;

    this.add(parte_inf);
    this.add(brazo_sup);

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
