import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    // Get the canvas and its wrapper container
    const canvas = document.querySelector("canvas.threejs-canvas");
    const container = canvas ? canvas.parentElement : document.body;

    // Setup initial sizes based on the container element instead of the whole window
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Use ResizeObserver to automatically detect when the container's layout size changes
    // (e.g. from the resizer being dragged or initial creation)
    const resizeObserver = new ResizeObserver(() => {
      this.width = container.clientWidth;
      this.height = container.clientHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });

    if (container) {
      resizeObserver.observe(container);
    }

    // Fallback Window Resize Event
    window.addEventListener("resize", () => {
      this.width = container.clientWidth;
      this.height = container.clientHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });
  }
}
