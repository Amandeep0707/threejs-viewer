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

    const lerpFactor = TSL.uniform(-0.5);
    const noiseTexture = this.resources.items.noiseTexture;

    const blendMask = TSL.clamp(TSL.round(TSL.add(lerpFactor, noiseTexture)));

    const woodColor = this.resources.items.woodColor;
    const leatherColor = this.resources.items.leatherColor;
    const woodRoughness = this.resources.items.woodRoughness;
    const leatherRoughness = this.resources.items.leatherRoughness;
    const woodNormal = this.resources.items.woodNormal;
    const leatherNormal = this.resources.items.leatherNormal;

    const customMaterial = new THREE.MeshStandardNodeMaterial();
    customMaterial.colorNode = TSL.mix(woodColor, leatherColor, blendMask);
    customMaterial.roughnessNode = TSL.mix(
      woodRoughness,
      leatherRoughness,
      blendMask,
    );
    customMaterial.normalNode = TSL.mix(woodNormal, leatherNormal, blendMask);

    if (this.debug.active) {
      const gridFolder = this.debug.ui.addFolder({
        title: "Testing..",
        expanded: true,
      });
      const lerpButton = gridFolder.addButton({
        title: "Switch Material",
      });
      gridFolder.addBinding(lerpFactor, "value", {
        label: "Lerp Value",
        readonly: true,
        view: "graph",
        min: -0.5,
        max: 0.5,
        interval: 33,
      });

      lerpButton.on("click", () => {
        if (lerpFactor.value === -0.5) {
          gsap.to(lerpFactor, {
            value: 0.5,
            duration: 1,
            ease: "power1.out",
          });
        } else if (lerpFactor.value === 0.5) {
          gsap.to(lerpFactor, {
            value: -0.5,
            duration: 1,
            ease: "power1.out",
          });
        }
      });
    }

    this.resources.items.suzanne.scene.children.forEach((element) => {
      element.material = customMaterial;
    });
  }

  update() {}
}
