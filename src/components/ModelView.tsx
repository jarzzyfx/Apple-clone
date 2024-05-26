import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei";
import { FC, Suspense } from "react";
import Lights from "./Lights";
import Iphone from "./Iphone";
import * as THREE from "three";
import { Loading } from "./Loading";

interface ModelViewProps {
  index: number;
  groupRef: any;
  gsapType: string;
  controlRef: any;
  setRotationState: any;
  item: {
    title: string;
    color: [string];
    img: string;
  };
  size: string;
}

export const ModelView: FC<ModelViewProps> = ({
  controlRef,
  groupRef,
  gsapType,
  index,
  item,
  setRotationState,
  size,
}) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={` w-full h-full absolute ${
        index === 2 ? "right-[-100%]" : ""
      }`}
    >
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      <Lights />
      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      <group
        ref={groupRef}
        name={`${index === 1 ? "small" : "large"}`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loading />}>
          <Iphone
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
};
