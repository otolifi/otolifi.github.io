import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
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

  

  const link = document.createElement( 'a' );
			link.style.display = 'none';
      document.body.appendChild( link );

  function save( blob, filename ) {
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
  }

  function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
  }

  function saveArrayBuffer( buffer, filename ) {
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
  }


  const button = document.createElement('a');
  button.text = "Save project";
  button.href = save;
  document.body.appendChild(button);


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



  wall.addWallNode(0, 0, 0, 2); //node1
  wall.addWallNode(2.286, 0, 0, 2); //node2
  wall.addWallNode(0, 2.286, 0, 2); //node3
  wall.addWallNode(-2.286, 0, 0, 2); //node4
  wall.addWallNode(2.286, 2.286, 0, 2); //node5



  let [node1, node2, node3, node4, node5] = wall.nodes

  wall.addWallSegment(node1, node2, 2, 0.1524);
  wall.addWallSegment(node1, node3, 2, 0.1524);
  wall.addWallSegment(node1, node4, 2, 0.1524);

  wall.addWallSegment(node2, node5, 2, 0.1524);
  wall.addWallSegment(node5, node3, 2, 0.1524);

  let form = new Formwork(wall);
  form.makeCorners(wall.nodes, .1524);
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

  function _insertPanel(length, x, y, rotation, scene) {
    console.log(length)
    let glb = 'glb/' + files[8][length];
    console.log(glb);
    if (files[8][length] != undefined) {
      let loader = new GLTFLoader();
      loader.load(glb, (obj) => {
        let root = obj.scene;
        scene.add(root);
        root.scale.x = 0.0254;
        root.scale.y = 0.0254;
        root.scale.z = 0.0254;
        root.position.x = x;
        root.position.z = y;
        root.rotation.y = rotation;
        //let bbHelper = new THREE.BoundingBoxHelper( root, 0xffffff );
        //scene.add( bbHelper );
      })
    }
  }

  function insertCorner(node, scene) {
    let [c0, c1, c2, c3] = [false, false, false, false];
    if (node.extension.right > 0 && node.extension.bottom > 0) {
      _insertPanel("IC6", node.points[1][0], -node.points[1][1], 0, scene);
      c1 = true;
    }
    if (node.extension.right > 0 && node.extension.top > 0) {
      _insertPanel("IC6", node.points[2][0], -node.points[2][1], Math.PI/2, scene);
      c2 = true;
    }
    if (node.extension.left > 0 && node.extension.top > 0) {
      _insertPanel("IC6", node.points[3][0], -node.points[3][1], Math.PI, scene);
      c3 = true;
    }
    if (node.extension.left > 0 && node.extension.bottom > 0) {
      _insertPanel("IC6", node.points[0][0], -node.points[0][1], -Math.PI/2, scene);
      c0 = true;
    }
    //"L" corners
    if (!c0 && c1 && !c2 && !c3) {
      _insertPanel("OC", node.points[3][0], -node.points[3][1], Math.PI, scene);
      let cornerHeight = parseInt((node.extension.right + node.thickness.bottom) / 0.0254);
      _insertPanel(cornerHeight, node.points[3][0], -node.points[3][1], -Math.PI/2, scene);
      let cornerWidth = parseInt((node.extension.bottom + node.thickness.right) / 0.0254);
      let ptWx = node.points[3][0] + (node.extension.bottom + node.thickness.right) * Math.cos(0);
      let ptWy = -(node.points[3][1] + (node.extension.right + node.thickness.right) * Math.sin(0));
      _insertPanel(cornerWidth, ptWx, ptWy, Math.PI, scene);
    }
    if (!c0 && !c1 && c2 && !c3) {
      _insertPanel("OC", node.points[0][0], -node.points[0][1], -Math.PI/2, scene);
      let cornerHeight = parseInt((node.extension.left + node.thickness.bottom) / 0.0254);
      let ptWx = node.points[0][0] + (node.extension.bottom + node.thickness.left) * Math.cos(-Math.PI/2);
      let ptWy = -(node.points[0][1] + (node.extension.bottom + node.thickness.left) * Math.sin(-Math.PI/2));
      _insertPanel(cornerHeight, ptWx, ptWy, -Math.PI/2, scene);
      let cornerWidth = parseInt((node.extension.bottom + node.thickness.left) / 0.0254);
      _insertPanel(cornerWidth, node.points[0][0], -node.points[0][1], 0, scene);
    }
    if (!c0 && !c1 && !c2 && c3) {
      _insertPanel("OC", node.points[1][0], -node.points[1][1], 0, scene);
      let cornerHeight = parseInt((node.extension.left + node.thickness.top) / 0.0254);
      _insertPanel(cornerHeight, node.points[1][0], -node.points[1][1], Math.PI/2, scene);
      let cornerWidth = parseInt((node.extension.top + node.thickness.left) / 0.0254);
      let ptWx = node.points[1][0] + (node.extension.top + node.thickness.left) * Math.cos(Math.PI);
      let ptWy = -(node.points[1][1] + (node.extension.top + node.thickness.left) * Math.sin(Math.PI));
      _insertPanel(cornerWidth, ptWx, ptWy, 0, scene);
    }
    if (c0 && !c1 && !c2 && !c3) {
      _insertPanel("OC", node.points[2][0], -node.points[2][1], Math.PI/2, scene);
      let cornerHeight = parseInt((node.extension.left + node.thickness.bottom) / 0.0254);
      let ptWx = node.points[2][0] + (node.extension.bottom + node.thickness.left) * Math.cos(-Math.PI/2);
      let ptWy = -(node.points[2][1] + (node.extension.bottom + node.thickness.left) * Math.sin(-Math.PI/2));
      _insertPanel(cornerHeight, ptWx, ptWy, Math.PI/2, scene);
      let cornerWidth = parseInt((node.extension.bottom + node.thickness.left) / 0.0254);
      _insertPanel(cornerWidth, node.points[2][0], -node.points[2][1], Math.PI, scene);
    }
    // "T" corners
    if (!c0 && !c1 && c2 && c3) {
      console.log('ok ', 0)
      let cornerWidth = parseInt((node.extension.left + node.thickness.top + node.extension.right) / 0.0254);
      let ptWx = node.points[0][0] + node.extension.left * Math.cos(Math.PI);
      let ptWy = node.points[0][1] + node.extension.left * Math.sin(Math.PI);
      _insertPanel(cornerWidth, ptWx, -ptWy, 0, scene);
    }
    if (c0 && c1 && !c2 && !c3) {
      console.log('ok ', 1)
      let cornerWidth = parseInt((node.extension.left + node.thickness.bottom + node.extension.right) / 0.0254);
      let ptWx = node.points[2][0] + node.extension.right * Math.cos(0);
      let ptWy = node.points[2][1] + node.extension.right * Math.sin(0);
      _insertPanel(cornerWidth, ptWx, -ptWy, Math.PI, scene);
    }
    if (c0 && !c1 && !c2 && c3) {
      console.log('ok ', 2)
      let cornerHeight = parseInt((node.extension.bottom + node.thickness.left + node.extension.top) / 0.0254);
      let ptWx = node.points[1][0] + node.extension.bottom * Math.cos(-Math.PI/2);
      let ptWy = node.points[1][1] + node.extension.bottom * Math.sin(-Math.PI/2);
      _insertPanel(cornerHeight, ptWx, -ptWy, Math.PI/2, scene);
    }
    if (!c0 && c1 && c2 && !c3) {
      console.log('ok ', 3)
      let cornerHeight = parseInt((node.extension.bottom + node.thickness.right + node.extension.top) / 0.0254);
      let ptWx = node.points[3][0] + node.extension.top * Math.cos(Math.PI/2);
      let ptWy = node.points[3][1] + node.extension.top * Math.sin(Math.PI/2);
      _insertPanel(cornerHeight, ptWx, -ptWy, -Math.PI/2, scene);
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

    scene = new THREE.Scene();

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

   wall.nodes.forEach((node) => {
    let geom = new BoxGeometry(
      node.rectangle[0],
      node.height,
      node.rectangle[1]);
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    let mat = new MeshBasicMaterial({color: 0x0808080});
    let mesh = new Mesh(geom, mat);
    mesh.position.x = node.rectangle[3][0];
    mesh.position.z = -node.rectangle[3][1];
    mesh.position.y = node.height/2;
    scene.add(mesh);
  });

    wall.segments.forEach((segment) => {
      let geom = new BoxGeometry(
        segment.rectangle[0],
        segment.height,
        segment.rectangle[1]);//segment.rectangle[1]
      let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
      let mat = new MeshBasicMaterial({color: 0x808080});
      let mesh = new Mesh(geom, mat);
      mesh.position.x = segment.rectangle[3][0];
      mesh.position.z = -segment.rectangle[3][1];
      mesh.position.y = segment.height/2;
      console.log(segment.height)
      scene.add(mesh);
    });

    wall.nodes.forEach(node => {
      insertCorner(node, scene);
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
      thicknessStart = Math.max(thick1, thick2) / 2;
      distance += thicknessStart + extensionStart;
      form.makeWallForm(segment).forEach(size => {


        let mSize = metric(size);
        
        console.log('msize');
        console.log(mSize);
        console.log(distance)

        let panel = 'glb/sp-24X8.glb';
        let posX = segment.node.start.position.x + (segment.thickness/2) * Math.cos(segment.direction-Math.PI/2) + distance * Math.cos(segment.direction);
        let posZ = -(segment.node.start.position.y + (segment.thickness/2) * Math.sin(segment.direction-Math.PI/2) + distance * Math.sin(segment.direction));
        let rot = segment.direction;
        console.log('lado princ')
        console.log(posX, ',', posZ)
        
        _insertPanel(size, posX, posZ, rot, scene);

        //posX += mSize * Math.cos(segment.direction);
        //posZ += -(segment.node.start.position.y + (segment.thickness/2) * Math.sin(segment.direction+Math.PI/2) + distance * Math.sin(segment.direction));
        //rot += Math.PI;
        //posX = segment.node.start.position.x + (segment.thickness/2) * Math.cos(segment.direction+Math.PI/2) + distance * Math.cos(segment.direction);
        posX = segment.node.start.position.x + (segment.thickness/2) * Math.cos(segment.direction+Math.PI/2) + (distance + mSize) * Math.cos(segment.direction);
        posZ = -(segment.node.start.position.y + (segment.thickness/2) * Math.sin(segment.direction+Math.PI/2) + (distance + mSize) * Math.sin(segment.direction));
        rot = segment.direction + Math.PI;
        _insertPanel(size, posX, posZ, rot, scene);
        console.log('lado secund')
        console.log(posX, ',', posZ)
        distance += mSize;
      })
    });

    let light = new AmbientLight();
    scene.add(light);

    console.log(scene);

    camera.position.z = 5;

    controls = new OrbitControls(camera, renderer.domElement)
    controls.update();


    animate();
  }

  function animate () {
    requestAnimationFrame(animate);
    controls.update();
    //scene.rotation.y += 0.01;

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
