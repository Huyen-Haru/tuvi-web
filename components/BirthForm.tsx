'use client';
import { useState } from 'react';
import type { BirthInput } from '@/lib/ziwei/types';

interface Props {
  onSubmit: (input: BirthInput) => void;
  loading?: boolean;
}

const HOUR_OPTIONS = [
  { value: 0,  label: 'Giờ Tý  — 23:00 đến 01:00' },
  { value: 1,  label: 'Giờ Sửu — 01:00 đến 03:00' },
  { value: 2,  label: 'Giờ Dần — 03:00 đến 05:00' },
  { value: 3,  label: 'Giờ Mão — 05:00 đến 07:00' },
  { value: 4,  label: 'Giờ Thìn — 07:00 đến 09:00' },
  { value: 5,  label: 'Giờ Tỵ  — 09:00 đến 11:00' },
  { value: 6,  label: 'Giờ Ngọ — 11:00 đến 13:00' },
  { value: 7,  label: 'Giờ Mùi — 13:00 đến 15:00' },
  { value: 8,  label: 'Giờ Thân — 15:00 đến 17:00' },
  { value: 9,  label: 'Giờ Dậu — 17:00 đến 19:00' },
  { value: 10, label: 'Giờ Tuất — 19:00 đến 21:00' },
  { value: 11, label: 'Giờ Hợi — 21:00 đến 23:00' },
];

// Map actual clock time to địa chi giờ
function clockToHourBranch(h: number, m: number): number {
  const total = h * 60 + m;
  if (total >= 23 * 60 || total < 1 * 60) return 0;  // Tý
  if (total < 3 * 60) return 1;   // Sửu
  if (total < 5 * 60) return 2;   // Dần
  if (total < 7 * 60) return 3;   // Mão
  if (total < 9 * 60) return 4;   // Thìn
  if (total < 11 * 60) return 5;  // Tỵ
  if (total < 13 * 60) return 6;  // Ngọ
  if (total < 15 * 60) return 7;  // Mùi
  if (total < 17 * 60) return 8;  // Thân
  if (total < 19 * 60) return 9;  // Dậu
  if (total < 21 * 60) return 10; // Tuất
  return 11; // Hợi
}

export default function BirthForm({ onSubmit, loading }: Props) {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [clockH, setClockH] = useState('');
  const [clockM, setClockM] = useState('');
  const [hourMode, setHourMode] = useState<'clock' | 'branch'>('clock');
  const [hourBranch, setHourBranch] = useState(4); // Thìn mặc định
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const d = parseInt(day), m = parseInt(month), y = parseInt(year);
    if (!name.trim()) return setError('Vui lòng nhập họ tên.');
    if (!d || d < 1 || d > 31) return setError('Ngày không hợp lệ (1–31).');
    if (!m || m < 1 || m > 12) return setError('Tháng không hợp lệ (1–12).');
    if (!y || y < 1900 || y > 2010) return setError('Năm không hợp lệ (1900–2010).');

    let finalHour = hourBranch;
    if (hourMode === 'clock') {
      const h = parseInt(clockH), min = parseInt(clockM || '0');
      if (isNaN(h) || h < 0 || h > 23) return setError('Giờ không hợp lệ (0–23).');
      finalHour = clockToHourBranch(h, min);
    }

    onSubmit({ name: name.trim(), day: d, month: m, year: y, hour: finalHour, gender });
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--card2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text)',
    padding: '10px 14px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: 'var(--text2)',
    letterSpacing: '0.05em',
    marginBottom: 4,
    display: 'block',
    textTransform: 'uppercase',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Họ tên */}
      <div>
        <label style={labelStyle}>Họ và tên</label>
        <input
          type="text"
          placeholder="Nguyễn Văn A"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--border2)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Ngày tháng năm */}
      <div>
        <label style={labelStyle}>Ngày / Tháng / Năm sinh (Dương lịch)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 8 }}>
          <input type="number" placeholder="Ngày" min={1} max={31} value={day}
            onChange={e => setDay(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--border2)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <input type="number" placeholder="Tháng" min={1} max={12} value={month}
            onChange={e => setMonth(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--border2)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <input type="number" placeholder="Năm (vd: 1990)" min={1900} max={2010} value={year}
            onChange={e => setYear(e.target.value)} style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--border2)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Giờ sinh */}
      <div>
        <label style={labelStyle}>Giờ sinh</label>
        {/* Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {(['clock', 'branch'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setHourMode(mode)}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                fontSize: 12,
                cursor: 'pointer',
                border: `1px solid ${hourMode === mode ? 'var(--border2)' : 'var(--border)'}`,
                background: hourMode === mode ? 'rgba(212,168,67,0.1)' : 'transparent',
                color: hourMode === mode ? 'var(--gold)' : 'var(--faint)',
              }}
            >
              {mode === 'clock' ? 'Nhập giờ thực' : 'Chọn địa chi giờ'}
            </button>
          ))}
        </div>

        {hourMode === 'clock' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input type="number" placeholder="Giờ (0–23)" min={0} max={23} value={clockH}
              onChange={e => setClockH(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--border2)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <input type="number" placeholder="Phút (0–59)" min={0} max={59} value={clockM}
              onChange={e => setClockM(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--border2)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        ) : (
          <select value={hourBranch} onChange={e => setHourBranch(Number(e.target.value))}
            style={{ ...inputStyle, cursor: 'pointer' }}>
            {HOUR_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
        <p style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>
          Nếu không nhớ chính xác, hãy chọn giờ địa chi gần nhất.
        </p>
      </div>

      {/* Giới tính */}
      <div>
        <label style={labelStyle}>Giới tính</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['female', 'male'] as const).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
                border: `1px solid ${gender === g ? 'var(--border2)' : 'var(--border)'}`,
                background: gender === g ? 'rgba(212,168,67,0.12)' : 'transparent',
                color: gender === g ? 'var(--gold)' : 'var(--text2)',
                fontWeight: gender === g ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {g === 'female' ? '♀ Nữ' : '♂ Nam'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--red)', fontSize: 13, textAlign: 'center' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '14px',
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          background: 'linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(240,201,110,0.15) 100%)',
          border: '1px solid var(--border2)',
          color: 'var(--gold2)',
          letterSpacing: '0.05em',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = 'rgba(212,168,67,0.25)'; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.background = 'linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(240,201,110,0.15) 100%)'; }}
      >
        {loading ? '⌛ Đang tính lá số...' : '✦ Xem Lá Số Tử Vi'}
      </button>
    </form>
  );
}
