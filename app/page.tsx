'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BirthForm from '@/components/BirthForm';
import type { BirthInput } from '@/lib/ziwei/types';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (input: BirthInput) => {
    setLoading(true);
    const params = new URLSearchParams({
      name:   input.name,
      day:    String(input.day),
      month:  String(input.month),
      year:   String(input.year),
      hour:   String(input.hour),
      gender: input.gender,
    });
    router.push(`/chart?${params.toString()}`);
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'var(--bg)',
    }}>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            fontSize: 38,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #d4a843 0%, #f0c96e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 10,
            letterSpacing: '-0.02em',
          }}>
            紫微 · Tử Vi AI
          </div>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
            Luận giải lá số Tử Vi Đẩu Số theo hệ thống<br />
            <span style={{ color: 'var(--gold)', fontWeight: 500 }}>Nghê Hải Hà (倪海夏)</span>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {['12 Cung', 'Tứ Hóa', 'Đại Hạn', 'Lưu Niên', 'AI Luận Giải'].map(tag => (
              <span key={tag} style={{
                fontSize: 10,
                color: 'var(--faint)',
                background: 'rgba(212,168,67,0.05)',
                border: '1px solid rgba(212,168,67,0.15)',
                borderRadius: 20,
                padding: '3px 10px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="card-glass" style={{ padding: 28 }}>
          <h2 style={{
            fontSize: 11,
            color: 'var(--gold)',
            marginBottom: 22,
            letterSpacing: '0.1em',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            ✦ Nhập thông tin sinh
          </h2>
          <BirthForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--faint)', marginTop: 20, lineHeight: 1.7 }}>
          Phân tích bởi Claude AI · Tử Vi Đẩu Số là công cụ tham khảo<br />
          Theo Nghê Sư: &quot;Nhân lực lớn hơn Thiên mệnh&quot;
        </p>
      </div>
    </main>
  );
}
