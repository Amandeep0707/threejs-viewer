import * as THREE from "three/webgpu";
import Experience from "./Experience";
import EventEmitter from "../Utils/EventEmitter";

export default class Renderer extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();

    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.ready = false;

    this.setInstance();
  }

  async setInstance() {
    this.instance = new THREE.WebGPURenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.physicallyCorrectLights = true;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

    // WebGPU requires explicit async initialization before rendering
    await this.instance.init();

    this.ready = true;

    this.experience.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    if (!this.ready) return;
    this.instance.render(this.scene, this.camera.instance);
  }
}
