import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
 
class Rey extends THREE.Object3D {
  constructor(gui,titleGui) { 
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Material
    this.Mat = new THREE.MeshStandardMaterial({color: 0xD29BFD});
    var loader = new THREE.TextureLoader ( ) ;
    var textura = loader.load("../imgs/marmol-blanco.jpg");
    var materialMarmol = new THREE.MeshStandardMaterial({map:textura });
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

    var puntos_base = shape_base.extractPoints(20).shape;

    var Geom_base = new THREE.LatheGeometry(puntos_base,24,0,Math.PI*2);
    Geom_base.translate(0,-0.52,0);
    var base = new THREE.Mesh(Geom_base,materialMarmol);

    //Creamos el cuerpo
    var Geom_cuerpo = new THREE.CylinderGeometry(0.8,0.8,3,32,32);
    Geom_cuerpo.translate(0,3.34,0);
    var cuerpo_brush = new CSG.Brush(Geom_cuerpo,materialMarmol);

    //Hacemos los huecos de la columna
    this.evaluador = new CSG.Evaluator();
    var huecos = this.generarHuecos(20,0.1,3);

    var cuerpo = this.evaluador.evaluate(cuerpo_brush,huecos,CSG.SUBTRACTION);
    cuerpo.material = materialMarmol;

    //Hacemos la cabeza por revolución
    var shape_cabeza = new THREE.Shape();
    shape_cabeza.moveTo(0,0);
    shape_cabeza.lineTo(1.49,0);
    shape_cabeza.lineTo(1.49,0.22);
    shape_cabeza.lineTo(1.28,0.22);
    shape_cabeza.lineTo(1.28,0.38);
    shape_cabeza.lineTo(1.34,0.38);
    shape_cabeza.quadraticCurveTo(1.36,0.53,1.49,0.5);
    shape_cabeza.lineTo(1.49,0.69);
    shape_cabeza.lineTo(1.58,0.69);
    shape_cabeza.lineTo(1.57,1.02);
    shape_cabeza.lineTo(1.66,1.02);
    shape_cabeza.lineTo(1.77,1.31);
    shape_cabeza.bezierCurveTo(1.9,1.3,1.94,1.58,1.79,1.59);
    shape_cabeza.lineTo(0,1.59);
    // shape_cabeza.quadraticCurveTo(1.76,2.14,2.05,2.51);
    // shape_cabeza.bezierCurveTo(2.18,2.53,2.16,2.82,2,2.8);
    // shape_cabeza.lineTo(0,2.8);

    var puntos_cabeza = shape_cabeza.extractPoints(30).shape;

    var Geom_cabeza = new THREE.LatheGeometry(puntos_cabeza,24,0,Math.PI*2);
    Geom_cabeza.scale(0.6,0.6,0.6);
    Geom_cabeza.translate(0,4.84,0);
    var cabeza = new THREE.Mesh(Geom_cabeza,materialMarmol);

    /******************************Corona************************************ */
    
    var conoronaGeo = new THREE.CylinderGeometry(1, 0.8, 0.8);
    var interiorGeo = new THREE.CylinderGeometry(1, 0.7, 0.9);

    var coronaBrush = new CSG.Brush(conoronaGeo, this.Mat);
    var interiorBrush = new CSG.Brush(interiorGeo, this.Mat);

    var corona = this.evaluador.evaluate(coronaBrush, interiorBrush, CSG.SUBTRACTION);
    corona.material = materialDorado;

    var cilindro1Geo = new THREE.CylinderGeometry(0.4, 0.4, 2);
    var cilindro2Geo = new THREE.CylinderGeometry(0.4, 0.4, 2);
    var cilindro3Geo = new THREE.CylinderGeometry(0.4, 0.4, 2);
    var cilindro4Geo = new THREE.CylinderGeometry(0.4, 0.4, 2);

    cilindro1Geo.rotateX(Math.PI/2);
    cilindro1Geo.translate(0, 0.4, 0);
    cilindro2Geo.rotateX(Math.PI/2);
    cilindro2Geo.rotateY(Math.PI/2);
    cilindro2Geo.translate(0, 0.4, 0);
    cilindro3Geo.rotateX(Math.PI/2);
    cilindro3Geo.rotateY(Math.PI/4);
    cilindro3Geo.translate(0, 0.4, 0);
    cilindro4Geo.rotateX(Math.PI/2);
    cilindro4Geo.rotateY(-Math.PI/4);
    cilindro4Geo.translate(0, 0.4, 0);

    var cilindro1Brush = new CSG.Brush(cilindro1Geo, this.Mat);
    var cilindro2Brush = new CSG.Brush(cilindro2Geo, this.Mat);
    var cilindro3Brush = new CSG.Brush(cilindro3Geo, this.Mat);
    var cilindro4Brush = new CSG.Brush(cilindro4Geo, this.Mat);

    var tmp1 = this.evaluador.evaluate(corona, cilindro1Brush, CSG.SUBTRACTION);
    var tmp2 = this.evaluador.evaluate(tmp1, cilindro2Brush, CSG.SUBTRACTION);
    var tmp3 = this.evaluador.evaluate(tmp2, cilindro3Brush, CSG.SUBTRACTION);
    var tmp4 = this.evaluador.evaluate(tmp3, cilindro4Brush, CSG.SUBTRACTION);
    tmp4.material = materialDorado;

    tmp4.position.y = 0.4;

    var esferaGeo = new THREE.SphereGeometry(0.8);
    var cuboGeo = new THREE.BoxGeometry(2,2,2);
    cuboGeo.translate(0, -1, 0);
    esferaGeo.translate(0, 0.4, 0);
    var esferaBrush = new CSG.Brush(esferaGeo, this.Mat);
    var cuboBrush = new CSG.Brush(cuboGeo, this.Mat);

    var tmp5 = this.evaluador.evaluate(esferaBrush, cuboBrush, CSG.SUBTRACTION);

    var corona = new THREE.Object3D();
    corona.add(tmp4);
    corona.add(tmp5);

    for (let i = 0; i < 8; ++i){

      let bolaGeo = new THREE.SphereGeometry(0.1);
      bolaGeo.translate(1, 0.7, 0);
      bolaGeo.rotateY(i*Math.PI/4 + Math.PI/8);

      let bolaBrush = new THREE.Mesh(bolaGeo, this.Mat);
      corona.add(bolaBrush);
    }

    var shapeTuboBase = new THREE.Shape();
    shapeTuboBase.lineTo(0.2, 0);
    shapeTuboBase.lineTo(0.2, 0.1);
    shapeTuboBase.lineTo(-0.2, 0.1);
    shapeTuboBase.lineTo(-0.2, 0);
    shapeTuboBase.lineTo(0, 0);

    var shapeTubo = new THREE.Shape();
    shapeTubo.quadraticCurveTo(0.7, 0.6, 0.4, 1.4);
    shapeTubo.quadraticCurveTo(0.15, 2, -0.5, 2.15);
    shapeTubo.quadraticCurveTo(-1, 1.8, -1.7, 1.8);
    shapeTubo.quadraticCurveTo(-2.25, 1.8, -2.7, 2.15);

    var v2 = shapeTubo.extractPoints (10).shape;
    var v3 = [];
    v2.forEach ( ( v ) => {
      v3.push (new THREE. Vector3 ( v.x , v.y , 0)); // Creamos puntos 3D
    });
    
    var pathGeo = new THREE.CatmullRomCurve3(v3);
    var optionsBarrido = { steps: 20, curveSegments: 6, extrudePath: pathGeo};

    for (let i = 0; i < 8; i++) {
      
      var tuboGeo = new THREE.ExtrudeGeometry(shapeTuboBase, optionsBarrido);
      tuboGeo.scale(0.3, 0.5, 0.5);
      tuboGeo.translate(0.8, 0.4, 0);
      tuboGeo.rotateY(i*Math.PI/4);

      var tuboMesh = new THREE.Mesh(tuboGeo, materialDorado);
      corona.add(tuboMesh);
        
    }

    var shapeCruz = new THREE.Shape();
    shapeCruz.moveTo(0, 0.9);
    shapeCruz.lineTo(0.4, 0.9);
    shapeCruz.lineTo(0.2, 1.5);
    shapeCruz.lineTo(0.5, 1.4);
    shapeCruz.lineTo(0.5, 1.78);
    shapeCruz.lineTo(0.2, 1.67);
    shapeCruz.lineTo(0.3, 2);
    shapeCruz.lineTo(-0.3, 2);
    shapeCruz.lineTo(-0.2, 1.67);
    shapeCruz.lineTo(-0.5, 1.78);
    shapeCruz.lineTo(-0.5, 1.4);
    shapeCruz.lineTo(-0.2, 1.5);
    shapeCruz.lineTo(-0.4, 0.9);
    shapeCruz.lineTo(0, 0.9);
    
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: false

    };

