import { astro } from 'iztro';
import { Solar } from 'lunar-javascript';
import type { BirthInput, ZiweiChart, Palace, Star, LunarInfo } from './types';
import {
  BRANCHES, BRANCH_VI, STEMS, STEM_VI,
  PALACE_NAME_VI, STAR_NAME_VI, SIHUA_KEY,
} from './constants';

const SHA_STARS = new Set([
  '擎羊','陀罗','火星','铃星','地空','地劫','天空','旬空','截路','大耗',
]);
const LUCKY_STARS = new Set([
  '文昌','文曲','左辅','右弼','天魁','天钺','禄存','天马',
  '天官','天福','天才','天寿','三台','八座','恩光','天贵',
  '台辅','龙池','凤阁','红鸾','天喜',
]);

function mapBrightness(b?: string): Star['brightness'] {
  if (!b) return 'normal';
  if (b === '庙' || b === '旺') return 'bright';
  if (b === '陷' || b === '不') return 'dim';
  return 'normal';
}

function mapType(name: string, iztroType: string): Star['type'] {
  if (SHA_STARS.has(name)) return 'sha';
  if (LUCKY_STARS.has(name)) return 'lucky';
  const t = (iztroType ?? '').toLowerCase();
  if (t.includes('主') || t === 'major') return 'major';
  if (t.includes('煞') || t === 'tough') return 'sha';
  if (t === 'soft') return 'lucky';
  return 'minor';
}

function mapSihua(m?: string): Star['siHua'] {
  if (!m) return undefined;
  return SIHUA_KEY[m] as Star['siHua'];
}

function parseWuxingJu(name: string): number {
  if (name.includes('二')) return 2;
  if (name.includes('三')) return 3;
  if (name.includes('四')) return 4;
  if (name.includes('五')) return 5;
  if (name.includes('六')) return 6;
  return 3;
}

export function getLunarInfo(year: number, month: number, day: number): LunarInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const rawMonth = lunar.getMonth();
  const yearStemIdx = STEMS.indexOf(lunar.getYearGan());
  const yearBranchIdx = BRANCHES.indexOf(lunar.getYearZhi());
  return {
    lunarYear: lunar.getYear(),
    lunarMonth: Math.abs(rawMonth),
    lunarDay: lunar.getDay(),
    yearStemName: STEM_VI[yearStemIdx] ?? '',
    yearBranchName: BRANCH_VI[yearBranchIdx] ?? '',
    isLeapMonth: rawMonth < 0,
  };
}

export function generateChart(input: BirthInput): ZiweiChart {
  const { year, month, day, hour, gender } = input;
  const iztroGender = gender === 'male' ? '男' : '女';

  // Nếu có ngày âm lịch Việt ghi đè, dùng byLunar() để tránh sai lệch lịch Việt/Trung
  let astrolabe;
  if (input.lunarYear && input.lunarMonth && input.lunarDay) {
    const lunarDateStr = `${input.lunarYear}-${input.lunarMonth}-${input.lunarDay}`;
    astrolabe = astro.byLunar(lunarDateStr, hour, iztroGender, input.isLeapMonth ?? false, true, 'zh-CN');
  } else {
    const solarDate = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    astrolabe = astro.bySolar(solarDate, hour, iztroGender, true, 'zh-CN');
  }
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - year;

  const palaces: Palace[] = astrolabe.palaces.map((p) => {
    const branchIdx = BRANCHES.indexOf(p.earthlyBranch as string);
    const stemIdx   = STEMS.indexOf(p.heavenlyStem as string);

    const allStars: Star[] = [
      ...(p.majorStars ?? []).map(s => ({
        name: s.name as string,
        nameVI: STAR_NAME_VI[s.name as string] ?? s.name as string,
        type: 'major' as const,
        brightness: mapBrightness(s.brightness as string),
        siHua: mapSihua(s.mutagen as string),
      })),
      ...(p.minorStars ?? []).map(s => ({
        name: s.name as string,
        nameVI: STAR_NAME_VI[s.name as string] ?? s.name as string,
        type: mapType(s.name as string, s.type as string),
        siHua: mapSihua(s.mutagen as string),
      })),
      ...(p.adjectiveStars ?? []).map(s => ({
        name: s.name as string,
        nameVI: STAR_NAME_VI[s.name as string] ?? s.name as string,
        type: 'minor' as const,
      })),
    ];

    const range = p.decadal?.range;
    const pName = p.name as string;

    return {
      index:    branchIdx >= 0 ? branchIdx : 0,
      branch:   branchIdx >= 0 ? branchIdx : 0,
      branchName: BRANCH_VI[branchIdx] ?? '',
      stem:     stemIdx >= 0 ? stemIdx : 0,
      stemName: STEM_VI[stemIdx] ?? '',
      name:     pName,
      nameVI:   PALACE_NAME_VI[pName] ?? pName,
      stars:    allStars,
      daXianAge: range ? [range[0], range[1]] as [number, number] : undefined,
      isCurrentDaXian: !!(range && currentAge >= range[0] && currentAge <= range[1]),
      isMingGong: pName === '命宫',
      isShenGong: !!(p.isBodyPalace),
    };
  });

  // Empty palace detection
  palaces.forEach(p => {
    const majors = p.stars.filter(s => s.type === 'major');
    p.isEmpty = majors.length === 0;
    if (p.isEmpty) {
      const oppBranch = (p.branch + 6) % 12;
      const opp = palaces.find(q => q.branch === oppBranch);
      p.borrowedStars = opp?.stars.filter(s => s.type === 'major').map(s => s.nameVI) ?? [];
      p.oppositePalaceName = opp?.nameVI ?? '';
    }
  });

  const mingGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfSoulPalace as string);
  const shenGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfBodyPalace as string);
  const wuxingJuName = astrolabe.fiveElementsClass as string;

  const daXianAges: [number, number][] = palaces
    .filter(p => p.daXianAge)
    .sort((a, b) => a.daXianAge![0] - b.daXianAge![0])
    .map(p => p.daXianAge!);

  const currentDaXianIndex = daXianAges.findIndex(
    ([s, e]) => currentAge >= s && currentAge <= e,
  );

  const lunarInfo = getLunarInfo(year, month, day);

  return {
    birthInput: input,
    lunarInfo,
    wuxingJu: parseWuxingJu(wuxingJuName),
    wuxingJuName,
    palaces,
    daXianAges,
    currentAge,
    currentDaXianIndex,
    mingGongBranch: mingGongBranch >= 0 ? mingGongBranch : 0,
    shenGongBranch: shenGongBranch >= 0 ? shenGongBranch : 0,
  };
}
