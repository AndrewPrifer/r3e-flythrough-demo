import React, { Suspense, useEffect, useState, useRef } from "react";
import { Vector3 } from "three";
import { Canvas, useFrame } from "react-three-fiber";
import { editable as e, configure } from "react-three-editable";
import EditableCurve from "./EditableCurve";
import {
  PerspectiveCamera,
  useGLTF,
  Environment,
  useAnimations,
  Loader,
} from "@react-three/drei";
import useAnimateAlongCurve from "./useAnimateAlongCurve";
import useWobble from "./useWobble";
import useMouseLookAround from "./useMouseLookAround";

// This is our exported editable state
import editableState from "./editableState.json";

// Global configuration for r3e
const bind = configure({
  localStorageNamespace: "Curve Demo",
});

const Scene = ({ riding }) => {
  const { scene: cityObject, animations } = useGLTF("city.glb");
  const { scene: balloonObject } = useGLTF("balloon/scene.gltf");

  // Allow the balloon camera to look around
  const cameraRef = useMouseLookAround();

  // Wobble the balloon a bit as if wind were blowing
  const balloonRef = useWobble({ xFreq: 0.4, yFreq: 0.3 });

  // Move the balloon stuff along a curve
  const { objectRef: balloonStuffRef, curveRef } = useAnimateAlongCurve({
    lookAhead: 40,
    loopTime: 120000,
    keepLevel: true,
  });

  // Apply the city's loaded animations in a loop
  const { ref: animRef, actions, names } = useAnimations(animations);
  useEffect(() => {
    actions[names[0]].play();
  }, [actions, names]);

  // Make our static camera always look at the balloon
  const staticCameraRef = useRef();
  useFrame(() => {
    if (staticCameraRef.current && balloonRef.current) {
      const lookAt = new Vector3();
      balloonRef.current.getWorldPosition(lookAt);

      staticCameraRef.current.lookAt(lookAt);
    }
  });

  return (
    <>
      {/* Sun */}
      <e.directionalLight uniqueName="Sun" color="#FDE68A" intensity={1.5} />
      {/* The curve the balloon is following */}
      <EditableCurve size={10} ref={curveRef} uniqueName="Curve" />
      <e.primitive
        ref={animRef}
        object={cityObject}
        uniqueName="City"
        editableType="mesh"
      />

      {/* You can compose editable and non-editable objects in whatever way you want. With great power... */}
      <group ref={balloonStuffRef}>
        <e.group uniqueName="Balloon">
          <primitive ref={balloonRef} object={balloonObject} />
        </e.group>
        <e.group uniqueName="Camera">
          <PerspectiveCamera makeDefault={riding} far={30000} ref={cameraRef} />
        </e.group>
      </group>
      <e.group uniqueName="Static Camera">
        <PerspectiveCamera ref={staticCameraRef} makeDefault={!riding} />
      </e.group>

      <Environment files="palermo.hdr" />
    </>
  );
};

export default function App() {
  const [riding, setRiding] = useState(false);

  return (
    <>
      {/* Our minimal but good-lookin' interface */}
      <div className={`ui ${riding ? "ride" : ""}`}>
        <button onClick={() => setRiding(!riding)} className="ui--lets-ride">
          {riding ? "I'd rather just watch." : "Let's ride!"}
        </button>
      </div>

      <Canvas
        onCreated={({ gl, scene }) => {
          // Local r3e settings, for this canvas only
          bind({
            state: editableState,
            editorCamera: { position: [150, 150, 150] },
          })({ gl, scene });

          gl.setClearColor("#93c5fd");
        }}
        gl={{ logarithmicDepthBuffer: true }}
      >
        <Suspense fallback={null}>
          <Scene riding={riding} />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