    var cruzGeo = new THREE.ExtrudeGeometry( shapeCruz, extrudeSettings );
    cruzGeo.scale(0.25, 0.25, 0.25);
    cruzGeo.translate(0,1.25, 0);
    var cruzmesh = new THREE.Mesh(cruzGeo, materialDorado);
    corona.add(cruzmesh);

    corona.position.y = 6;

    /**********************************Espada***************************************** */

    var espada = this.crearEspada();

    espada.rotation.z = Math.PI;
    espada.scale.set(1.5, 1.5, 1.5);
    espada.position.set(0, 4, 2);

    var brazoIzquierdo = this.crearBrazo(false, materialMarmol);
    brazoIzquierdo.scale.set(0.8, 0.8, 0.8);
    brazoIzquierdo.position.set(-1.1, 5.7, 0.3);
    
    var brazoDerecho = this.crearBrazo(true, materialMarmol);
    brazoDerecho.scale.set(0.8, 0.8, 0.8);
    brazoDerecho.position.set(1.1, 5.7, 0.3);


    var rey = new THREE.Object3D();
    rey.add(base);
    rey.add(cuerpo);
    rey.add(cabeza);
    rey.add(corona);
    rey.add(espada);
    rey.add(brazoIzquierdo);
    rey.add(brazoDerecho);

