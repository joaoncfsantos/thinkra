export const resetViewport = () => {
  if (typeof window !== "undefined") {
    // Reset viewport zoom on mobile
    const viewport = document.querySelector("meta[name=viewport]");
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }

    // Scroll to top to reset position
    window.scrollTo(0, 0);

    // Force a reflow
    document.body.style.zoom = "1";
  }
};
