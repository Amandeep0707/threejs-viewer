export default class MouseEvents {
  constructor() {
    const resizer = document.getElementById("resizer");
    const topPanel = document.querySelector(".canvas-container");
    const bottomPanel = document.querySelector(".node-editor");
    const appContainer = document.querySelector(".app-container");

    let isResizing = false;

    // When the user clicks on the resizer bar
    resizer.addEventListener("mousedown", (e) => {
      isResizing = true;
      document.body.style.cursor = "ns-resize"; // enforce dragging cursor over whole document
    });

    // When the user drags the mouse
    window.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      const containerRect = appContainer.getBoundingClientRect();

      // Calculate new height for top panel (canvas) based on cursor position
      let newHeight = e.clientY - containerRect.top;

      // Set minimum constraints so panels don't shrink out of existence
      const minHeight = 100;
      const maxHeight = containerRect.height - minHeight - resizer.offsetHeight;

      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;

      // Use percentages for flex-basis so it stays responsive to window resizing
      const percentage = (newHeight / containerRect.height) * 100;

      // Apply height as percentage to top panel, let bottom panel auto-fill the rest
      topPanel.style.flex = `0 0 ${percentage}%`;
      bottomPanel.style.flex = `1 1 auto`;
    });

    // Clean up when the user lets go of mouse anywhere
    window.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "default";
      }
    });
  }
}
