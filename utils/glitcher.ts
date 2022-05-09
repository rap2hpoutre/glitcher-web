import { concat, Context, GlitchStyle, pickRandom } from "./helpers";
import {
  barAphexStairsDown,
  barBrokenStart,
  barDblueGlitch,
  barDblueGlitchEndOnly,
  barDrillHardSuperSlice,
  barDrillLight,
  barDrillMedium,
  barNormal,
  barNormalReverseLastBeat,
  barReorder,
} from "./patterns";

export async function glitch({
  wav,
  output,
  barCount,
  totalTime,
  beatLength,
}: {
  wav: string;
  output: string;
  barCount: number;
  totalTime: number;
  beatLength: number;
}) {
  const targetBarCount = 8;
  const ctx: Context = {
    wav,
    output,
    barCount,
    beatPerBar: 4,
    glitchStyle: GlitchStyle.JungleGlitch,
    totalTime,
    beatLength,
  };
  const bars = [];
  for (let targetBar = 0; targetBar < targetBarCount; targetBar++) {
    console.log(`Processing bar ${targetBar}`);
    const bar = targetBar % ctx.barCount;
    if (ctx.glitchStyle === GlitchStyle.JungleGlitch) {
      if (targetBar === 0) {
        bars.push(await barNormal(bar, ctx));
      } else if (bar % 2 === 0) {
        const patterns = [
          barNormal,
          barDrillLight,
          barReorder,
          barNormalReverseLastBeat,
          barBrokenStart,
          barDblueGlitchEndOnly,
        ];
        bars.push(await pickRandom(patterns)(bar, ctx));
      } else {
        const patterns = [
          barDrillLight,
          barReorder,
          barDrillMedium,
          barNormalReverseLastBeat,
          barAphexStairsDown,
          barDrillHardSuperSlice,
          barDblueGlitch,
        ];
        bars.push(await pickRandom(patterns)(bar, ctx));
      }
    } else if (ctx.glitchStyle === GlitchStyle.InternalTest) {
      if (targetBar === 0) {
        bars.push(await barNormal(bar, ctx));
      } else {
        const patterns = [barDblueGlitchEndOnly];
        bars.push(await pickRandom(patterns)(bar, ctx));
      }
    } else {
      throw new Error("Not implemented");
    }
  }
  const result = await concat(bars, ctx.output);
  console.log(result);
}