    this.add(rey);

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

  crearEspada(){

    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x9c9c9c,      // color plateado claro
        metalness: 0.8,       // completamente metálico
        roughness: 0.2,      // muy pulido, casi como espejo
        envMapIntensity: 1.5,  // reflejos intensos si hay envMap
        flatShading: true
    });
      
    var materialMango = new THREE.MeshStandardMaterial({color: 0x6c3b2a});

    var espada = new THREE.Object3D();

    const verticesOfCube = new Float32Array([
      0.0, 2.6, 0.0,      // 0
      0.25, 2.1, 0.0,   // 1
      -0.25, 2.1, 0.0,  // 2
      0.0, 2.1, -0.125, // 3
      0.0, 2.1, 0.125,  // 4
      0.2, 0.0, 0.1,      // 5
      -0.2, 0.0, 0.1,     // 6
      0.2, 0.0, -0.1,     // 7
      -0.2, 0.0, -0.1,    // 8
      0.0, 0.0, -0.12,    // 9
      0.0, 0.0, 0.12      // 10

    ]);
      
    const indicesOfFaces = new Uint16Array([
      
      0, 1, 3,
      0, 3, 2,
      1, 7, 3,
      2, 3, 8, 
      3, 7, 9, 
      3, 9, 8,
      4, 1, 0,
      2, 4, 0,
      4, 5, 1,
      6, 4, 2,
      10, 5, 4, 
      6, 10, 4,
      2, 8, 6,
      5, 7, 1,
      10, 7, 5,
      10, 9, 7,
      6, 9, 10,
      6, 8, 9
    ]);
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(verticesOfCube, 3));
    geometry.setIndex(new THREE.BufferAttribute(indicesOfFaces, 1));
    geometry.computeVertexNormals(); // Para que se vea bien con iluminación
    
    const hojaEspadaMesh = new THREE.Mesh(geometry, metalMaterial);
    espada.add(hojaEspadaMesh);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // negro
    const edgeLines = new THREE.LineSegments(edges, lineMaterial);

    //espada.add(edgeLines);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // luz general
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    espada.add(ambientLight, directionalLight);

    var cuboGeo = new THREE.BoxGeometry(0.6, 0.2, 0.3);
    cuboGeo.translate(0, -0.1, 0);
    var CuboMesh = new THREE.Mesh(cuboGeo, this.Mat);
    espada.add(CuboMesh);

    var esferaGeo = new THREE.SphereGeometry(0.5);
    esferaGeo.scale(0.3, 1, 0.3);
    esferaGeo.translate(0, -0.3, 0);
    var esferaMesh = new THREE.Mesh(esferaGeo, materialMango);
    espada.add(esferaMesh);

    return (espada);
    
  }

  crearBrazo(derecho, material){
    var brazo = new THREE.Object3D();
        var anteBrazo = new THREE.Object3D();
    
        var manoGeo = new THREE.SphereGeometry(0.4);
        manoGeo.translate(0, -2, 0);
        var mano = new THREE.Mesh(manoGeo, material);
        anteBrazo.add(mano);
    
        var anteBrazoGeo = new THREE.CylinderGeometry(0.3, 0.2, 2);
        anteBrazoGeo.translate(0, -1, 0);
        var anteBrazoMesh = new THREE.Mesh(anteBrazoGeo, material);
        anteBrazo.add(anteBrazoMesh);
        anteBrazo.position.y = -2.4;
    
        anteBrazo.rotation.z = Math.pow(-1, derecho)*3*Math.PI/6;
        
        
    
        var hombroGeo = new THREE.SphereGeometry(0.5);
        var brazoGeo = new THREE.CylinderGeometry(0.35, 0.3, 2.3);
        brazoGeo.translate(0, -1.25, 0);
    
        var hombro = new THREE.Mesh(hombroGeo, material);
        brazo.add(hombro);
        var brazoMesh = new THREE.Mesh(brazoGeo, material);
        brazo.add(brazoMesh);
    
        var codoGeo = new THREE.SphereGeometry(0.3);
        codoGeo.translate(0, -2.4, 0);
        var codo = new THREE.Mesh(codoGeo, material);
        brazo.add(codo);
        brazo.rotation.z = Math.pow(-1, derecho)*-Math.PI/13;
        brazo.rotation.x = -Math.PI/3;
    
        brazo.add(anteBrazo);
        return (brazo);
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

export { Rey };
