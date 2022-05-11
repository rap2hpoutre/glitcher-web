import {
  concat,
  Context,
  drill,
  Length,
  pickRandom,
  pitch,
  randomFilename,
  randomNumber,
  reverse,
  robot,
  shuffleArray,
  slice,
  timeStretch,
  tremolo,
} from "./helpers";

const drillLengthLight = [
  Length.Beat,
  Length.HalfBeat,
  Length.HalfBeat,
  Length.QuarterBeat,
  Length.QuarterBeat,
  Length.EighthBeat,
  Length.SixteenthBeat,
];

const halfDrillLengthLight = [
  Length.HalfBeat,
  Length.HalfBeat,
  Length.QuarterBeat,
  Length.QuarterBeat,
  Length.EighthBeat,
  Length.SixteenthBeat,
];

const drillLengthMedium = [
  Length.Beat,
  Length.HalfBeat,
  Length.HalfBeat,
  Length.ThirdBeat,
  Length.ThirdBeat,
  Length.QuarterBeat,
  Length.QuarterBeat,
  Length.SixthBeat,
  Length.SixthBeat,
  Length.EighthBeat,
  Length.SixteenthBeat,
  Length.TwentyFourthBeat,
];

export async function barReorder(bar: number, ctx: Context): Promise<string> {
  return concat(
    shuffleArray([
      await slice({ length: Length.Beat, beat: 0, bar }, ctx),
      await slice({ length: Length.Beat, beat: 1, bar }, ctx),
      await slice({ length: Length.Beat, beat: 2, bar }, ctx),
      await slice({ length: Length.Beat, beat: 3, bar }, ctx),
    ]),
    randomFilename(`${bar}-reorder`, ctx)
  );
}

export async function barNormal(bar: number, ctx: Context): Promise<string> {
  return slice({ length: Length.Beat * 4, beat: 0, bar }, ctx);
}

export async function barDrillLight(bar: number, ctx: Context): Promise<string> {
  const slices = [];
  for (let i = 0; i < 4; i++) {
    slices.push(await drill({ length: pickRandom(drillLengthLight), beat: i, bar }, ctx));
  }
  return concat(slices, randomFilename(`${bar}-drill-light`, ctx));
}

export async function barDrillMedium(bar: number, ctx: Context): Promise<string> {
  const slices = [];
  for (let i = 0; i < 4; i++) {
    slices.push(await drill({ length: pickRandom(drillLengthMedium), beat: i, bar }, ctx));
  }
  return concat(slices, randomFilename(`${bar}-drill-medium`, ctx));
}

export async function barDrillHardSuperSlice(bar: number, ctx: Context): Promise<string> {
  const slices = [];
  for (let i = 0; i < 8; i++) {
    slices.push(
      await drill({ length: pickRandom(halfDrillLengthLight), beat: i / 2, bar }, ctx, 0.5)
    );
  }
  return concat(slices, randomFilename(`${bar}-drill-super-slice-medium`, ctx));
}

export async function barNormalReverseLastBeat(bar: number, ctx: Context): Promise<string> {
  const intro = await slice({ length: Length.Beat * 3, beat: 0, bar }, ctx);
  const rev = await reverse({ length: Length.Beat, beat: 3, bar }, ctx);
  return concat([intro, rev], randomFilename(`${bar}-normal-reverse-last-beat`, ctx));
}

export async function barAphexStairsDown(bar: number, ctx: Context): Promise<string> {
  const intro = await slice({ length: Length.Beat * 3, beat: 0, bar }, ctx);
  return concat(
    [
      intro,
      await pitch({ length: Length.QuarterBeat, beat: 3, bar }, "0.9", ctx),
      await pitch({ length: Length.QuarterBeat, beat: 3, bar }, "0.85", ctx),
      await pitch({ length: Length.QuarterBeat, beat: 3, bar }, "0.8", ctx),
      await pitch({ length: Length.QuarterBeat, beat: 3, bar }, "0.75", ctx),
    ],
    randomFilename(`${bar}-normal-reverse-last-beat`, ctx)
  );
}

export async function barDblueGlitch(bar: number, ctx: Context): Promise<string> {
  const slices = [];
  for (let i = 0; i < 4; i++) {
    const x = randomNumber(0, 6);
    switch (x) {
      case 0:
        slices.push(await robot({ length: Length.Beat, beat: i, bar }, ctx));
        break;
      case 1:
        slices.push(await drill({ length: pickRandom(drillLengthLight), beat: i, bar }, ctx));
        break;
      case 2:
        slices.push(await pitch({ length: Length.Beat, beat: i, bar }, "1.5", ctx));
        break;
      case 3:
        slices.push(await pitch({ length: Length.Beat, beat: i, bar }, "0.5", ctx));
        break;
      case 4:
        slices.push(await reverse({ length: Length.Beat, beat: i, bar }, ctx));
        break;
      case 5:
        slices.push(await tremolo({ length: Length.Beat, beat: i, bar }, ctx));
        break;
      case 6:
        slices.push(await timeStretch({ length: Length.Beat, beat: i, bar }, 8, ctx));
        break;
      default:
        throw new Error("Unknown x: " + x);
    }
  }
  return concat(slices, randomFilename(`${bar}-dblue-glitch`, ctx));
}

export async function barDblueGlitchEndOnly(bar: number, ctx: Context): Promise<string> {
  const slices = [];
  for (let i = 0; i < 2; i++) {
    const x = randomNumber(0, 3);
    switch (x) {
      case 0:
        slices.push(await robot({ length: Length.Beat, beat: i, bar }, ctx));
        break;
      case 1:
        slices.push(await reverse({ length: Length.Beat, beat: i, bar }, ctx));
        break;
      case 2:
        slices.push(await tremolo({ length: Length.Beat, beat: i, bar }, ctx));
        break;
      case 3:
        slices.push(await timeStretch({ length: Length.Beat, beat: i, bar }, 8, ctx));
        break;
      default:
        throw new Error("Unknown x: " + x);
    }
  }
  return concat(
    [await slice({ length: Length.Beat * 2, beat: 0, bar }, ctx), ...slices],
    randomFilename(`${bar}-dblue-glitch`, ctx)
  );
}

export async function barBrokenStart(bar: number, ctx: Context): Promise<string> {
  return concat(
    [
      await slice({ length: Length.Beat, beat: 0, bar }, ctx),
      await slice({ length: Length.HalfBeat, beat: 1, bar }, ctx),
      await slice({ length: Length.Beat, beat: 0, bar }, ctx),
      await slice({ length: Length.HalfBeat, beat: 1, bar }, ctx),
      await slice({ length: Length.Beat, beat: 0, bar }, ctx),
    ],
    randomFilename(`${bar}-bar-Broken-Start`, ctx)
  );
}
