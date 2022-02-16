import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { ProcessedAppearanceType } from "./types/boxes-data";

interface Props {
  videoElement: HTMLVideoElement;
  appearances: ProcessedAppearanceType[];
}

export function Overlay({ videoElement, appearances }: Props) {
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D>();
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
    canvasContext.clearRect(
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight
    );
    visibleAppearances.forEach((appearance) => {
      appearance.boxes.forEach((box) => {
        const tl = box.box.topLeft;
        const br = box.box.bottomRight;
        canvasContext.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
      });
    });
  };

  useEffect(() => {
    const d3Container = d3.select(".d3-container");
    console.log(videoElement);
    const canvas = d3Container
      .append("canvas")
      .attr("width", videoElement.videoWidth)
      .attr("height", videoElement.videoHeight);
    const context: CanvasRenderingContext2D = canvas.node().getContext("2d");
    context.lineWidth = 2;
    context.strokeStyle = "#dcb972";
    setCanvasContext(context);
  }, []);

  useEffect(() => {
    if (canvasContext) {
      videoElement.addEventListener("timeupdate", onTimeUpdate);
      return () => {
        videoElement.removeEventListener("timeupdate", onTimeUpdate);
      };
    }
  }, [videoElement, canvasContext]);

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
