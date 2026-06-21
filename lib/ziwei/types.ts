export interface BirthInput {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;   // 0-11 địa chi giờ (0=Tý, 1=Sửu, ... 11=Hợi)
  gender: 'male' | 'female';
  // Ngày âm lịch ghi đè (dùng lịch Việt thay vì lịch Trung)
  lunarYear?: number;
  lunarMonth?: number;
  lunarDay?: number;
  isLeapMonth?: boolean;
}

export type SiHua = 'loc' | 'quyen' | 'khoa' | 'ky';

export interface Star {
  name: string;       // tên tiếng Trung
  nameVI: string;     // tên tiếng Việt
  type: 'major' | 'minor' | 'lucky' | 'sha';
  brightness?: 'bright' | 'normal' | 'dim';
  siHua?: SiHua;
}

export interface Palace {
  index: number;        // 0-11 (theo địa chi)
  branch: number;       // địa chi 0-11
  branchName: string;   // Tý, Sửu...
  stem: number;         // thiên can 0-9
  stemName: string;     // Giáp, Ất...
  name: string;         // tên cung (tiếng Trung)
  nameVI: string;       // tên cung tiếng Việt
  stars: Star[];
  daXianAge?: [number, number];
  isCurrentDaXian?: boolean;
  isMingGong?: boolean;
  isShenGong?: boolean;
  isEmpty?: boolean;
  borrowedStars?: string[];
  oppositePalaceName?: string;
}

export interface LunarInfo {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  yearStemName: string;
  yearBranchName: string;
  isLeapMonth: boolean;
}

export interface ZiweiChart {
  birthInput: BirthInput;
  lunarInfo: LunarInfo;
  wuxingJu: number;
  wuxingJuName: string;
  palaces: Palace[];
  daXianAges: [number, number][];
  currentAge: number;
  currentDaXianIndex: number;
  mingGongBranch: number;
  shenGongBranch: number;
}
