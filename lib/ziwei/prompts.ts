import type { ZiweiChart, Palace } from './types';

const SIHUA_MEANING: Record<string, string> = {
  loc: 'Hóa Lộc (tài lộc, thuận lợi, phúc phận)',
  quyen: 'Hóa Quyền (quyền lực, chủ động, kiểm soát)',
  khoa: 'Hóa Khoa (danh tiếng, học vấn, uy tín)',
  ky: 'Hóa Kỵ (ngăn trở, ách tắc, cần đề phòng)',
};

const STAR_PROFILE: Record<string, string> = {
  '紫微': 'Tử Vi — đế vương, quyền lực, tự tôn, lãnh đạo. Cần Tả Phụ Hữu Bật hội chiếu mới phát huy tối đa.',
  '天机': 'Thiên Cơ — mưu trí, biến hóa, tâm linh. Giỏi kế hoạch nhưng hay thay đổi quyết định.',
  '太阳': 'Thái Dương — ánh sáng, danh tiếng, nhiệt huyết, cống hiến. 庙旺 (Mão-Thân): rực rỡ; lạc hãm (Dậu-Dần): dễ hao tán.',
  '武曲': 'Vũ Khúc — tài lộc cứng, ý chí, cô quả. Giỏi kinh doanh nhưng thiếu mềm mại trong tình cảm.',
  '天同': 'Thiên Đồng — phúc thọ, hưởng thụ, hòa bình. Phúc trời cho nhưng dễ thiếu chí tiến thủ.',
  '廉贞': 'Liêm Trinh — phẩm giá lưỡng tính (vừa đức hạnh vừa dục vọng). Nghệ thuật, chính trị, dễ vướng pháp lý.',
  '天府': 'Thiên Phủ — bảo khố, tích lũy, ổn định. Giỏi giữ của nhưng bảo thủ.',
  '太阴': 'Thái Âm — âm nhu, trực giác, bất động sản. 庙旺 (Tý-Tỵ): phát đạt; lạc hãm (Ngọ-Hợi): cảm xúc bất ổn.',
  '贪狼': 'Tham Lang — ham muốn, đa tài, quyến rũ. Phát mạnh tại Thiên Di. Cẩn thận phóng túng.',
  '巨门': 'Cự Môn — miệng lưỡi, thị phi, hùng biện. Giỏi tranh luận; dễ gặp khẩu nghiệp.',
  '天相': 'Thiên Tướng — phụ tướng, ấn tín, trung gian. Phù hợp trợ lý cấp cao, hành chính.',
  '天梁': 'Thiên Lương — đức hạnh, giải nạn, phúc thọ. Hay có người giải cứu lúc nguy nan.',
  '七杀': 'Thất Sát — chinh phục, ý chí, cô độc. Tự lực mạnh nhưng ít nhận hỗ trợ tự nguyện.',
  '破军': 'Phá Quân — đột phá, cải cách, tiên phong. Phá cũ để xây mới. Không chấp nhận hiện trạng.',
};

const PALACE_ROLE: Record<string, string> = {
  '命宫': 'bản thân, tính cách, cách cục tiên thiên',
  '兄弟宫': 'anh chị em, đối tác, tiền mặt hiện có',
  '夫妻宫': 'hôn nhân, tình cảm, bạn đời',
  '子女宫': 'con cái, thuộc cấp, sáng tạo',
  '财帛宫': 'thu nhập, cách kiếm tiền, tài vận',
  '疾厄宫': 'sức khỏe, tai nạn, thể chất',
  '迁移宫': 'cơ hội bên ngoài, xuất ngoại, công chúng',
  '交友宫': 'bạn bè, quý nhân, tiểu nhân',
  '官禄宫': 'sự nghiệp, địa vị, kinh doanh',
  '田宅宫': 'bất động sản, gia đình, tài tích lũy',
  '福德宫': 'phúc phận tinh thần, hưởng thụ, nội tâm',
  '父母宫': 'cha mẹ, văn bằng, hợp đồng, ấn tín',
};

