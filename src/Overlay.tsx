import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { BoxType, ProcessedAppearanceType } from './types/boxes-data';

interface Props {
  videoElement: HTMLVideoElement;
  appearances: ProcessedAppearanceType[];
}

export function Overlay({ videoElement, appearances }: Props) {
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D>();
  const [visibleAppearances, setVisibleAppearances] = useState<
    ProcessedAppearanceType[]
  >([]);
  const [dataContainer, setDataContainer] = useState<d3.Selection>();

  // get visible appearances depending on current video time
  const getVisibleAppearances = (): ProcessedAppearanceType[] => {
    const currentTimeMs = videoElement.currentTime * 1000;
    return appearances.filter(
      (appearance) =>
        appearance.startTime < currentTimeMs &&
        appearance.endTime > currentTimeMs
    );
  };

  useEffect(() => {
    console.log('setup d3 canvas');
    const d3Container = d3.select('.d3-container');
    const canvas = d3Container
      .append('canvas')
      .attr('width', videoElement.videoWidth)
      .attr('height', videoElement.videoHeight);
    const context: CanvasRenderingContext2D = canvas.node().getContext('2d');
    context.lineWidth = 2;
    context.strokeStyle = '#dcb972';
    setCanvasContext(context);
    const detachedContainer = document.createElement('proxy');
    setDataContainer(d3.select(detachedContainer));
  }, []);

  const injectBoxesDataToD3 = () => {
    const currentTimeMs = videoElement.currentTime * 1000;
    // we loop only on visible appearances
    visibleAppearances.forEach((appearance) => {
      // retreive actual box to show, depending on video time
      let currentBox: BoxType;
      let currentBoxIndex;
      appearance.boxes.map((box, index) => {
        if (box.time < currentTimeMs) {
          currentBox = box;
          currentBoxIndex = index;
        }
      });
      // inject boxes data to d3 proxy
      const nextBox: BoxType = appearance.boxes[currentBoxIndex + 1];
      if (currentBox && nextBox)
        drawProxyD3(currentBox, nextBox, appearance.id);
    });
    // clear boxes data from d3 container if appearances are not showed
    appearances.map((appearance) => {
      if (visibleAppearances.find((a) => a.id === appearance.id) === undefined)
        dataContainer?.selectAll(`.${appearance.id}`).remove();
    });
  };

  useEffect(() => {
    injectBoxesDataToD3();
  }, [visibleAppearances]);

  useEffect(() => {
    if (canvasContext && dataContainer) {
      console.log('init d3 timer and listen timeupdate');
      d3.timer(drawCanvas);
      videoElement.addEventListener('timeupdate', onTimeUpdate);
      return () => {
        videoElement.removeEventListener('timeupdate', onTimeUpdate);
      };
    }
  }, [videoElement, canvasContext, dataContainer]);

  // check which appearances should be rendered when video time updates
  const onTimeUpdate = () => {
    setVisibleAppearances(getVisibleAppearances());
  };

  // handle transition between 2 boxes from an appearance with d3
  const drawProxyD3 = (currentBox: BoxType, nextBox: BoxType, id: string) => {
    const tl = currentBox.box.topLeft;
    const br = currentBox.box.bottomRight;
    const tlNext = nextBox.box.topLeft;
    const brNext = nextBox.box.bottomRight;

    // clear previous boxes
    dataContainer.selectAll(`.${id}`).remove();

    const box = dataContainer
      .append('proxy')
      .classed('box', true)
      .classed(id, true)
      .attr('x', tl.x)
      .attr('y', tl.y)
      .attr('width', br.x - tl.x)
      .attr('height', br.y - tl.y);

    // transition to next box
    box
      .transition()
      .duration(nextBox.time - currentBox.time)
      .attr('x', tlNext.x)
      .attr('y', tlNext.y)
      .attr('width', brNext.x - tlNext.x)
      .attr('height', brNext.y - tlNext.y);
  };

  const clearCanvas = () => {
    canvasContext.clearRect(
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight
    );
  };

  // copy values from d3 proxy element to canvas context
  const drawCanvas = () => {
    clearCanvas();
    dataContainer.selectAll('proxy.box').each(function () {
      const node = d3.select(this);
      canvasContext.strokeRect(
        node.attr('x'),
        node.attr('y'),
        node.attr('width'),
        node.attr('height')
      );
    });
  };

  return (
    <div
      className="d3-container"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    ></div>
  );
}
