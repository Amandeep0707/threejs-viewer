import * as THREE from "three/webgpu";
import * as TSL from "three/tsl";
import EventEmitter from "./EventEmitter";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import Experience from "../core/Experience";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;

    // Options
    this.sources = sources;

    //Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    if (this.experience.gltfImporter) {
      this.setLoaders();
      this.startLoading();
      this.setupDragAndDrop();
    }
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.loaders.hdrLoader = new HDRLoader();
    this.loaders.fontLoader = new FontLoader();
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
          this.scene.add(file.scene);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          let tslNode = null;
          if (source.textureType === "color") {
            file.colorSpace = THREE.SRGBColorSpace;
            tslNode = TSL.texture(file);
          } else if (source.textureType === "mask") {
            file.colorSpace = THREE.LinearSRGBColorSpace;
            tslNode = TSL.texture(file);
          } else if (source.textureType === "normal") {
            file.colorSpace = THREE.LinearSRGBColorSpace;
            tslNode = TSL.normalMap(TSL.texture(file));
          } else {
            tslNode = TSL.texture(file);
          }

          this.sourceLoaded(source, tslNode);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "environmentTexture") {
        this.loaders.hdrLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "font") {
        this.loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      const allGltfModelsValid = this.sources
        .filter((s) => s.type === "gltfModel")
        .every((s) => this.items[s.name] && this.items[s.name].scene);

      if (allGltfModelsValid) {
        this.trigger("ready");
      }
    }

    this.trigger("sourceLoaded", { source, file });
  }

  setupDragAndDrop() {
    document.addEventListener(
      "dragover",
      this.handleDragOver.bind(this),
      false,
    );
    document.addEventListener("drop", this.handleDrop.bind(this), false);
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const glbFiles = files.filter((file) => {
      const fileName = file.name.toLowerCase();
      return fileName.endsWith(".glb") || fileName.endsWith(".gltf");
    });

    if (glbFiles.length > 0) {
      this.loadDroppedFiles(glbFiles);
      this.trigger("filesDropped", glbFiles);
    }
  }

  loadDroppedFiles(files) {
    files.forEach((file, index) => {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const uniqueName = `dropped_${fileName}_${index}`;
      const objectUrl = URL.createObjectURL(file);

      const source = {
        name: uniqueName,
        type: "gltfModel",
        path: objectUrl,
      };

      this.loaders.gltfLoader.load(objectUrl, (gltf) => {
        URL.revokeObjectURL(objectUrl);

        this.sourceLoaded(source, gltf);
        this.experience.scene.add(gltf.scene);
        this.trigger("glbLoaded", [gltf]);
      });
    });
  }
}
