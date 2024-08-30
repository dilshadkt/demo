gsap.registerPlugin(ScrollTrigger);
window.addEventListener("load", function () {
  const slides = gsap.utils.toArray(".slide");
  const activeSlideImage = gsap.utils.toArray(".active-slide img");
  function getInitialTranslateZ(slide) {
    const style = window.getComputedStyle(slide);
    const matrix = style.transform.match(/matrix3d\((.+)\)/);
    if (matrix) {
      const values = matrix[1].split(", ");
      return parseFloat(values[14] || 0);
    }
    return 0;
  }
  function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
  slides.forEach((slide, index) => {
    const initialZ = getInitialTranslateZ(slide);
    ScrollTrigger.create({
      trigger: ".container",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.7,
      onUpdate: (self) => {
        const progress = self.progress;
        const zIncrement = progress * 16000;
        const currentZ = initialZ + zIncrement;
        let opacity;
        if (currentZ > -2500) {
          opacity = mapRange(currentZ, -2500, 0, 0.5, 1);
          gsap.to(slide, 0.5, {
            opacity: opacity,
            duration: 10,
            transform: `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`,
          });
        } else {
          opacity = mapRange(currentZ, -5000, -2500, 0, 0.5);
          gsap.to(slide, 0.5, {
            opacity: opacity,
            duration: 10,
            transform: `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`,
          });
        }

        // slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`;
        if (currentZ < 100) {
          gsap.to(activeSlideImage[index], 0.5, {
            opacity: 1,
            ease: "power3.out",
          });
        } else {
          gsap.to(activeSlideImage[index], 0.5, {
            opacity: 0,
            ease: "power3.out",
          });
        }
      },
      duration: 10,
    });
  });
});
