import { useRef, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import lerp from "lerp";

const useMouseLookAround = ({
  magnitude: factor = 1,
  invertX = false,
  invertY = false,
} = {}) => {
  const ref = useRef();
  const mouse = useRef([0, 0]);

  useEffect(() => {
    const listener = ({ clientX: x, clientY: y }) =>
      (mouse.current = [
        x / window.innerWidth - 0.5,
        y / window.innerHeight - 0.5,
      ]);

    window.document.addEventListener("mousemove", listener);

    return () => window.document.removeEventListener("mousemove", listener);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = lerp(
        ref.current.rotation.x,
        mouse.current[1] * factor * (invertX ? 1 : -1),
        0.1
      );
      ref.current.rotation.y = lerp(
        ref.current.rotation.y,
        mouse.current[0] * factor * (invertY ? 1 : -1),
        0.1
      );
    }
  });

  return ref;
};

export default useMouseLookAround;
