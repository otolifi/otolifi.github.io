import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {useEffect, useRef} from 'react';

function TDCCanvas() {
  const cubeRef = useRef(null);
  const controls = useRef(null);
  useEffect(() => {
    console.log('canvas loade');
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      75,
      cubeRef.current.clientWidth / cubeRef.current.clientHeight,
      0.1,
      1000
    );
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(cubeRef.current.clientWidth, cubeRef.current.clientHeight);
    cubeRef.current.appendChild(renderer.domElement);

    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update();

    const animate = function () {
      requestAnimationFrame(animate);
      
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      controls.update();

      renderer.render(scene, camera);
    };
    animate();
  }, [])
  return (
      <div ref={cubeRef} className="main" style={{ width: "100%", height: "800px", margin: "0px" }}></div>
  )
}

export default TDCCanvas;
