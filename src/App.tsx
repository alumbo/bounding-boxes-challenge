import React, { RefObject, useEffect, useState } from "react";
import PorsheVideo from "url:./assets/video/porshe.mp4";
import Data from "./assets/data/porshe-video-object-detections.json";

export function App() {
  const videoSize = { width: 1280, height: 723 };
  const videoRef: RefObject<HTMLVideoElement> = React.createRef();
  const [currentTime, setCurrentTime] = useState(0);
  console.log("currentTime", currentTime);
  useEffect(() => {
    const video = videoRef?.current;
    video.addEventListener("timeupdate", () => {
      setCurrentTime(video.currentTime);
    });
  }, [videoRef?.current]);
  return (
    <video
      ref={videoRef}
      width={videoSize.width}
      height={videoSize.height}
      controls
      autoPlay
      loop
      src={PorsheVideo}
    />
  );
}
