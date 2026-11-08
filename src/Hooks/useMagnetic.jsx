import { useEffect } from "react";
import gsap from "gsap";

const useMagnetic = (ref, strength = 0.4, enabled = true) => {
  useEffect(() => {
    if (!ref.current || !enabled) {
      // Reset position if disabled
      if (ref.current) {
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.2 });
      }
      return;
    }

    const el = ref.current;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const reset = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "elastic.out(1,0.7)",
      });
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", reset);
    };
  }, [ref, strength, enabled]);
};

export default useMagnetic;
