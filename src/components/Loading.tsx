import { Html } from "@react-three/drei";
import React from "react";

type Props = {};

export const Loading = (props: Props) => {
  return (
    <Html>
      <div className="absolute z-50 top-0 left-0w-fullh-full flex justify-center items-center">
        <div className="w-[10 vw] h-[10vw] rounded-full">Loading...</div>
      </div>
    </Html>
  );
};
