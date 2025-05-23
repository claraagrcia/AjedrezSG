import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
 
class Reina extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    this.createGUI(gui,titleGui);

    // Material
    this.Mat = new THREE.MeshStandardMaterial({color:0xD29BFD});
 
    var loader = new THREE.TextureLoader ( ) ;
    var textura = loader.load("../imgs/marmol-blanco.jpg");
    var materialMarmol = new THREE.MeshStandardMaterial({map:textura});

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
    var base = new THREE.Mesh(Geom_base, materialMarmol);

    //Creamos el cuerpo
    var Geom_cuerpo = new THREE.CylinderGeometry(0.8,0.8,3,32,32);
    Geom_cuerpo.translate(0,3.34,0);
    var cuerpo_brush = new CSG.Brush(Geom_cuerpo, materialMarmol);

    //Hacemos los huecos de la columna
    this.evaluador = new CSG.Evaluator();
    var huecos = this.generarHuecos(20,0.1,3, materialMarmol);    
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
    var base_espirales = new THREE.Mesh(geom_base_espirales, materialMarmol);

    //Hacemos las espirales de la parte delantera
    var espirales_delanteras = new THREE.Object3D();

    var espiral1 = this.crearEspiral(3,500,0.1,0.5,0, materialMarmol);
    var espiral2 = this.crearEspiral(3,500,0.1,0.5,0, materialMarmol);
    espiral2.rotateY(Math.PI);
    espiral2.position.set(0,0,1.5);

    var geom_cilindro = new THREE.CylinderGeometry(0.04,0.04,2.5,32,32);
    geom_cilindro.rotateZ(Math.PI/2);
    geom_cilindro.translate(0,6.05,0.75);
    var cilindro = new THREE.Mesh(geom_cilindro, materialMarmol);

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
    var cilindro_corona_mesh = new THREE.Mesh(geom_cilindro_corona, materialDorado);

    var geom_toro_corona = new THREE.TorusGeometry(1.1,0.1,32);
    geom_toro_corona.rotateX(Math.PI/2);
    geom_toro_corona.translate(0,7,0);
    var toro_corona_mesh = new THREE.Mesh(geom_toro_corona, materialDorado);

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

    //Lanza

    var materialMango = new THREE.MeshStandardMaterial({color: 0x6c3b2a});
    var materialAdornos= new THREE.MeshStandardMaterial({color: 0xD29BFD});
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x9c9c9c,      // color plateado claro
        metalness: 0.8,       // completamente metálico
        roughness: 0.2,      // muy pulido, casi como espejo
        envMapIntensity: 1.5,  // reflejos intensos si hay envMap
        flatShading: true
    });

    var lanza = new THREE.Object3D();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // luz general
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 6, 0);
    lanza.add(ambientLight, directionalLight);

    var geom_palo = new THREE.CylinderGeometry(0.1,0.1,6,32,32);
    geom_palo.translate(0,3.125,0);
    var palo_mesh = new THREE.Mesh(geom_palo, materialMango);

    var geom_bolita = new THREE.SphereGeometry(0.15);
    geom_bolita.translate(0,0.075,0);
    var bolita_mesh = new THREE.Mesh(geom_bolita, materialAdornos);

    var geom_adorno = new THREE.TorusGeometry(0.1,0.05,32);
    geom_adorno.rotateX(Math.PI/2);
    geom_adorno.translate(0,0.125,0);
    var adorno_mesh1 = new THREE.Mesh(geom_adorno, materialAdornos);
    var adorno_mesh2 = new THREE.Mesh(geom_adorno, materialAdornos);
    var adorno_mesh3 = new THREE.Mesh(geom_adorno, materialAdornos);
    adorno_mesh2.translateY(6);
    adorno_mesh3.translateY(5.8);

    var geom_punta_superior = new THREE.ConeGeometry(0.2,1,4);
    geom_punta_superior.translate(0,6.9,0);
    var punta_superior_mesh = new THREE.Mesh(geom_punta_superior, metalMaterial);

    var geom_punta_inferior = new THREE.ConeGeometry(0.2,0.4,4);
    geom_punta_inferior.rotateZ(Math.PI);
    geom_punta_inferior.translate(0,6.2,0);
    var punta_inferior_mesh = new THREE.Mesh(geom_punta_inferior, metalMaterial);

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
    var brazo_dcho = this.crearBrazo(0,0.2, materialMarmol);
    brazo_dcho.translateX(-2);
    brazo_dcho.translateY(5.4);
    brazo_dcho.rotateZ(-0.1);

    var brazo_izq = this.crearBrazo(-0.3,2, materialMarmol);
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
    this.add(reina);

  }

  generarHuecos(num_huecos,radio,altura, materialMarmol) {

    var huecos = null;

    for (let i=0; i<num_huecos;i++) {
      var geom_hueco_columna = new THREE.CylinderGeometry(radio,radio,altura,32,32);
      geom_hueco_columna.translate(0,3.34,0.75);
      geom_hueco_columna.rotateY(i*2*Math.PI/num_huecos);
      var hueco_brush = new CSG.Brush(geom_hueco_columna, materialMarmol);
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

  crearEspiral(vueltas,pasos,radioInicial,radioFinal,altura, materialMarmol) {
    var shape_espiral = new THREE.Shape();
    shape_espiral.absarc(0,0,0.04,0,2*Math.PI-0.01);

    var puntos_espiral=this.crearCurvaEspiral(3,500,0.1,0.5,0);
    var path_espiral = new THREE.CatmullRomCurve3(puntos_espiral);
    var options = {steps: 50, curveSegments: 4, extrudePath: path_espiral};
  
    var geom_espiral = new THREE.ExtrudeGeometry(shape_espiral,options);
    geom_espiral.rotateZ(Math.PI/2);
    geom_espiral.translate(-1.25,5.55,0.75);
    var espiral = new THREE.Mesh(geom_espiral, materialMarmol);
    
    return espiral;
  }

  crearBrazo(anguloX, anguloZ, materialMarmol) {
    var brazo = new THREE.Object3D();
    var parte_inf = new THREE.Object3D();

    //Manos
    var geom_mano = new THREE.SphereGeometry(0.3);
    geom_mano.translate(0,-1.5,0);
    var mano = new THREE.Mesh(geom_mano,materialMarmol);

    //Antebrazos
    var geom_antebrazo = new THREE.CylinderGeometry(0.2,0.15,1.5,32,32);
    geom_antebrazo.translate(0, -0.75,0);
    var antebrazo = new THREE.Mesh(geom_antebrazo,materialMarmol);
    
    //Codos
    var geom_codo = new THREE.SphereGeometry(0.2);
    var codo = new THREE.Mesh(geom_codo,materialMarmol);

    parte_inf.add(codo);
    parte_inf.add(antebrazo);
    parte_inf.add(mano);

    parte_inf.translateY(-1.2);
    parte_inf.rotateZ(anguloZ);
    parte_inf.rotateX(anguloX);

    //Parte superior del brazo
    var geom_brazo_sup = new THREE.CylinderGeometry(0.25,0.2,1.2,32,32);
    geom_brazo_sup.translate(0,-0.6,0);
    var brazo_sup = new THREE.Mesh(geom_brazo_sup,materialMarmol);

    //Hombros
    var geom_hombro = new THREE.SphereGeometry(0.35);
    var hombro = new THREE.Mesh(geom_hombro,materialMarmol);
  
    brazo.add(parte_inf);
    brazo.add(brazo_sup);
    brazo.add(hombro);

    return brazo;
   
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

export { Reina };
