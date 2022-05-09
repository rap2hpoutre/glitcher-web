import Header from "../components/Header";
import { fetchFile, ffmpeg } from "../utils/helpers";
import { useState } from "react";
import BpmOrBarsSelector from "../components/BpmBarsSelector";
import { glitch } from "../utils/glitcher";

export default function Home() {
  const [uploadedSrc, setUploadedSrc] = useState<string | undefined>();
  const [originalSrc, setOriginalSrc] = useState<string | undefined>();
  const [convertedSrc, setConvertedSrc] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [duration, setDuration] = useState<number | undefined>();
  const [message, setMessage] = useState("Click Start to transcode");

  function fileToObjectUrl(filename: string) {
    return URL.createObjectURL(
      new Blob([ffmpeg.FS("readFile", filename).buffer], { type: "audio/x-wav" })
    );
  }

  async function onRequestExample() {
    processUploadedFile({ beatLength: 0.348837875, barCount: 2, src: "./dl.wav" });
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

  function onBeforeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];
    if (file) {
      setMessage("Uploading file...");
      setUploadedSrc(URL.createObjectURL(file));
      const audioElement = document.getElementById("hidden-audio-for-duration") as HTMLAudioElement;
      if (audioElement) {
        audioElement.addEventListener("loadedmetadata", (event) => {
          setDuration((event.target as HTMLAudioElement)?.duration);
          setModalOpen(true);
        });
      }
    }
  }

  async function processUploadedFile({
    beatLength,
    barCount,
    src,
  }: {
    beatLength: number;
    barCount: number;
    src: string | undefined;
  }) {
    if (!src) return;
    setMessage("Loading ffmpeg-core.js");
    if (!ffmpeg.isLoaded()) await ffmpeg.load();
    setMessage("Start transcoding");
    ffmpeg.FS("writeFile", "original.wav", await fetchFile(src));
    await glitch({
      beatLength,
      barCount,
      wav: "original.wav",
      output: "converted.wav",
      totalTime: duration!,
    });
    setMessage("Complete transcoding");
    setOriginalSrc(fileToObjectUrl("original.wav"));
    setConvertedSrc(fileToObjectUrl("converted.wav"));
  }

  return (
    <div>
      <Header link="about" />

      <div className="container mx-auto my-5 font-mono">
        <h1 className="text-3xl text-center my-5">Glitch a drum loop!</h1>

        <div className="flex flex-col items-center">
          <label className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-64">
            <input type="file" className="hidden" onChange={onBeforeUpload} key={uploadedSrc} />
            Upload a WAV file
          </label>

          <div>{message}</div>

          <div>
            Don&apos;t know where to start?{" "}
            <button onClick={onRequestExample} className="text-blue-600 hover:underline">
              Try an example!
            </button>
          </div>

          <p>
            The sample must be a WAV file, short and trimmed. You have to know its bpm or the number
            of bars. Beat per bar must be 4.
          </p>
        </div>

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
        <audio className="hidden" id="hidden-audio-for-duration" src={uploadedSrc}></audio>
      </div>
      {modalOpen && duration ? (
        <BpmOrBarsSelector
          duration={duration}
          onCancel={() => {
            setModalOpen(false);
            setUploadedSrc(undefined);
          }}
          onConfirm={(beatLength, barCount) => {
            setModalOpen(false);
            processUploadedFile({ beatLength, barCount, src: uploadedSrc });
          }}
        />
      ) : null}
    </div>
  );
}
