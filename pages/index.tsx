import Header from "../components/Header";
import { fetchFile, ffmpeg, pickRandom } from "../utils/helpers";
import { useEffect, useState } from "react";
import BpmOrBarsSelector from "../components/BpmBarsSelector";
import { glitch } from "../utils/glitcher";
import Link from "next/link";

enum ProcessStatus {
  Idle,
  Processing,
  Finished,
  Error,
}

export default function Home() {
  const [uploadedSrc, setUploadedSrc] = useState<string | undefined>();
  const [originalSrc, setOriginalSrc] = useState<string | undefined>();
  const [convertedSrc, setConvertedSrc] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [processStatus, setProcessStatus] = useState(ProcessStatus.Idle);
  const [duration, setDuration] = useState<number | undefined>();
  const [message, setMessage] = useState("Click Start to transcode");

  function fileToObjectUrl(filename: string) {
    return URL.createObjectURL(
      new Blob([ffmpeg.FS("readFile", filename).buffer], { type: "audio/x-wav" })
    );
  }

  async function onRequestExample() {
    setProcessStatus(ProcessStatus.Processing);
    const sample = pickRandom([
      { beatLength: 0.348837875, barCount: 2, src: "./dl.wav" },
      { beatLength: 0.33333325, barCount: 1, src: "./dl2.wav" },
      { beatLength: 0.461539125, barCount: 4, src: "./dl3.wav" },
      { beatLength: 0.3389625625, barCount: 4, src: "./dl4.wav" },
      { beatLength: 0.342857125, barCount: 2, src: "./dl5.wav" },
      { beatLength: 0.36363375, barCount: 2, src: "./dl5.wav" },
    ]);
    processUploadedFile(sample);
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
      setProcessStatus(ProcessStatus.Processing);
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

    // Trigger error, still required to free memory.
    // I have to wait for new release of ffmpeg-wasm: https://github.com/ffmpegwasm/ffmpeg.wasm/issues/351
    if (ffmpeg.isLoaded()) ffmpeg.exit();

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
    setProcessStatus(ProcessStatus.Finished);
  }

  useEffect(() => {
    console.log(typeof SharedArrayBuffer);
  }, []);

  return (
    <div>
      <Header link="about" />

      <div className="container mx-auto my-5 font-mono">
        <h1 className="text-xl text-center mt-14 mx-2 md:mx-0">
          Turn a drum loop into <b>breakcore</b>!
        </h1>

        <div className="flex flex-col items-center mx-4 md:mx-0">
          <div className="flex flex-row items-center h-32 my-8">
            {processStatus === ProcessStatus.Idle && (
              <label className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-64">
                <input type="file" className="hidden" onChange={onBeforeUpload} key={uploadedSrc} />
                Upload a WAV file
              </label>
            )}
            {processStatus === ProcessStatus.Processing && (
              <div className="flex flex-row items-center">
                {message}
                <svg
                  className="animate-spin ml-2"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                >
                  <path
                    d="M8 1V.5H7V1h1zM7 4.5V5h1v-.5H7zm1 6V10H7v.5h1zM7 14v.5h1V14H7zM4.5 7.995H5v-1h-.5v1zm-3.5-1H.5v1H1v-1zM14 8h.5V7H14v1zm-3.5-1.005H10v1h.5v-1zM7 1v3.5h1V1H7zm0 9.5V14h1v-3.5H7zM4.5 6.995H1v1h3.5v-1zM14 7l-3.5-.005v1L14 8V7zM2.147 2.854l3 3 .708-.708-3-3-.708.708zm10-.708l-3 3 .708.708 3-3-.708-.708zM2.854 12.854l3-3-.708-.708-3 3 .708.708zm6.292-3l3 3 .708-.708-3-3-.708.708z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            )}
            {processStatus === ProcessStatus.Finished && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex flex-row justify-items-stretch mx-5 mb-2 text-sm">
                      <div className="flex-auto justify-self-start text-left font-semibold">
                        Original loop
                      </div>
                      <button
                        className="justify-self-end text-blue-600 hover:underline"
                        onClick={() => download("original.wav")}
                      >
                        Download
                      </button>
                    </div>
                    <audio id="original" src={originalSrc} controls></audio>
                  </div>
                  <div>
                    <div className="flex flex-row justify-items-stretch mx-5 mb-2 text-sm">
                      <div className="flex-auto justify-self-start text-left font-semibold">
                        Broken Loop! 💣💥
                      </div>
                      <button
                        className="justify-self-end text-blue-600 hover:underline"
                        onClick={() => download("converted.wav")}
                      >
                        Download
                      </button>
                    </div>
                    <audio id="converted" src={convertedSrc} controls></audio>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    className="mt-4 text-sm mx-auto text-blue-600 hover:underline"
                    onClick={() => setProcessStatus(ProcessStatus.Idle)}
                  >
                    Restart, upload a new file
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            Don&apos;t know where to start?{" "}
            <button onClick={onRequestExample} className="text-blue-600 hover:underline">
              Try an example!
            </button>
          </div>

          <div className="mt-16 text-xs text-gray-700 max-w-lg">
            <ul className="list-disc list-outside mx-4 md:mx-0">
              <li>
                The sample must be a <u>WAV file</u>, short and trimmed
              </li>
              <li>You have to know its bpm or the number of bars</li>
              <li>Beat per bar must be 4</li>
              <li>
                No drum loops? Download samples on{" "}
                <a
                  href="https://www.looperman.com/loops/cats/free-drum-loops-samples-sounds-wavs-download"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                  rel="noopener noreferrer"
                >
                  looperman.com
                </a>{" "}
                or{" "}
                <a
                  href="https://freesound.org/browse/tags/drum-loop/"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                  rel="noopener noreferrer"
                >
                  freesound.org
                </a>
              </li>
              <li>Low level instructions, unsafe functions, your browser may crash</li>
              <li>
                <Link href="/about">
                  <a className="text-blue-600 hover:underline">Learn more</a>
                </Link>{" "}
                about this project
              </li>
            </ul>
          </div>
        </div>

        <audio className="hidden" id="hidden-audio-for-duration" src={uploadedSrc}></audio>
      </div>
      {modalOpen && duration ? (
        <BpmOrBarsSelector
          duration={duration}
          onCancel={() => {
            setProcessStatus(ProcessStatus.Idle);
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
