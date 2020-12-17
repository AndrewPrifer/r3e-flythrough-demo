import { useRef } from "react";
import { useFrame } from "react-three-fiber";

const useWobble = ({
  xFreq = 1,
  yFreq = 0,
  xMag = 1 / 10,
  yMag = 1 / 10,
} = {}) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      const time = Date.now();
      ref.current.rotation.z =
        Math.sin(xFreq * (time / 1000) * Math.PI * 2) * xMag;
      ref.current.rotation.x =
        Math.sin(yFreq * (time / 1000) * Math.PI * 2) * yMag;
    }
  });

  return ref;
};

export default useWobble;
