import Header from "../components/Header";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState } from "react";

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "ffmpeg-core/ffmpeg-core.js",
});

export default function Home() {
  const [originalSrc, setOriginalSrc] = useState<string | undefined>(undefined);
  const [convertedSrc, setConvertedSrc] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("Click Start to transcode");

  async function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];
    if (file) {
      await prepare();
      ffmpeg.FS("writeFile", "original.wav", await fetchFile(file));
      await transform();
    }
  }

  async function onRequestExample() {
    await prepare();
    ffmpeg.FS("writeFile", "original.wav", await fetchFile("./dl.wav"));
    await transform();
  }

  async function prepare() {
    setMessage("Loading ffmpeg-core.js");
    await ffmpeg.load();
    setMessage("Start transcoding");
  }

  async function download(filename: string) {
    const blob = new Blob([ffmpeg.FS("readFile", filename).buffer], {
      type: "audio/x-wav",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function transform() {
    await ffmpeg.run(
      "-i",
      "original.wav",
      "-af",
      "asetrate=44100*0.5,aresample=44100,atempo=1/0.5",
      "converted.wav"
    );

    setMessage("Complete transcoding");
    setOriginalSrc(
      URL.createObjectURL(
        new Blob([ffmpeg.FS("readFile", "original.wav").buffer], { type: "audio/x-wav" })
      )
    );
    setConvertedSrc(
      URL.createObjectURL(
        new Blob([ffmpeg.FS("readFile", "converted.wav").buffer], { type: "audio/x-wav" })
      )
    );
  }

  return (
    <div>
      <Header link="about" />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div>
        <p>
          The sample must be a WAV file, short and trimmed. You have to know its bpm or the number
          of bars. Beat per bar must be 4.
        </p>
        <input type="file" onChange={onUploadFile} />
        <button onClick={onRequestExample}>Essayer un exemple au hasard</button>
        <div>{message}</div>
        <div className="grid grid-cols-2">
          <div>
            original
            <audio id="original" src={originalSrc} controls></audio>
            <button onClick={() => download("original.wav")}>Download</button>
          </div>
          <div>
            converted
            <audio id="converted" src={convertedSrc} controls></audio>
            <button onClick={() => download("converted.wav")}>Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}