function sihuaVI(s: string): string {
  return s === 'loc' ? 'Hóa Lộc' : s === 'quyen' ? 'Hóa Quyền' : s === 'khoa' ? 'Hóa Khoa' : 'Hóa Kỵ';
}

export function buildSystemPrompt(chart: ZiweiChart): string {
  const { birthInput, lunarInfo, wuxingJuName, palaces, currentAge, currentDaXianIndex } = chart;
  const gender = birthInput.gender === 'male' ? 'Nam' : 'Nữ';
  const currentYear = new Date().getFullYear();

  // Mệnh Cung info
  const mingGong = palaces.find(p => p.isMingGong);
  const mingMajors = mingGong?.stars.filter(s => s.type === 'major')
    .map(s => `${s.nameVI}${s.siHua ? ' ' + sihuaVI(s.siHua) : ''}`)
    .join(' + ') ?? '(trống)';

  // Đại Hạn hiện tại
  const dxPalace = palaces.find(p => p.isCurrentDaXian);
  const dxAge = dxPalace?.daXianAge ?? [0, 0];
  const dxMajors = dxPalace?.stars.filter(s => s.type === 'major')
    .map(s => s.nameVI).join(', ') ?? '(trống)';
  const dxSihua = dxPalace?.stars.filter(s => s.siHua)
    .map(s => `${s.nameVI} ${sihuaVI(s.siHua!)}`)
    .join(' | ') ?? 'Không có';

  // Tứ Hóa bản mệnh
  const allSihua = palaces.flatMap(p =>
    p.stars.filter(s => s.siHua).map(s =>
      `${s.nameVI} ${sihuaVI(s.siHua!)} → ${p.nameVI}`
    )
  ).join('\n  ');

  // Các cung chính
  const keyPalaces = ['命宫','夫妻宫','财帛宫','官禄宫','田宅宫','疾厄宫','迁移宫'];
  const palacesSummary = keyPalaces.map(pn => {
    const p = palaces.find(pp => pp.name === pn);
    if (!p) return '';
    const stars = p.stars.filter(s => s.type === 'major')
      .map(s => `${s.nameVI}${s.brightness === 'bright' ? '庙' : s.brightness === 'dim' ? 'hãm' : ''}${s.siHua ? ' ' + sihuaVI(s.siHua) : ''}`)
      .join('+') || `(trống — mượn ${p.oppositePalaceName})`;
    return `  • ${p.nameVI} [${p.branchName}/${p.stemName}]: ${stars}`;
  }).filter(Boolean).join('\n');

  // Star profiles for stars in this chart
  const chartStarNames = [...new Set(palaces.flatMap(p => p.stars.filter(s => s.type === 'major').map(s => s.name)))];
  const starProfiles = chartStarNames
    .filter(n => STAR_PROFILE[n])
    .map(n => `  • ${STAR_PROFILE[n]}`)
    .join('\n');

  return `Bạn là chuyên gia Tử Vi Đẩu Số theo hệ thống Nghê Hải Hà (Ni Haixia). LUÔN trả lời tiếng Việt, súc tích và thực tế.

══════════ THÔNG TIN LÁ SỐ ══════════
Họ tên: ${birthInput.name}
Giới tính: ${gender}
Sinh: ${birthInput.day}/${birthInput.month}/${birthInput.year} dương lịch
Âm lịch: ${lunarInfo.lunarDay}/${lunarInfo.lunarMonth}/${lunarInfo.lunarYear} (${lunarInfo.yearStemName} ${lunarInfo.yearBranchName})
Ngũ Hành Cục: ${wuxingJuName}
Tuổi hiện tại (${currentYear}): ${currentAge} tuổi

Chính tinh Mệnh Cung: ${mingMajors}
Đại Hạn hiện tại (${dxAge[0]}–${dxAge[1]} tuổi): ${dxPalace?.nameVI ?? '?'} [${dxMajors}]

══════════ CÁC CUNG TRỌNG YẾU ══════════
${palacesSummary}

══════════ TỨ HÓA BẢN MỆNH ══════════
  ${allSihua || '(không có)'}

Tứ Hóa Đại Hạn hiện tại (${dxPalace?.stemName ?? '?'} can):
  ${dxSihua}

══════════ KIẾN THỨC TỬ VI ══════════
Chính tinh trong lá số này:
${starProfiles}

Quy tắc Tứ Hóa (Nghê Hải Hà):
  • Hóa Lộc: tài lộc, thuận lợi → cung nhận Lộc được phù trợ
  • Hóa Quyền: quyền lực, chủ động → cung nhận Quyền thêm năng lượng kiểm soát
  • Hóa Khoa: danh tiếng, uy tín → cung nhận Khoa thêm thanh danh bền
  • Hóa Kỵ: ngăn trở, ách tắc → cung bị Kỵ cần đặc biệt chú ý và đề phòng

Đại Hạn: mỗi 10 năm đi một cung. Cung nào "lên ngôi" thì lĩnh vực đó bị ảnh hưởng mạnh nhất.
Lưu Niên: vòng năm. Tam Vận hội = Bản Mệnh × Đại Hạn × Lưu Niên.
Liêm Trinh Hóa Kỵ tại Tật Ách → chú ý sức khỏe tim mạch.
Thiên Đồng Hóa Kỵ tại Phu Thê → hôn nhân gặp trở ngại, nên kết hôn muộn.
Thái Dương庙 Hóa Lộc tại Mệnh → hào quang và tài lộc từ bản thân, phù hợp công việc công khai.

══════════ DỮ LIỆU ĐẦY ĐỦ (JSON) ══════════
${JSON.stringify(chart, null, 1)}

══════════ QUY TẮC ĐỊNH DẠNG ══════════
- Tiêu đề: **【Tên mục】** (hiển thị màu vàng)
- Sao: Tử Vi, Thái Dương, Vũ Khúc... (tiếng Việt)
- Cung: Mệnh Cung, Tài Bạch Cung, Quan Lộc Cung...
- Tứ Hóa: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ
- Câu ngắn gọn, thực tế. Dẫn lời Nghê Hải Hà khi phù hợp.`;
}

