import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { editable as e, configure } from "react-three-editable";
import EditableCurve from "./EditableCurve";
import { PerspectiveCamera, useGLTF, Environment } from "@react-three/drei";
import useAnimateAlongCurve from "./useAnimateAlongCurve";
import useWobble from "./useWobble";
import useMouseLookAround from "./useMouseLookAround";

// This is our exported editable state
import editableState from "./editableState.json";

// Global configuration for r3e
const bind = configure({
  localStorageNamespace: "Curve Demo",
});

const Scene = () => {
  const { scene: cityObject } = useGLTF("city/scene.gltf");
  const { scene: balloonObject } = useGLTF("balloon/scene.gltf");

  const cameraRef = useMouseLookAround();
  const balloonRef = useWobble({ xFreq: 0.4, yFreq: 0.3 });
  const { objectRef, curveRef } = useAnimateAlongCurve({
    lookAhead: 40,
    loopTime: 120000,
    keepLevel: true,
  });

  return (
    <>
      <e.directionalLight uniqueName="Sun" color="#FDE68A" intensity={1.5} />
      <EditableCurve size={10} ref={curveRef} uniqueName="Curve" />
      <e.primitive object={cityObject} uniqueName="City" editableType="mesh" />

      {/* You can compose editable and non-editable objects in whatever way you want,
          which lets you compose programmatic and static transforms easily*/}
      <group ref={objectRef}>
        <e.group uniqueName="Balloon">
          <primitive ref={balloonRef} object={balloonObject} />
        </e.group>
        <e.group uniqueName="Camera">
          <PerspectiveCamera makeDefault far={30000} ref={cameraRef} />
        </e.group>
      </group>
      <Environment files="palermo.hdr" />
    </>
  );
};

export default function App() {
  return (
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
        <Scene />
      </Suspense>
    </Canvas>
  );
}
