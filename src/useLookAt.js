import { useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Vector3 } from "three";

const useLookAt = () => {
  const eyeRef = useRef();
  const targetRef = useRef();

  useFrame(() => {
    if (eyeRef.current && targetRef.current) {
      const lookAt = new Vector3();
      targetRef.current.getWorldPosition(lookAt);

      eyeRef.current.lookAt(lookAt);
    }
  });

  return { eyeRef, targetRef };
};

export default useLookAt;
