import {} from './three.js'
import {} from './OrbitControls.js'

/** 
 * DEFINIR OBJ MODULO EM FUNÇÃO DO MODULO ANTERIOR E DIREÇÃO DO NOVO MODULO
 * DEFINIR SHAPE PARA PRÉDIO
*/

var scene, camera, renderer, light, rayCast, mouse, controls, grid, canvas
    var frustumSize = 100;
    var intersects;
    var angle = 0;

    function onResize() {
        var aspect = window.height / window.width;
  
        camera.left = frustumSize / - 2;
        camera.right = frustumSize / 2;
        camera.top = frustumSize * aspect / 2;
        camera.bottom = - frustumSize * aspect / 2;

        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function getValues() {
        let step = parseFloat(document.getElementById('step').value)
        let direction = parseFloat(document.getElementById('direction').value)
        let array = [step, angle, direction]
        return array;
    }

    function drawModule(step, direction) {
        let geometry = new THREE.BoxGeometry(2,0,2);
        let material = new THREE.MeshBasicMaterial({color: 0xffffff});
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let helper = new THREE.EdgesHelper( mesh, 0x000000 );
        helper.material.linewidth = 5;
        scene.add( helper );
    }

    function seeScene() {
        console.log(scene.children)
    }

    const init = function() {
        canvas = document.getElementById('structure-screen');
        // create the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        
        var aspect = canvas.height / canvas.width;

        camera = new THREE.OrthographicCamera( frustumSize  / - 2, frustumSize / 2, frustumSize * aspect / 2, frustumSize * aspect / - 2, -1000, 1000 );
        
        camera.position.set(100, 500, 100);

        light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add(light);

        let geometry = new THREE.BoxGeometry(10,10,10,3,3,3);
        let material = new THREE.MeshBasicMaterial({color: 0xff0000});
        let mesh = new THREE.Mesh(geometry, material);
        //scene.add(mesh);


        rayCast = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});   
        renderer.setSize(canvas.width, canvas.height);
    

        controls = new THREE.OrbitControls( camera, canvas );
        controls.minPolarAngle = 0; //0; // radians
        controls.maxPolarAngle = 0; // radians
        controls.minAzimuthAngle = 0;
        controls.maxAzimuthAngle = 0;
        controls.enabled = true

        console.log(getValues())

        canvas.addEventListener('click', seeScene, false);

        canvas.addEventListener('resize', onResize, false);
        var buttonUp = document.getElementById('up')
        buttonUp.addEventListener('click', function() {drawModule(2,2)}, false);

        controls.update()
    };

    const mainLoop = function() {
        renderer.render(scene, camera);
        controls.update()
        requestAnimationFrame(mainLoop);
    };

    init()
    mainLoop();



