import { Html } from "@react-three/drei";

export const Loading = () => {
  return (
    <Html>
      <div className="absolute z-50 top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="w-[10 vw] h-[10vw] rounded-full">Loading...</div>
      </div>
    </Html>
  );
};
