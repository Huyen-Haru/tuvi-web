export const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export const BRANCH_VI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
export const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const STEM_VI = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];

// Keys khớp với p.name từ iztro (không có hậu tố 宫, trừ 命宫)
export const PALACE_NAME_VI: Record<string, string> = {
  '命宫': 'Mệnh Cung',
  '兄弟': 'Huynh Đệ Cung',
  '夫妻': 'Phu Thê Cung',
  '子女': 'Tử Nữ Cung',
  '财帛': 'Tài Bạch Cung',
  '疾厄': 'Tật Ách Cung',
  '迁移': 'Thiên Di Cung',
  '仆役': 'Bộc Dịch Cung',
  '交友': 'Giao Hữu Cung',
  '官禄': 'Quan Lộc Cung',
  '田宅': 'Điền Trạch Cung',
  '福德': 'Phúc Đức Cung',
  '父母': 'Phụ Mẫu Cung',
};

export const STAR_NAME_VI: Record<string, string> = {
  // 14 chính tinh
  '紫微': 'Tử Vi',   '天机': 'Thiên Cơ',   '太阳': 'Thái Dương',
  '武曲': 'Vũ Khúc', '天同': 'Thiên Đồng', '廉贞': 'Liêm Trinh',
  '天府': 'Thiên Phủ','太阴': 'Thái Âm',   '贪狼': 'Tham Lang',
  '巨门': 'Cự Môn',  '天相': 'Thiên Tướng','天梁': 'Thiên Lương',
  '七杀': 'Thất Sát', '破军': 'Phá Quân',
  // phụ tinh cát
  '文昌': 'Văn Xương','文曲': 'Văn Khúc',
  '左辅': 'Tả Phụ',  '右弼': 'Hữu Bật',
  '天魁': 'Thiên Khôi','天钺': 'Thiên Việt',
  '禄存': 'Lộc Tồn', '天马': 'Thiên Mã',
  // sát tinh
  '擎羊': 'Kình Dương','陀罗': 'Đà La',
  '火星': 'Hỏa Tinh', '铃星': 'Linh Tinh',
  '地空': 'Địa Không', '地劫': 'Địa Kiếp',
  // tạp diệu
  '天空': 'Thiên Không','旬空': 'Tuần Không',
  '红鸾': 'Hồng Loan', '天喜': 'Thiên Hỉ',
  '天姚': 'Thiên Diêu', '天刑': 'Thiên Hình',
  '天虚': 'Thiên Hư',  '天哭': 'Thiên Khốc',
  '孤辰': 'Cô Thần',   '寡宿': 'Quả Tú',
};

export const SIHUA_VI: Record<string, string> = {
  '禄': 'Hóa Lộc', '权': 'Hóa Quyền', '科': 'Hóa Khoa', '忌': 'Hóa Kỵ',
};

export const SIHUA_KEY: Record<string, string> = {
  '禄': 'loc', '权': 'quyen', '科': 'khoa', '忌': 'ky',
};

export const HOUR_BRANCHES: Record<number, string> = {
  0: '子时 (23:00-01:00)',  1: '丑时 (01:00-03:00)',
  2: '寅时 (03:00-05:00)',  3: '卯时 (05:00-07:00)',
  4: '辰时 (07:00-09:00)',  5: '巳时 (09:00-11:00)',
  6: '午时 (11:00-13:00)',  7: '未时 (13:00-15:00)',
  8: '申时 (15:00-17:00)',  9: '酉时 (17:00-19:00)',
  10: '戌时 (19:00-21:00)',11: '亥时 (21:00-23:00)',
};

export const HOUR_BRANCH_VI: Record<number, string> = {
  0:  'Giờ Tý (23:00–01:00)',  1: 'Giờ Sửu (01:00–03:00)',
  2:  'Giờ Dần (03:00–05:00)', 3: 'Giờ Mão (05:00–07:00)',
  4:  'Giờ Thìn (07:00–09:00)',5: 'Giờ Tỵ (09:00–11:00)',
  6:  'Giờ Ngọ (11:00–13:00)', 7: 'Giờ Mùi (13:00–15:00)',
  8:  'Giờ Thân (15:00–17:00)',9: 'Giờ Dậu (17:00–19:00)',
  10: 'Giờ Tuất (19:00–21:00)',11:'Giờ Hợi (21:00–23:00)',
};
