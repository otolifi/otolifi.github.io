import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {useEffect, useRef} from 'react';
import {Wall, Formwork, metric, panelDepth, files} from './Formwork';
import { BoxGeometry, MeshBasicMaterial, Mesh, AmbientLight, MeshPhongMaterial, Group, SphereGeometry, Object3D } from 'three';
import { clone } from '@babel/types';


/**
 * 
 * 
 * CARREGAR TODA A BIBLIOTECA PRIMEIRO!!!
 * 
 * 
 * 
 * 
 * 
 */







function TDCCanvas() {
  let loader = new GLTFLoader();
  var products = {};
  let products2 = [];

  function loadModel(url) {
    return new Promise((resolve, reject) => {
      let loader = new GLTFLoader();
      loader.load(url, resolve);
    });
  }


  Object.keys(files[8]).forEach(length => {
    console.log(files[8][length]);
    let file = 'glb/' + files[8][length];
    loader.load(file, (glb) => {
      products[length] = glb.scene.children[0];
      products2.push(glb.scene.children[0]);
      //glb.scene.name = length;
    });
  });
  console.log(products);
  console.log('keys')
  console.log(products2);
  //console.log(Object.keys(products));
  //let copias = JSON.parse(JSON.stringify(products))
  //console.log(copias)
  //let copia = {...products["24"]};
  //let copia = Object.assign({}, products["24"]);
  //let copia = JSON.parse(JSON.stringify(products["24"]));
  //let copia = products["24"].clone();
  //console.log(copia);




  const cubeRef = useRef(null);
  let controls = useRef(null);

  const wall = new Wall();



  wall.addWallNode(0, 0); //node1
  wall.addWallNode(2, 0); //node2
  wall.addWallNode(0, 1); //node3
  wall.addWallNode(-1, 0); //node4
  wall.addWallNode(2, 1); //node5



  let [node1, node2, node3, node4, node5] = wall.nodes

  wall.addWallSegment(node1, node2, 3, 0.10);
  wall.addWallSegment(node1, node3, 3, 0.10);
  wall.addWallSegment(node1, node4, 2, 0.10);

  wall.addWallSegment(node2, node5, 3, 0.10);
  wall.addWallSegment(node5, node3, 2, 0.10);

  let form = new Formwork(wall);
  form.makeCorners(wall.nodes, .15);
  //form.makeWallForms(wall.segments);


  wall.exportGeometry();
  console.log(wall);

  function insertPanel(width, length, height, scene, color) {
    let geometry = new BoxGeometry(length, height, width);
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    let material = new MeshPhongMaterial({color: color});
    let mesh = new Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
  }

  function _insertPanel(length, height, scene) {
    if (files[8]["24"] != undefined) {
      let loader = new GLTFLoader();
    let url = 'glb/' + files["8"]["24"];
    loader.load(url, (obj) => {
      scene.add(obj.scene);
      obj.scene.scale.x = 1/39.37
      obj.scene.scale.y = 1/39.37
      obj.scene.scale.z = 1/39.37
      //console.log('obj')
      console.log(obj);
      //console.log(obj.scene);
      //console.log(obj.scene.children[0]);
      return obj;
    })
    }
    
  }

  function movePanel(panel, distance, direction) {
    panel.position.x = distance * Math.cos(direction);
    panel.position.z = distance * Math.sin(direction);
  }

  function rotatePanel(panel, angle) {
    panel.rotation.y += angle;
  }

  

  async function getPanels() {
    let loader = new GLTFLoader();
    let item = await Promise.all([
      loader.loadAsync('glb/sp-ic6x8.glb')
    ]);
    return item;
  }

  function loadPart(url) {
    return new Promise((resolve, reject) => {
      let loader = new GLTFLoader();
      loader.load(url, obj => {
        resolve(obj);
        console.log(obj);
      });
    });
  }

  let scene, camera, renderer;
  var coisa;

  function init() {
    console.log('canvas loade');
    console.log(files);
    console.log(files[8]);
    console.log(files[8]["24"]);


    
    
    scene = new THREE.Scene();

    loadPart('glb/sp-24x8.glb').then(obj => {
      console.log(obj.scene);
      scene.add(obj.scene);
      obj.scene.position.x = -2;
      obj.scene.scale.x = 1/39.37;
      obj.scene.scale.y = 1/39.37;
      obj.scene.scale.z = 1/39.37;
    });


    /*

    coisa = new Object3D();
    var box = new BoxGeometry(2,2,2);
    var mat1 = new MeshBasicMaterial({color: 0x00ff00});
    var sphere = new SphereGeometry(1, 6, 6);
    var mat2 = new MeshBasicMaterial({color: 0xff0000});
    var mesh1 = new Mesh(box, mat1);
    var mesh2 = new Mesh(sphere, mat2);
    mesh2.position.y += 2;
    coisa.add(mesh1)
    coisa.add(mesh2)
    scene.add(coisa);

    */

    

    /*
    const items = await Promise.all([
      loader.loadAsync('glb/sp-24x8.glb'),
      loader.loadAsync('glb/sp-22x8.glb'),
      loader.loadAsync('glb/sp-20x8.glb'),
      loader.loadAsync('glb/sp-18x8.glb'),
      loader.loadAsync('glb/sp-16x8.glb'),
      loader.loadAsync('glb/sp-14x8.glb'),
      loader.loadAsync('glb/sp-12x8.glb'),
      loader.loadAsync('glb/sp-ic6x8.glb')
    ])

    console.log(items);

    let positions = 0;

    scene.add(items[0].scene);
    scene.add(items[1].scene);
    items.forEach(obj=>{
      scene.add(obj.scene);
      obj.scene.position.x = positions;
      positions += 0.5;
    })
    */

    let light0 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        let light1 = new THREE.DirectionalLight(0xffffff, 1);
        let light2 = new THREE.DirectionalLight(0xffffff, 1);
        light2.position.set(0, -5, 2);
        scene.add(light1);
        scene.add(light2);
        scene.add(light0);
    
    camera = new THREE.PerspectiveCamera(
      75,
      cubeRef.current.clientWidth / cubeRef.current.clientHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(cubeRef.current.clientWidth, cubeRef.current.clientHeight);
    cubeRef.current.appendChild(renderer.domElement);
    
    /*
    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    */

   console.log(wall.nodes);
   console.log(wall.segments);

   wall.nodes.forEach((node) => {
    let geom = new BoxGeometry(
      node.rectangle[0],
      node.rectangle[2],
      node.rectangle[1]);
    //geom = new BoxGeometry(1,.1,2);
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    console.log(randomColor)
    let mat = new MeshBasicMaterial({color: 0x0808080});
    let mesh = new Mesh(geom, mat);
    mesh.position.x = node.rectangle[3][0];
    mesh.position.z = -node.rectangle[3][1];
    scene.add(mesh);
  });

    wall.segments.forEach((segment) => {
      let geom = new BoxGeometry(
        segment.rectangle[0],
        segment.rectangle[2],
        segment.rectangle[1]);
      //geom = new BoxGeometry(1,.1,2);
      let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
      console.log(randomColor)
      let mat = new MeshBasicMaterial({color: 0x808080});
      let mesh = new Mesh(geom, mat);
      mesh.position.x = segment.rectangle[3][0];
      mesh.position.z = -segment.rectangle[3][1];
      scene.add(mesh);
    });

    wall.segments.forEach((segment) => {
      let kicker = [segment.node.start.position.x, segment.node.start.position.y];
      let distance = 0;
      let thicknessStart = 0;
      let extensionStart = 0;
      let thick1 = 0;
      let thick2 = 0;
      switch (segment.direction) {
        case 0:
          thick1 = segment.node.start.thickness.top;
          thick2 = segment.node.start.thickness.bottom;
          extensionStart = segment.node.start.extension.right;
          break;
        case Math.PI / 2:
          thick1 = segment.node.start.thickness.left;
          thick2 = segment.node.start.thickness.right;
          extensionStart = segment.node.start.extension.top;
        case Math.PI:
          thick1 = segment.node.start.thickness.top;
          thick2 = segment.node.start.thickness.bottom;
          extensionStart = segment.node.start.extension.left;
          break;
        case Math.PI / 2:
          thick1 = segment.node.start.thickness.left;
          thick2 = segment.node.start.thickness.right;
          extensionStart = segment.node.start.extension.bottom;
        default:
          break;
      }
      console.log('debug thick + extension')
      thicknessStart = Math.max(thick1, thick2) / 2;
      console.log(thicknessStart + "," + extensionStart);
      distance += thicknessStart + extensionStart;

      console.log('segmento')
      console.log(form.makeWallForm(segment))
      
      form.makeWallForm(segment).forEach(size => {


        let mSize = metric(size);

        let item;
        loadPart('glb/sp-24x8.glb').then(obj => {
          //console.log(obj.scene);
          item = obj.scene;
          //scene.add(obj.scene);
          scene.add(item);
          console.log(item);
          console.log(distance);

          item.scale.x = 1/39.37;
          item.scale.y = 1/39.37;
          item.scale.z = 1/39.37;
          item.position.x = segment.node.start.position.x + (segment.thickness/2) * Math.cos(segment.direction-Math.PI/2) + distance * Math.cos(segment.direction);
          item.position.z = -(segment.node.start.position.y + (segment.thickness/2) * Math.sin(segment.direction-Math.PI/2) + distance * Math.sin(segment.direction));
          item.rotation.y = segment.direction;

          console.log(item.position);



        }).then(obj => {
          console.log(obj);
          /*
          item.scale.x = 1/39.37;
          item.scale.y = 1/39.37;
          item.scale.z = 1/39.37;
          item.position.x = segment.node.start.position.x + (segment.thickness/2) * Math.cos(segment.direction-Math.PI/2) + distance * Math.cos(segment.direction);
          item.position.z = -(segment.node.start.position.y + (segment.thickness/2) * Math.sin(segment.direction-Math.PI/2) + distance * Math.sin(segment.direction));
          item.rotation.y = segment.direction;
          */
          console.log('chegou')
        });

        let product = products["12"];
        console.log('panel 12')
        console.log(product)
        scene.add(product);
        console.log(Object.keys(products));
        //product.scale.y = 1/39.37;
        //product.scale.z = 1/39.37;
        //product.position.x = segment.node.start.position.x + (segment.thickness/2) * Math.cos(segment.direction-Math.PI/2) + distance * Math.cos(segment.direction);
        //product.position.z = -(segment.node.start.position.y + (segment.thickness/2) * Math.sin(segment.direction-Math.PI/2) + distance * Math.sin(segment.direction));
        //product.rotation.y = segment.direction;
        

        distance += mSize / 2;
        console.log('msize');
        console.log(mSize);
        let color = '#' + Math.floor(Math.random()*16777215).toString(16);
        let panel = insertPanel(panelDepth, mSize, 1.1, scene, color);
        panel.position.x = segment.node.start.position.x + (panelDepth/2 + segment.thickness/2) * Math.cos(segment.direction-Math.PI/2) + distance * Math.cos(segment.direction);
        panel.position.z = -(segment.node.start.position.y + (panelDepth/2 + segment.thickness/2) * Math.sin(segment.direction-Math.PI/2) + distance * Math.sin(segment.direction));
        panel.rotation.y = segment.direction;
        panel = insertPanel(panelDepth, mSize, 1.1, scene, color);
        panel.position.x = segment.node.start.position.x + (panelDepth/2 + segment.thickness/2) * Math.cos(segment.direction+Math.PI/2) + distance * Math.cos(segment.direction);
        panel.position.z = -(segment.node.start.position.y + (panelDepth/2 + segment.thickness/2) * Math.sin(segment.direction+Math.PI/2) + distance * Math.sin(segment.direction));
        panel.rotation.y = segment.direction + Math.PI;
        distance += mSize / 2;

        
      })
    });

    /*
    let formPart;
    let model1 = loadModel('../glb/sp-24x8.glb');
    console.log(model1)
    model1.then(obj => {
      formPart = obj.scene;
    }).then(scene.add(formPart));
    console.log(model1.scene);
    console.log(model1)
    */
    
    let light = new AmbientLight();
    scene.add(light);

    console.log(scene);

    camera.position.z = 5;

    controls = new OrbitControls(camera, renderer.domElement)
    controls.update();

    console.log(products);
    console.log(Object.keys(products));
    console.log(products["1"]);
    console.log(products2);
    console.log(products2[0]);
    console.log('fim')

    animate();
  }

  function animate () {
    requestAnimationFrame(animate);
    
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    
    //console.log(model1);
    controls.update();

    renderer.render(scene, camera);
  };



  useEffect(() => {
    init();
  }, [])
  return (
      <div ref={cubeRef} className="main" style={{ width: "100%", height: "800px", margin: "0px" }}></div>
  )
}

export default TDCCanvas;
