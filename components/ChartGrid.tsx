'use client';
import type { Palace, ZiweiChart } from '@/lib/ziwei/types';

interface Props {
  chart: ZiweiChart;
  onSelectPalace: (palace: Palace) => void;
  selectedBranch?: number;
}

// Layout: 4x4 grid, center 2x2 = info. Palaces in order by position
// Top row:    [3] Tỵ  | [4] Ngọ | [5] Mùi | [6] Thân
// Left col:   [2] Thìn                       [7] Dậu
//             [1] Mão                         [8] Tuất
// Bottom row: [0] Dần | [11]Sửu | [10]Tý  | [9] Hợi
// Grid positions (row, col) 0-indexed in a 4x4 grid:
const PALACE_LAYOUT: Record<number, [number, number]> = {
  // branch index → [row, col]
  5:  [0, 0], // Tỵ
  6:  [0, 1], // Ngọ
  7:  [0, 2], // Mùi
  8:  [0, 3], // Thân
  4:  [1, 0], // Thìn
  9:  [1, 3], // Dậu
  3:  [2, 0], // Mão
  10: [2, 3], // Tuất
  2:  [3, 0], // Dần
  1:  [3, 1], // Sửu
  0:  [3, 2], // Tý
  11: [3, 3], // Hợi
};

function SihuaBadge({ sihua }: { sihua: string }) {
  const cls = sihua === 'loc' ? 'sihua-loc' : sihua === 'quyen' ? 'sihua-quyen' : sihua === 'khoa' ? 'sihua-khoa' : 'sihua-ky';
  const label = sihua === 'loc' ? '祿' : sihua === 'quyen' ? '権' : sihua === 'khoa' ? '科' : '忌';
  return <span className={cls} style={{ fontSize: 9, marginLeft: 2, fontWeight: 700 }}>{label}</span>;
}

