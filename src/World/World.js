import * as THREE from "three/webgpu";
import * as TSL from "three/tsl";
import Experience from "../core/Experience";
import Environment from "./Environment";

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

    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment();
    });
  }

  init() {
    this.resources.on("glbLoaded", (gltf) => {
      console.log(gltf);

      if (gltf.parser.extensions.KHR_draco_mesh_compression) {
        console.log("Has Draco");
      } else {
        console.log("Simple Model");
      }
    });
  }

  update() {}
}
