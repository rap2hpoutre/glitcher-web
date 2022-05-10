import { useEffect, useMemo, useState } from "react";
import Modal, { ModalButton } from "../components/Modal";

export default function BpmOrBarsSelector({
  duration,
  onCancel,
  onConfirm,
}: {
  duration: number;
  onCancel: () => void;
  onConfirm: (beatsLength: number, bars: number) => void;
}) {
  const [bpmOrBars, setBpmOrBars] = useState("bars");
  const [beatDuration, setBeatDuration] = useState<number>(0);
  const [barCount, setBarCount] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(0);

  const [initialBeatDuration, initialBarCount, initialBpm] = useMemo(() => {
    const minBeatDuration = 60 / 90;
    const maxBeatDuration = 60 / 220;
    let currentBeatDuration = duration / 4;
    let currentBarCount = 1;
    let currentBpm = 60 / currentBeatDuration;
    if (currentBeatDuration < maxBeatDuration) throw new Error("Can not parse this duration");
    while (currentBeatDuration > minBeatDuration) {
      currentBarCount *= 2;
      currentBeatDuration /= 2;
      currentBpm = 60 / currentBeatDuration;
    }
    currentBpm = Math.round((currentBpm + Number.EPSILON) * 1000) / 1000;
    return [currentBeatDuration, currentBarCount, currentBpm];
  }, [duration]);

  useEffect(() => {
    setBeatDuration(initialBeatDuration);
    setBarCount(initialBarCount);
    setBpm(initialBpm);
  }, [initialBeatDuration, initialBarCount, initialBpm, bpmOrBars]);

  useEffect(() => {
    if (bpmOrBars === "bpm") {
      setBeatDuration(60 / bpm);
    } else {
      setBeatDuration(duration / barCount / 4);
    }
  }, [barCount, bpm, duration, bpmOrBars]);

  return (
    <Modal
      title={
        <div>
          Confirm number of{" "}
          <dfn
            className="underline decoration-dotted not-italic"
            title=" In music theory, a bar (or measure) is a single unit of time containing a specific number of beats played at a particular tempo. A bar is usually subdivided into smaller beats, called beats. In this application, a bar is subdivided into 4 beats."
          >
            bars
          </dfn>{" "}
          or BPM
        </div>
      }
      onClickOutside={onCancel}
      buttons={<ButtonOrError bpm={bpm} onConfirm={() => onConfirm(beatDuration!, barCount!)} />}
      content={
        <div>
          <div>
            <div>
              <label className="flex flex-row items-center">
                <input
                  type="radio"
                  name="bpmOrBars"
                  value="bars"
                  checked={bpmOrBars === "bars"}
                  onChange={(e) => {
                    setBpmOrBars(e.target.value);
                  }}
                />
                <span className="flex-auto ml-2">Bars</span>
              </label>
            </div>
            <div>
              <label className="flex flex-row items-center">
                <input
                  type="radio"
                  name="bpmOrBars"
                  value="bpm"
                  checked={bpmOrBars === "bpm"}
                  onChange={(e) => {
                    setBpmOrBars(e.target.value);
                  }}
                />
                <span className="flex-auto ml-2">BPM</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col my-4">
            {bpmOrBars === "bpm" ? (
              <div className="flex flex-col">
                <label className="flex flex-col">
                  <span className="flex-auto text-sm font-semibold">BPM (beats per minute)</span>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md p-2"
                    value={String(bpm)}
                    onChange={(e) => {
                      setBpm(Number(e.target.value));
                    }}
                  />
                </label>
                <div className="text-sm">
                  {Number(bpm) > 110 ? (
                    <div>
                      Suggestion is: <b>{Number(bpm)}</b> bpm.
                      <br />
                      Change to <b>{Number(bpm) / 2}</b> for better result, if you feel like the
                      orignial beat is slow (lo-fi, abstract hip-hop, etc.)
                    </div>
                  ) : (
                    <div>
                      Suggestion is: <b>{Number(bpm)}</b> bpm.
                      <br />
                      Change to <b>{Number(bpm) * 2}</b> for better result, if you feel like the
                      orignial beat is fast (jungle, drum and bass, breakcore, etc.)
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col my-4">
                <label className="flex flex-col">
                  <span className="flex-auto text-sm font-semibold">
                    Bars (each bar has 4 beats)
                  </span>
                  <input
                    type="number"
                    value={String(barCount)}
                    className="border border-gray-300 rounded-md p-2"
                    onChange={(e) => {
                      setBarCount(Number(e.target.value));
                    }}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 my-3">
            <p className="my-2">
              BPM and bars are based on duration and classic BPM values. No sample analysis has been
              performed. The values suggested should not be considered reliable, please double check
              them.
            </p>
            <p className="my-2">
              Duration measured in seconds is {duration}. Beat duration is {beatDuration} seconds
              (initial: {initialBeatDuration}). Note that the sample will be cut up to{" "}
              {beatDuration / 64} seconds slices to render certain effects, so it is important that
              your sample is correctly cut, trimmed and sampled.
            </p>
          </div>
        </div>
      }
    />
  );
}

function ButtonOrError({ onConfirm, bpm }: { onConfirm: () => void; bpm: number | string }) {
  if (Number(bpm) < 50) {
    return <span>BPM is too low (&lt; 50)</span>;
  }
  if (Number(bpm) > 220) {
    return <span>BPM is too high (&gt; 220)</span>;
  }
  return <ModalButton onClick={() => onConfirm()} text="ok" />;
}
