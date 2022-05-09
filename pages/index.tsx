import Header from "../components/Header";
import { fetchFile, ffmpeg } from "../utils/helpers";
import { useEffect, useMemo, useState } from "react";
import BpmOrBarsSelector from "../components/BpmBarsSelector";
import { glitch } from "../utils/glitcher";

export default function Home() {
  const [originalSrc, setOriginalSrc] = useState<string | undefined>();
  const [convertedSrc, setConvertedSrc] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [duration, setDuration] = useState<number | undefined>();
  const [srcForDuration, setSrcForDuration] = useState<string | undefined>();
  const [message, setMessage] = useState("Click Start to transcode");

  /*
  async function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];
    if (file) {
      await prepare();
      ffmpeg.FS("writeFile", "original.wav", await fetchFile(file));
      await transform();
    }
  }
  */

  async function onRequestExample() {
    await prepare();
    ffmpeg.FS("writeFile", "original.wav", await fetchFile("./dl.wav"));
    await transform();
  }

  async function prepare() {
    setMessage("Loading ffmpeg-core.js");
    if (!ffmpeg.isLoaded()) await ffmpeg.load();
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

  function onBeforeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];
    if (file) {
      setMessage("Uploading file...");
      setSrcForDuration(URL.createObjectURL(file));
      const audioElement = document.getElementById("hidden-audio-for-duration") as HTMLAudioElement;
      if (audioElement) {
        audioElement.addEventListener("loadedmetadata", (event) => {
          setDuration((event.target as HTMLAudioElement)?.duration);
          setModalOpen(true);
        });
      }
    }
  }

  async function onUploadCrashTest({
    beatLength,
    barCount,
  }: {
    beatLength: number;
    barCount: number;
  }) {
    if (srcForDuration) {
      await prepare();
      ffmpeg.FS("writeFile", "original.wav", await fetchFile(srcForDuration));
      await glitch({
        beatLength,
        barCount,
        wav: "original.wav",
        output: "converted.wav",
        totalTime: duration!,
      });
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
      // await transform();
    }
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
        <label className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-64">
          <input type="file" className="hidden" onChange={onBeforeUpload} key={srcForDuration} />
          Upload a WAV file
        </label>

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
        <audio className="hidden" id="hidden-audio-for-duration" src={srcForDuration}></audio>
      </div>
      {modalOpen && duration ? (
        <BpmOrBarsSelector
          duration={duration}
          onCancel={() => {
            setModalOpen(false);
            setSrcForDuration(undefined);
          }}
          onConfirm={(beatLength, barCount) => {
            setModalOpen(false);
            onUploadCrashTest({ beatLength, barCount });
          }}
        />
      ) : null}
    </div>
  );
}
