import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export function Overlay({ data, currentTime, videoSize }) {
  const svgRef = useRef();
  const boxTimeOffset = 150;
  const currentTimeMs = currentTime * 1000;
  const visibleBoxes = () => {
    const visibleBoxes = [];
    data.analysis.objects.map((object) => {
      object.appearances.map((appearance) => {
        visibleBoxes.push(
          ...appearance.boxes.filter(
            (box) =>
              box.time - boxTimeOffset < currentTimeMs &&
              box.time > currentTimeMs
          )
        );
      });
    });
    return visibleBoxes;
  };
  const drawPolygon = (box) => {
    const tl = box.topLeft;
    const br = box.bottomRight;
    return `${tl.x},${tl.y} ${br.x},${tl.y} ${br.x},${br.y} ${tl.x},${br.y}`;
  };
  // redraw when currentTime change
  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    visibleBoxes().map((box) => {
      svgEl
        .append("polygon")
        .data([currentTime * 20])
        .attr("fill", "none")
        .attr("stroke", "#dcb972")
        .attr("stroke-width", 2)
        .attr("points", (d) => drawPolygon(box.box));
    });
  }, [currentTime]);
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
      }}
      ref={svgRef}
      width={videoSize.width}
      height={videoSize.height}
    >
      <g className="container" />
    </svg>
  );
}
