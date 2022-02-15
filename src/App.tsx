import React, { RefObject, useEffect, useState } from "react";
import PorsheVideo from "url:./assets/video/porshe.mp4";
import Data from "./assets/data/porshe-video-object-detections.json";
import { Overlay } from "./Overlay";

export function App() {
  const videoSize = { width: 1280, height: 723 };
  const videoRef: RefObject<HTMLVideoElement> = React.createRef();
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    const video = videoRef?.current;
    video.addEventListener("timeupdate", () => {
      setCurrentTime(video.currentTime);
    });
  }, [videoRef?.current]);
  console.log(Data.data);
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <video ref={videoRef} controls autoPlay loop src={PorsheVideo} />
      <Overlay
        videoSize={videoSize}
        data={Data.data}
        currentTime={currentTime}
      />
    </div>
  );
}