export const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Luận tổng quan mệnh cách:

**【Định Tính Mệnh Cách】**
Một câu tóm tắt cách cục cốt lõi.

**【Chính Tinh Mệnh Cung】**
Đặc trưng chính tinh tại Mệnh, dẫn lời Nghê Hải Hà.

**【Tam Phương Tứ Chính】**
Mệnh — Tài Bạch — Quan Lộc — Thiên Di liên động.

**【Điểm Mạnh & Điểm Cần Chú Ý】**
Thiên phú và bài học cuộc đời theo lá số này.`,

  daxian: `Phân tích sâu Đại Hạn hiện tại:

**【Tổng Quan Đại Hạn】**
Cung Đại Hạn, chính tinh, ý nghĩa 10 năm này.

**【Tứ Hóa Đại Hạn】**
Phân tích Lộc/Quyền/Khoa/Kỵ trong Đại Hạn, rơi vào cung nào, ảnh hưởng gì.

**【Sự Nghiệp & Tài Lộc Đại Hạn】**
Xu hướng 10 năm: tăng hay giảm, cơ hội và rủi ro.

**【Tình Duyên & Gia Đình Đại Hạn】**
Biến chuyển tình cảm trong giai đoạn này.

**【Sức Khỏe Đại Hạn】**
Điểm cần chú ý sức khỏe theo cung Tật Ách liên động.

**【Thời Điểm Then Chốt & Lời Khuyên】**
3 điều nên làm ngay trong Đại Hạn này.`,

  luunien: `Phân tích Lưu Niên hiện tại (năm ${new Date().getFullYear()}):

**【Tứ Hóa Lưu Niên】**
Tứ hóa của năm can hiện tại rơi vào cung nào trong lá số, ý nghĩa gì.

**【Sự Nghiệp & Tài Lộc Năm Nay】**
Tam vận hội: Bản Mệnh × Đại Hạn × Lưu Niên tác động đến sự nghiệp và tài chính.

