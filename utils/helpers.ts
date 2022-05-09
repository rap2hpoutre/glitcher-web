import crypto from "crypto";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
export { fetchFile } from "@ffmpeg/ffmpeg";

export const ffmpeg = createFFmpeg({
  log: true,
  corePath: "ffmpeg-core/ffmpeg-core.js",
});

export enum GlitchStyle {
  Breakcore = "breakcore",
  JungleGlitch = "jungle_glitch",
  InternalTest = "internal_test",
}

export enum Length {
  Beat = 1,
  HalfBeat = 1 / 2,
  ThirdBeat = 1 / 3,
  QuarterBeat = 1 / 4,
  SixthBeat = 1 / 6,
  EighthBeat = 1 / 8,
  SixteenthBeat = 1 / 16,
  TwentyFourthBeat = 1 / 24,
}

export interface SliceOptions {
  length: Length;
  beat: number;
  bar: number;
}

export interface Context {
  wav: string;
  output: string;
  barCount: number;
  beatPerBar: number;
  glitchStyle: GlitchStyle;
  totalTime: number;
  beatLength: number;
}

export async function slice(options: SliceOptions, ctx: Context): Promise<string> {
  const { length, beat, bar } = options;
  const output = filename(`${bar}-${beat}-${length}`, ctx);
  const beatTime = lengthToTimeLength(Length.Beat, ctx);
  const timePositionStart = beatTime * bar * ctx.beatPerBar + beatTime * beat;
  const duration = beatTime * length;
  await ffmpeg.run(
    "-i",
    ctx.wav,
    "-ss",
    String(timePositionStart),
    "-t",
    String(duration),
    "-y",
    output
  );
  return output;
}

function lengthToTimeLength(length: Length, ctx: Context): number {
  return ctx.beatLength * length;
}

export function filename(name: string, ctx: Context): string {
  return `${name}.wav`;
}

export function randomFilename(name: string, ctx: Context): string {
  return filename(`${name}-${crypto.randomBytes(10).toString("hex")}`, ctx);
}

export async function drill(
  options: SliceOptions,
  ctx: Context,
  drillDuration = 1
): Promise<string> {
  const { length, beat, bar } = options;
  const initialSample = await slice(options, ctx);
  const repeat = drillDuration / length;
  const output = filename(`${bar}-${beat}-${length}-drill`, ctx);
  return concat(Array(repeat).fill(initialSample), output);
}

async function effectFromSlice(
  options: SliceOptions,
  name: string,
  subCommand: string[],
  ctx: Context
): Promise<string> {
  const { length, beat, bar } = options;
  const initialSample = await slice(options, ctx);
  const output = filename(`${bar}-${beat}-${length}-${name}`, ctx);
  await ffmpeg.run("-y", "-i", initialSample, ...subCommand, output);
  return output;
}

export async function pitch(
  options: SliceOptions,
  pitchFactor: string,
  ctx: Context
): Promise<string> {
  return effectFromSlice(
    options,
    `pitch-${pitchFactor}`,
    ["-af", `asetrate=44100*${pitchFactor},aresample=44100,atempo=1/${pitchFactor}`],
    ctx
  );
}

export async function reverse(options: SliceOptions, ctx: Context): Promise<string> {
  return effectFromSlice(options, "reverse", [`-filter_complex`, `areverse`], ctx);
}

export async function robot(options: SliceOptions, ctx: Context): Promise<string> {
  return effectFromSlice(
    options,
    "robot",
    [
      `-filter_complex`,
      `afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75`,
    ],
    ctx
  );
}

export async function phaser(options: SliceOptions, ctx: Context): Promise<string> {
  return effectFromSlice(
    options,
    "reverse",
    [`-filter_complex`, "aphaser=type=t:speed=2:decay=0.6"],
    ctx
  );
}

export async function tremolo(options: SliceOptions, ctx: Context): Promise<string> {
  return effectFromSlice(options, "tremolo", [`-filter_complex`, `vibrato=f=4`], ctx);
}

export async function timeStretch(
  options: SliceOptions,
  time: number,
  ctx: Context
): Promise<string> {
  const tmp = await effectFromSlice(options, "timeStretch", [`-af`, `atempo=0.5,atempo=0.5`], ctx);
  const beatTime = lengthToTimeLength(Length.Beat, ctx);
  const output = filename(`${options.bar}-${options.beat}-${options.length}-timeStretch-cut`, ctx);
  await ffmpeg.run(
    "-i",
    tmp,
    "-ss",
    String(0),
    "-t",
    String(beatTime * options.length),
    "-y",
    output
  );

  return output;
}

export async function concat(files: string[], output: string): Promise<string> {
  if (files.length === 0) throw new Error("No files to concat");
  if (files.length === 1) return files[0];
  await ffmpeg.run(
    "-y",
    ...files.map((f) => ["-i", f]).flat(),
    "-filter_complex",
    files.map((v, k) => `[${k}:0]`).join("") + `concat=n=${files.length}:v=0:a=1[out]`,
    "-map",
    "[out]",
    output
  );
  return output;
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArr = array.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
}

export function mapTimes<T>(n: number, fn: (i: number) => T): T[] {
  return Array(n)
    .fill(0)
    .map((_, i) => fn(i));
}

export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function promiseAllSync(promises: Promise<any>[]): Promise<any[]> {
  let buffer = [];
  for (const promise of promises) {
    buffer.push(await promise);
  }
  return buffer;
}
