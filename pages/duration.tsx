import { AudioHTMLAttributes, useEffect, useState } from "react";

export default function Home() {
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    setSrc("/dl.wav");
    const audioElement = document.getElementById("audio") as HTMLAudioElement;
    if (audioElement) {
      audioElement.addEventListener("loadedmetadata", (event) => {
        console.log((event.target as HTMLAudioElement)?.duration);
      });
    }
  }, []);
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
      <audio id="audio" src={src} controls></audio>
    </h1>
  );
}
