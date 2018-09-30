const Calc = require('./utils/calc');
const Ease = require('./utils/ease');
const AxisHelper = require('./utils/axis');

class Loader {
  constructor(System) {
    this.calc = new Calc();
    this.ease = new Ease();

    this.dom = {
      html: document.documentElement,
      container: document.querySelector('.loader')
    };

    this.setupTime();
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupHelpers();

    this.width = 1000;
    this.height = 1000;
    this.dpr = window.devicePixelRatio > 1 ? 2 : 1;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(this.width, this.height);

    this.system = new System(this);
    this.loop();
  }

  setupTime() {
    this.timescale = 1;
    this.clock = new THREE.Clock();
    this.deltaTimeSeconds = this.clock.getDelta() * this.timescale;
    this.deltaTimeMilliseconds = this.deltaTimeSeconds * 1000;
    this.deltaTimeNormal = this.deltaTimeMilliseconds / (1000 / 60);
    this.elapsedMilliseconds = 0;
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(100, 0, 0.0001, 10000);

    this.cameraBaseX = this.isGrid ? -20 : 0;
    this.cameraBaseY = this.isGrid ? 15 : 0;
    this.cameraBaseZ = this.isGrid ? 20 : 30;

    this.camera.position.x = this.cameraBaseX;
    this.camera.position.y = this.cameraBaseY;
    this.camera.position.z = this.cameraBaseZ;
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    this.dom.container.appendChild(this.renderer.domElement);
  }

  setupHelpers() {
    if (this.isGrid) {
      this.gridOpacityMap = [
        0.4, // 1
        0.2, // 2
        0.2, // 3
        0.2, // 4
        0.1, // 5
        0.2, // 6
        0.1, // 7
        0.1 // 8
      ];
      this.gridHelper = new THREE.GridHelper(300, 60, 0xffffff, 0xffffff);
      this.gridHelper.material.transparent = true;
      this.gridHelper.material.opacity = this.gridOpacityMap[demoNum - 1];
      this.scene.add(this.gridHelper);

      this.axisOpacityMap = [
        1, // 1
        0.6, // 2
        0.6, // 3
        0.6, // 4
        0.3, // 5
        0.6, // 6
        0.3, // 7
        0.3 // 8
      ];
      this.axisHelper = new AxisHelper(150, this.axisOpacityMap[demoNum - 1]);
      this.scene.add(this.axisHelper);

      this.camera.lookAt(new THREE.Vector3());
    }
  }

  update() {
    this.deltaTimeSeconds = this.clock.getDelta();
    if (this.diffTime) {
      this.deltaTimeSeconds -= this.diffTime;
      this.diffTime = 0;
    }
    this.deltaTimeSeconds *= this.timescale;
    this.deltaTimeMilliseconds = this.deltaTimeSeconds * 1000;
    this.deltaTimeNormal = this.deltaTimeMilliseconds / (1000 / 60);
    this.elapsedMilliseconds += this.deltaTimeMilliseconds;

    this.system.update();

    if (this.isOrbit) {
      this.controls.update();
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  loop() {
    this.update();
    this.render();
    this.raf = window.requestAnimationFrame(() => this.loop());
  }
}

module.exports = Loader;
