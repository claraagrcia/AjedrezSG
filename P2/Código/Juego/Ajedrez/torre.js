import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
import { Pieza } from '../Ajedrez/Pieza.js';
import { verde,rojo } from './Tablero.js';
 
class torre extends Pieza{
  constructor(color,casilla) {
    super(color,casilla);
    this.tipo = "Torre";
    
      //var loader = new THREE.TextureLoader ( ) ;
      //var textura = loader.load("../imgs/texturaMadera.jpg");
      //var materialMadera = new THREE.MeshStandardMaterial({map:textura, color: this.color });

    var loader = new THREE.TextureLoader ( ) ;
    var textura = loader.load("../imgs/wood.jpg");
    var materialMadera = new THREE.MeshStandardMaterial({map:textura , color: color});
    //Crear  la forma
    var contenedor = new THREE.Object3D();
    this.torre = new THREE.Object3D();
    var y = 0; 
    var angle = Math.PI/2;

    //Bloque con 3 filas
    let result = this.createBlock(contenedor, 3, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    //Fila con un bloque menos a la izquierda
    result = this.createMiddleHole(contenedor, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    //Bloque con 1 filas
    result = this.createBlock(contenedor, 1, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    //Fila con un bloque menos a la derecha
    result = this.createRightRow(contenedor, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    //Bloque con 2 filas
    result = this.createBlock(contenedor, 2, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    //Fila con un bloque menos a la izquierda
    result = this.createLeftRow(contenedor, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    //Fila con un bloque menos a la izquierda
    result = this.createLeftRow(contenedor, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    //Bloque con 2 filas
    result = this.createBlock(contenedor, 2, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;
    
    //Fila con un bloque menos en medio
    result = this.createMiddleHole(contenedor, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    //Bloque con 2 filas
    result = this.createBlock(contenedor, 2, y, angle, materialMadera);
    y = result.y;
    angle = result.angle;

    this.createDeco(contenedor);

    contenedor.position.x = -0.77;
    contenedor.position.y = 0.53;
    this.torre.scale.set(0.3,0.3,0.3);
    this.torre.add(contenedor);

    this.torre.userData.refPieza = this;
    this.add(this.torre);

  }
  /**
   * @brief crea por extrusión uno de los cubos que componen la torre
   * @returns el mesh del cubo
   */
  createCubo(material){

    //Hacemos el shape de un ractángulo con los bordes redondeados
    var shape = new THREE.Shape();
    shape.moveTo(0, -2);
    shape.lineTo(0.5, -2);
    shape.quadraticCurveTo(1, -2, 1, -1.5);
    shape.lineTo(1, 1.5);
    shape.quadraticCurveTo(1, 2, 0.5, 2);
    shape.lineTo(-0.5, 2);
    shape.quadraticCurveTo(-1, 2, -1, 1.5);
    shape.lineTo(-1, -1.5);
    shape.quadraticCurveTo(-1, -2, -0.5, -2);
    shape.lineTo(0, -2);

    //Declaramos las opciones de extrusión y ajustamos el bisel
    const extrudeSettings = {
      steps:5,
      depth: 0.85,
      bevelEnabled: true,
      bevelSize: 0.3,
      bevelOffset: 0.01,
      bevelSegments: 6
    };

    //Creamos la geometría, el material y el mesh
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.scale(0.3, 0.5, 0.5);
    geometry.rotateX(Math.PI/2);
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;

  }

  /**
   * @brief posiciona los cubos en filas de 3 para construir la torre 
   * @param {*} torre el objeto al que se van a añadir las filas
   * @param {*} nRows el número de filas que se construirán
   * @param {*} y la altura de la siguiente fila
   * @param {*} angle el ángulo en el que se colocarán los cubos
   * @returns un array con la nueva altura (y) y el nuevo ángulo (angle)
   */
  createBlock(contenedor, nRows, y, angle, material){
   
    var unCubo;

    //Bucle que indica el número de filas a construir
    for(var j = 0; j<nRows; ++j){

      //Bucle que construye una fila
      for(var i = 0; i < 3; ++i ){

        unCubo = this.createCubo(material, material);

        //Dependiendo de la orientación del cubo, hay que aplicar unas traslaciones u otras
        if(Math.abs(angle % Math.PI) < 1e-6){

          unCubo.position.x = i*0.77;

        }else{

          unCubo.position.z = i*0.75 -0.75;
          unCubo.position.x = 0.8;
          
        }
        
        //Se rota y traslada a la altura correcta
        unCubo.position.y = y;
        unCubo.rotation.y = angle;
        contenedor.add(unCubo);

      }

      //Se acturalizan la altura y el ángulo
      y += 0.6;
      angle += Math.PI/2;
    }

    return { y, angle };

  }

  /**
   * @brief crea una fila de dos bloques, faltando el bloque de la derecha
   * @param {*} torre la torre que se esta construyendo
   * @param {*} y la altura de la fila
   * @param {*} angle el ángulo en la que esta fila estará orientada
   * @returns un array con la altura y el ángulo actualizados
   */
  createRightRow(contenedor, y, angle, material){
    
    var unCubo;
    for(var i = 0; i < 2; ++i ){

      unCubo = this.createCubo(material);

      if(angle%Math.PI == 0){

        unCubo.position.x = i*0.77;

      }else{

        unCubo.position.z = i*0.75 -0.75;
        unCubo.position.x = 0.8;
        
      }
      
      unCubo.position.y = y;
      unCubo.rotation.y = angle;
      contenedor.add(unCubo);

    }
    y += 0.6;
    angle += Math.PI/2;

    return { y, angle };
  }

  /**
   * @brief crea una fila de dos bloques, faltando el bloque de la izquierda
   * @param {*} torre la torre que se esta construyendo
   * @param {*} y la altura de la fila
   * @param {*} angle el ángulo en la que esta fila estará orientada
   * @returns un array con la altura y el ángulo actualizados
   */
  createLeftRow(contenedor, y, angle, material){
    
    var unCubo;
    for(var i = 1; i <= 2; ++i ){

      unCubo = this.createCubo(material);

      if(angle%Math.PI == 0){

        unCubo.position.x = i*0.77;

      }else{

        unCubo.position.z = i*0.75 -0.75;
        unCubo.position.x = 0.8;
        
      }
      
      unCubo.position.y = y;
      unCubo.rotation.y = angle;
      contenedor.add(unCubo);

    }
    y += 0.6;
    angle += Math.PI/2;

    return { y, angle };
  }

  /**
   * @brief crea una fila de dos bloques, faltando el bloque central
   * @param {*} torre la torre que se esta construyendo
   * @param {*} y la altura de la fila
   * @param {*} angle el ángulo en la que esta fila estará orientada
   * @returns un array con la altura y el ángulo actualizados
   */
  createMiddleHole(contenedor, y, angle, material){
    
    var unCubo = this.createCubo(material);

    if(angle%Math.PI == 0){

      unCubo.position.x = 0*0.77;

    }else{

      unCubo.position.z = 0*0.75 -0.75;
      unCubo.position.x = 0.8;
      
    }
    
    unCubo.position.y = y;
    unCubo.rotation.y = angle;
    contenedor.add(unCubo);

    var unCubo = this.createCubo(material);

    if(angle%Math.PI == 0){

      unCubo.position.x = 2*0.77;

    }else{

      unCubo.position.z = 2*0.75 -0.75;
      unCubo.position.x = 0.8;
      
    }
    
    unCubo.position.y = y;
    unCubo.rotation.y = angle;
    contenedor.add(unCubo);
    
    y += 0.6;
    angle += Math.PI/2;

    return {y, angle};
  }

  /**
   * @brief crea la decoración de la cima de la torre, en este caso una bandera
   * @param {*} torre la torre que se esta construyendo
   */
  createDeco(contenedor){

    var material = new THREE.MeshStandardMaterial({color:this.color});
    const materialDorado = new THREE.MeshStandardMaterial({
      color: 0xffd700,       // Color dorado (hex)
      metalness: 0.9,        // Máxima apariencia metálica
      roughness: 0.2,        // Un poco rugoso para dar realismo
    });
    var esferaGeo = new THREE.SphereGeometry(0.1);

    //Creamos el shape del mástil de la bandera
    var shape = new THREE.Shape();
    shape.lineTo(0.1, 0);
    shape.quadraticCurveTo(0.15, 0.1, 0.05, 0.1);
    shape.lineTo(0.05, 0.2);
    shape.lineTo(0.1, 0.2);
    shape.quadraticCurveTo(0.1,0.25, 0.03, 0.25);
    shape.lineTo(0.03, 0.4);
    shape.lineTo(0, 0.4);

    //Se crea la geometría por rotación
    var points = shape.extractPoints ( 15 ).shape ;
    var latheGeometry = new THREE. LatheGeometry ( points , 24 , 0 , Math . PI * 2 );

    //Añadimos una esfera de decoración al final del mástil
    esferaGeo.translate(0, 0.3, 0);

    var esferaMesh = new CSG.Brush(esferaGeo, materialDorado);
    var mesh = new CSG.Brush(latheGeometry, materialDorado);

    //creamos la bandera por extrusión
    var bandera = new THREE.Shape();
    bandera.lineTo(0.2, 0);
    bandera.lineTo(0.1, 0.1);
    bandera.lineTo(0.2, 0.2);
    bandera.lineTo(0, 0.2);
    bandera.lineTo(0,0);
    
    const Settings = {
      steps:1,
      depth: 0.05,
      bevelEnabled: false,
    };

    var banderaGeo = new THREE.ExtrudeGeometry(bandera, Settings);
    banderaGeo.scale(1.2, 0.5, 1);
    banderaGeo.translate(0.07, 0.27, -0.02);
    var banderaMesh = new CSG.Brush(banderaGeo, material);

    //Realizamos la unión booleana de las 3 piezas
    var evaluador = new CSG.Evaluator();
    
    var tmp1 = evaluador.evaluate(mesh, esferaMesh, CSG.ADDITION);
    var result = evaluador.evaluate(tmp1, banderaMesh, CSG.ADDITION);
    
    result.scale.set(2.5, 2.5, 2.5);
    result.position.y = 8.5;
    result.position.x = 0.7;

    //Se la añadimos a la torre
    contenedor.add(result);

  }

  getMesh() {
    return this.torre;
  }

  onClick(tablero) {
      this.seleccionada = !this.seleccionada;
      let casillas_validas = this.movimientoPosibles(tablero);
  
      casillas_validas.forEach(casilla_valida => {
        if(this.seleccionada) {
          casilla_valida.setColor(verde);
          if(casilla_valida.pieza != null) {
            casilla_valida.setColor(rojo);
          }
        }
        else {
          casilla_valida.setColor(casilla_valida.colorInicial);
        }
      }) 
  
      return casillas_validas;
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
    
      return casillas_validas;
  
    }
  
}

export { torre };