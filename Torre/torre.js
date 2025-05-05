import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'
 
class torre extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    //Crear  la forma

    var torre = new THREE.Object3D();
    var y = 0; 
    var angle = Math.PI/2;

    //Bloque con 3 filas
    let result = this.createBlock(torre, 3, y, angle);
    y = result.y;
    angle = result.angle;

    //Fila con un bloque menos a la izquierda
    result = this.createMiddleHole(torre, y, angle);
    y = result.y;
    angle = result.angle;

    //Bloque con 1 filas
    result = this.createBlock(torre, 1, y, angle);
    y = result.y;
    angle = result.angle;

    //Fila con un bloque menos a la derecha
    result = this.createRightRow(torre, y, angle);
    y = result.y;
    angle = result.angle;

    //Bloque con 2 filas
    result = this.createBlock(torre, 2, y, angle);
    y = result.y;
    angle = result.angle;

    //Fila con un bloque menos a la izquierda
    result = this.createLeftRow(torre, y, angle);
    y = result.y;
    angle = result.angle;

    //Fila con un bloque menos a la izquierda
    result = this.createLeftRow(torre, y, angle);
    y = result.y;
    angle = result.angle;

    //Bloque con 2 filas
    result = this.createBlock(torre, 2, y, angle);
    y = result.y;
    angle = result.angle;
    
    //Fila con un bloque menos en medio
    result = this.createMiddleHole(torre, y, angle);
    y = result.y;
    angle = result.angle;

    //Bloque con 2 filas
    result = this.createBlock(torre, 2, y, angle);
    y = result.y;
    angle = result.angle;

    this.createDeco(torre);
    this.add(torre);

  }
  /**
   * @brief crea por extrusión uno de los cubos que componen la torre
   * @returns el mesh del cubo
   */
  createCubo(){

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
    var material = new THREE.MeshNormalMaterial();
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
  createBlock(torre, nRows, y, angle){
   
    var unCubo;

    //Bucle que indica el número de filas a construir
    for(var j = 0; j<nRows; ++j){

      //Bucle que construye una fila
      for(var i = 0; i < 3; ++i ){

        unCubo = this.createCubo();

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
        torre.add(unCubo);

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
  createRightRow(torre, y, angle){
    
    var unCubo;
    for(var i = 0; i < 2; ++i ){

      unCubo = this.createCubo();

      if(angle%Math.PI == 0){

        unCubo.position.x = i*0.77;

      }else{

        unCubo.position.z = i*0.75 -0.75;
        unCubo.position.x = 0.8;
        
      }
      
      unCubo.position.y = y;
      unCubo.rotation.y = angle;
      torre.add(unCubo);

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
  createLeftRow(torre, y, angle){
    
    var unCubo;
    for(var i = 1; i <= 2; ++i ){

      unCubo = this.createCubo();

      if(angle%Math.PI == 0){

        unCubo.position.x = i*0.77;

      }else{

        unCubo.position.z = i*0.75 -0.75;
        unCubo.position.x = 0.8;
        
      }
      
      unCubo.position.y = y;
      unCubo.rotation.y = angle;
      torre.add(unCubo);

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
  createMiddleHole(torre, y, angle){
    
    var unCubo = this.createCubo();

    if(angle%Math.PI == 0){

      unCubo.position.x = 0*0.77;

    }else{

      unCubo.position.z = 0*0.75 -0.75;
      unCubo.position.x = 0.8;
      
    }
    
    unCubo.position.y = y;
    unCubo.rotation.y = angle;
    torre.add(unCubo);

    var unCubo = this.createCubo();

    if(angle%Math.PI == 0){

      unCubo.position.x = 2*0.77;

    }else{

      unCubo.position.z = 2*0.75 -0.75;
      unCubo.position.x = 0.8;
      
    }
    
    unCubo.position.y = y;
    unCubo.rotation.y = angle;
    torre.add(unCubo);
    
    y += 0.6;
    angle += Math.PI/2;

    return {y, angle};
  }

  /**
   * @brief crea la decoración de la cima de la torre, en este caso una bandera
   * @param {*} torre la torre que se esta construyendo
   */
  createDeco(torre){

    var material = new THREE.MeshNormalMaterial();
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

    var esferaMesh = new CSG.Brush(esferaGeo, material);
    var mesh = new CSG.Brush(latheGeometry, material);

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
    torre.add(result);

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

export { torre };