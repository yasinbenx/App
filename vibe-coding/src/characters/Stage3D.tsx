import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect } from "react";
import type { PerspectiveCamera } from "three";
import type { Acting } from "../engine/acting";
import { FOV } from "../engine/camera";
import type { Shot } from "../engine/types";
import { VIDEO } from "../theme";
import { Boy3D } from "./Boy3D";
import { Claude3D } from "./Claude3D";
import type { Location } from "../locations/types";
import type { Costumes } from "./accessories";

const CameraRig: React.FC<{ cam: Shot }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  useLayoutEffect(() => {
    camera.fov = FOV;
    camera.near = 0.1;
    camera.far = 100;
    camera.position.set(cam.x, cam.y, cam.dist);
    camera.rotation.set(cam.pitch ?? 0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, cam.x, cam.y, cam.dist, cam.pitch]);
  return null;
};

/** 3D-Bühne: Ort (Licht + Set) und die beiden festen Figuren. */
export const Stage3D: React.FC<{
  cam: Shot;
  boy: Acting;
  claude: Acting;
  frame: number;
  location: Location;
  costumes?: Costumes;
}> = ({ cam, boy, claude, frame, location, costumes }) => (
  <ThreeCanvas width={VIDEO.width} height={VIDEO.height} flat style={{ position: "absolute", inset: 0 }}>
    <CameraRig cam={cam} />
    <location.Lights frame={frame} />
    <location.Set3D frame={frame} />
    <Boy3D acting={boy} frame={frame} accessories={costumes?.boy} />
    <Claude3D acting={claude} frame={frame} accessories={costumes?.claude} />
  </ThreeCanvas>
);
