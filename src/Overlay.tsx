import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ProcessedAppearanceType } from "./types/boxes-data";

interface Props {
  videoElement: HTMLVideoElement;
  appearances: ProcessedAppearanceType[];
}

export function Overlay({ videoElement, appearances }: Props) {
  const getVisibleAppearances = (): ProcessedAppearanceType[] => {
    const currentTimeMs = videoElement.currentTime * 1000;
    return appearances.filter(
      (appearance) =>
        appearance.startTime < currentTimeMs &&
        appearance.endTime > currentTimeMs
    );
  };
  const onTimeUpdate = (): void => {
    const visibleAppearances = getVisibleAppearances();
    console.log(visibleAppearances.length);
  };

  useEffect(() => {
    videoElement.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      videoElement.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoElement]);

  const drawPolygon = (box) => {
    const tl = box.topLeft;
    const br = box.bottomRight;
    return `${tl.x},${tl.y} ${br.x},${tl.y} ${br.x},${br.y} ${tl.x},${br.y}`;
  };

  return (
    <div
      className="d3-container"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    ></div>
  );
}
