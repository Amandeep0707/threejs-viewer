import * as THREE from "three/webgpu";
import * as TSL from "three/tsl";
import Experience from "../core/Experience";
import Environment from "./Environment";
import gsap from "gsap";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.renderer = this.experience.renderer.instance;
    this.physics = this.experience.physics;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.resources = this.experience.resources;
  }

  init() {
    this.environment = new Environment();

    this.bike = this.resources.items.bike;

    console.log("Bike Model:", this.bike);

    this.animMixer = new THREE.AnimationMixer(this.bike.scene);
    const action = this.animMixer.clipAction(this.bike.animations[0]);
    action.play();
  }

  update() {
    if (this.animMixer) {
      this.animMixer.update(this.time.delta);
    }
  }
}
