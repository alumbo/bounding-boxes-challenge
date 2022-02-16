import React, { RefObject, useEffect, useMemo, useState } from 'react';
import PorsheVideo from 'url:./assets/video/porshe.mp4';
import BoxesData from './assets/data/porshe-video-object-detections.json';
import { Overlay } from './Overlay';
import {
  AppearanceType,
  BoxesDataType,
  ProcessedAppearanceType
} from './types/boxes-data';

export function App() {
  const videoRef: RefObject<HTMLVideoElement> = React.createRef();
  const [videoElement, setVideoElement] = useState<HTMLVideoElement>();

  // compile useful data in a single array
  const getProcessedAppearances = (): ProcessedAppearanceType[] => {
    const boxesData: BoxesDataType = BoxesData.data;
    const appearances: ProcessedAppearanceType[] = [];
    boxesData.analysis.objects.map((object) => {
      object.appearances.map((appearance: AppearanceType) => {
        appearances.push({
          ...appearance,
          objectClass: object.objectClass,
          startTime: appearance.boxes.at(0).time,
          endTime: appearance.boxes.at(-1).time,
          // will be useful to track boxes from same appearance
          id: `appearance_${object.id.split('/').at(-1)}`
        });
      });
    });
    console.log('getProcessedAppearances', appearances);
    return appearances;
  };

  const processedAppearanceType: ProcessedAppearanceType[] = useMemo<
    ProcessedAppearanceType[]
  >(getProcessedAppearances, [BoxesData]);

  useEffect(() => {
    // set video element only when meta data are readable
    videoRef.current.addEventListener('loadedmetadata', () => {
      setVideoElement(videoRef.current);
    });
  }, [videoRef.current]);

  return (
    <div
      style={{
        position: 'relative'
      }}
    >
      <video ref={videoRef} controls autoPlay loop src={PorsheVideo} />
      {videoElement ? (
        <Overlay
          videoElement={videoElement}
          appearances={processedAppearanceType}
        />
      ) : null}
    </div>
  );
}