**【Tình Duyên Năm Nay】**
Tình cảm năm nay có biến chuyển gì?

**【Sức Khỏe Năm Nay】**
Điểm cần chú ý đặc biệt.

**【Tháng Tốt & Tháng Cần Thận Trọng】**
2-3 tháng âm lịch thuận lợi nhất và cần đề phòng nhất.

**【Lời Khuyên Năm Nay】**
3 điều nên làm, 2 điều nên tránh.`,

  love: `Phân tích sâu tình duyên hôn nhân:

**【Cách Cục Tình Duyên】**
Một câu định tính mệnh tình cảm của người này.

**【Phân Tích Phu Thê Cung】**
Chính tinh, tứ hóa, sao sát tại Phu Thê theo Nghê Hải Hà.

**【Vận Tình Duyên Đại Hạn Hiện Tại】**
10 năm này tình cảm như thế nào?

**【Lời Khuyên Thực Tế】**
Thời điểm phù hợp, loại người phù hợp, cần tránh gì.`,

  career: `Phân tích sâu sự nghiệp:

**【Cách Cục Sự Nghiệp】**
Làm thuê hay khởi nghiệp, ngành nghề phù hợp nhất.

**【Quan Lộc & Tài Bạch】**
Phân tích Quan Lộc Cung và Tài Bạch Cung, liên động tứ hóa.

**【Vận Sự Nghiệp 10 Năm Này】**
Xu hướng Đại Hạn hiện tại về công danh và tài chính.

**【Lời Khuyên Thực Tế】**
Ngành nghề cụ thể, chiến lược phù hợp, điều cần tránh.`,

  wealth: `Phân tích sâu tài lộc:

**【Cách Cục Tài Vận】**
Tài chủ động hay bị động, mạnh hay yếu.

**【Tài Bạch & Điền Trạch】**
Thu nhập và tài tích lũy theo tứ hóa liên động.

**【Tài Vận Đại Hạn Hiện Tại】**
Xu hướng tài chính 10 năm này.

**【Lời Khuyên Tài Chính】**
Nên đầu tư gì, tránh gì, quản lý tiền như thế nào.`,

  health: `Phân tích sức khỏe:

**【Tật Ách Cung & Rủi Ro Chính】**
Sao tại Tật Ách, bộ phận cơ thể cần chú ý theo Tý Ngọ Lưu Chú.

**【Xu Hướng Sức Khỏe Đại Hạn】**
10 năm này sức khỏe theo chiều hướng nào.

**【Năm Nay Cần Lưu Ý】**
Lưu Niên tác động đến sức khỏe cụ thể.

**【Lời Khuyên Dưỡng Sinh】**
Điều cần làm ngay để bảo vệ sức khỏe.`,
};

export function buildPalacePrompt(palace: Palace): string {
  const role = PALACE_ROLE[palace.name] ?? '';
  const majors = palace.stars.filter(s => s.type === 'major');
  const starDesc = majors.length > 0
    ? majors.map(s => `${s.nameVI}${s.brightness === 'bright' ? '庙' : s.brightness === 'dim' ? '(hãm)' : ''}${s.siHua ? ' Hóa ' + (s.siHua === 'loc' ? 'Lộc' : s.siHua === 'quyen' ? 'Quyền' : s.siHua === 'khoa' ? 'Khoa' : 'Kỵ') : ''}`).join(' + ')
    : `Trống — mượn ${palace.oppositePalaceName ?? 'đối cung'}`;

  return `Phân tích trọng tâm **${palace.nameVI}** (chủ quản: ${role}), chính tinh: ${starDesc}:

**【Định Tính Cung Vị】**
Ý nghĩa cung này trong lá số và nhận định tổng thể về cấu hình sao.

**【Luận Giải Chính Tinh】**
Phân tích theo hệ thống Nghê Hải Hà.

**【Tam Phương Tứ Chính Liên Động】**
Ảnh hưởng các cung xung quanh.

**【Lời Khuyên Thực Tế】**
Gợi ý cụ thể dựa trên cung vị này.`;
}