function PalaceCell({ palace, selected, onClick, centerInfo }: {
  palace: Palace;
  selected: boolean;
  onClick: () => void;
  centerInfo?: React.ReactNode;
}) {
  const majors = palace.stars.filter(s => s.type === 'major');
  const luckies = palace.stars.filter(s => s.type === 'lucky' || s.type === 'minor').slice(0, 3);
  const shas = palace.stars.filter(s => s.type === 'sha').slice(0, 2);

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(212,168,67,0.08)' : 'var(--card)',
        border: `1px solid ${selected ? 'rgba(212,168,67,0.35)' : 'var(--border)'}`,
        borderRadius: 8,
        padding: '8px 6px',
        cursor: 'pointer',
        position: 'relative',
        minHeight: 120,
        transition: 'all 0.15s',
        overflow: 'hidden',
      }}
    >
      {/* Cung name + daXian badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          color: palace.isMingGong ? 'var(--gold)' : 'var(--text2)',
          letterSpacing: '0.03em',
        }}>
          {palace.nameVI.replace(' Cung', '')}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          {palace.isCurrentDaXian && (
            <span style={{ fontSize: 8, background: 'rgba(212,168,67,0.2)', color: 'var(--gold)', borderRadius: 3, padding: '1px 4px' }}>
              ĐH
            </span>
          )}
          {palace.isShenGong && (
            <span style={{ fontSize: 8, background: 'rgba(91,155,213,0.2)', color: 'var(--blue)', borderRadius: 3, padding: '1px 4px' }}>
              THÂN
            </span>
          )}
          {palace.isMingGong && (
            <span style={{ fontSize: 8, background: 'rgba(212,168,67,0.15)', color: 'var(--gold2)', borderRadius: 3, padding: '1px 4px' }}>
              MỆNH
            </span>
          )}
        </div>
      </div>

      {/* Branch/Stem */}
      <div style={{ fontSize: 9, color: 'var(--faint)', marginBottom: 5 }}>
        {palace.branchName} · {palace.stemName}
        {palace.daXianAge && (
          <span style={{ marginLeft: 4, color: 'var(--faint)' }}>
            {palace.daXianAge[0]}–{palace.daXianAge[1]}
          </span>
        )}
      </div>

      {/* Major stars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 4 }}>
        {majors.length > 0 ? majors.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: s.brightness === 'bright' ? 'var(--gold2)' : s.brightness === 'dim' ? 'var(--faint)' : 'var(--text)',
            }}>
              {s.nameVI}
            </span>
            {s.brightness === 'bright' && <span style={{ fontSize: 8, color: 'var(--gold)', marginLeft: 1 }}>庙</span>}
            {s.brightness === 'dim' && <span style={{ fontSize: 8, color: 'var(--faint)', marginLeft: 1 }}>hãm</span>}
            {s.siHua && <SihuaBadge sihua={s.siHua} />}
          </div>
        )) : (
          <span style={{ fontSize: 10, color: 'var(--faint)', fontStyle: 'italic' }}>
            Trống · {palace.borrowedStars?.join(', ')}
          </span>
        )}
      </div>

      {/* Lucky/minor stars */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {luckies.map(s => (
          <span key={s.name} style={{ fontSize: 8, color: 'var(--blue)', opacity: 0.8 }}>
            {s.nameVI}{s.siHua && <SihuaBadge sihua={s.siHua} />}
          </span>
        ))}
        {shas.map(s => (
          <span key={s.name} style={{ fontSize: 8, color: 'var(--red)', opacity: 0.8 }}>
            {s.nameVI}{s.siHua && <SihuaBadge sihua={s.siHua} />}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ChartGrid({ chart, onSelectPalace, selectedBranch }: Props) {
  // Build 4x4 grid
  const grid: (Palace | null)[][] = Array(4).fill(null).map(() => Array(4).fill(null));

  chart.palaces.forEach(palace => {
    const pos = PALACE_LAYOUT[palace.branch];
    if (pos) {
      grid[pos[0]][pos[1]] = palace;
    }
  });

  // Center info
  const ming = chart.palaces.find(p => p.isMingGong);
  const mingMajors = ming?.stars.filter(s => s.type === 'major').map(s => s.nameVI).join(' · ') ?? '—';
  const dxPalace = chart.palaces.find(p => p.isCurrentDaXian);
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Chart title */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
          {chart.birthInput.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
          {chart.birthInput.day}/{chart.birthInput.month}/{chart.birthInput.year} ·{' '}
          {chart.birthInput.gender === 'female' ? 'Nữ' : 'Nam'} ·{' '}
          {chart.wuxingJuName}
        </div>
      </div>

      {/* 4x4 Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, auto)',
        gap: 4,
      }}>
        {grid.map((row, ri) =>
          row.map((palace, ci) => {
            // Center 2x2 (rows 1-2, cols 1-2)
            if (ri === 1 && ci === 1) {
              return (
                <div
                  key="center"
                  style={{
                    gridColumn: '2 / 4',
                    gridRow: '2 / 4',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 6,
                  }}
                >
                  <div style={{ fontSize: 20, color: 'rgba(212,168,67,0.3)' }}>紫微</div>
                  <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 600 }}>
                    {chart.lunarInfo.yearStemName} {chart.lunarInfo.yearBranchName}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text2)' }}>
                    Mệnh: <span style={{ color: 'var(--gold2)' }}>{mingMajors}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text2)' }}>
                    {currentYear}: {chart.currentAge} tuổi
                  </div>
                  {dxPalace && (
                    <div style={{ fontSize: 9, color: 'var(--faint)', marginTop: 2 }}>
                      ĐH: {dxPalace.daXianAge?.[0]}–{dxPalace.daXianAge?.[1]}
                      <br />{dxPalace.nameVI}
                    </div>
                  )}
                </div>
              );
            }
            if (ri === 1 && ci === 2) return null;
            if (ri === 2 && ci === 1) return null;
            if (ri === 2 && ci === 2) return null;

            if (!palace) return <div key={`${ri}-${ci}`} />;

            return (
              <PalaceCell
                key={palace.branch}
                palace={palace}
                selected={selectedBranch === palace.branch}
                onClick={() => onSelectPalace(palace)}
              />
            );
          })
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, color: 'var(--faint)' }}>
        Nhấn vào cung để xem luận giải chi tiết
      </div>
    </div>
  );
}
