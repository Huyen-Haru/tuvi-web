'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChartGrid from '@/components/ChartGrid';
import AnalysisPanel from '@/components/AnalysisPanel';
import { generateChart } from '@/lib/ziwei/engine';
import type { ZiweiChart, Palace, BirthInput } from '@/lib/ziwei/types';

function ChartPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [error, setError] = useState('');
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);

  useEffect(() => {
    try {
      const name   = params.get('name') ?? '';
      const day    = parseInt(params.get('day') ?? '0');
      const month  = parseInt(params.get('month') ?? '0');
      const year   = parseInt(params.get('year') ?? '0');
      const hour   = parseInt(params.get('hour') ?? '4');
      const gender = (params.get('gender') ?? 'female') as 'female' | 'male';

      if (!name || !day || !month || !year) {
        setError('Thiếu thông tin. Vui lòng quay lại và nhập đầy đủ.');
        return;
      }

      const input: BirthInput = { name, day, month, year, hour, gender };
      const result = generateChart(input);
      setChart(result);
    } catch (e) {
      console.error(e);
      setError('Không thể tính lá số. Vui lòng kiểm tra lại thông tin.');
    }
  }, [params]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 16,
      }}>
        <div style={{ fontSize: 32, color: 'var(--red)', opacity: 0.4 }}>⚠</div>
        <p style={{ color: 'var(--red)', fontSize: 14 }}>{error}</p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 24px', borderRadius: 8, fontSize: 13,
            background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)',
            color: 'var(--gold)', cursor: 'pointer',
          }}
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  if (!chart) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 12,
      }}>
        <div style={{ fontSize: 28, color: 'var(--gold)', opacity: 0.2 }}>紫微</div>
        <p style={{ color: 'var(--faint)', fontSize: 13 }}>Đang tính lá số...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'transparent', border: 'none', color: 'var(--faint)',
            cursor: 'pointer', fontSize: 13, padding: '4px 0',
          }}
        >
          ← Tra cứu lại
        </button>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>
          紫微 · Tử Vi AI
        </div>
        <div style={{ fontSize: 11, color: 'var(--faint)' }}>
          {chart.birthInput.name}
        </div>
      </div>

      {/* Main layout: left = chart, right = analysis */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
        gap: 0,
        overflow: 'hidden',
      }}>
        {/* Left: ChartGrid */}
        <div style={{
          padding: '16px 12px 16px 16px',
          overflowY: 'auto',
          borderRight: '1px solid var(--border)',
        }}>
          <ChartGrid
            chart={chart}
            onSelectPalace={setSelectedPalace}
            selectedBranch={selectedPalace?.branch}
          />
        </div>

        {/* Right: AnalysisPanel */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <AnalysisPanel chart={chart} selectedPalace={selectedPalace} />
        </div>
      </div>
    </div>
  );
}

export default function ChartPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
      }}>
        <p style={{ color: 'var(--faint)', fontSize: 13 }}>Đang tải...</p>
      </div>
    }>
      <ChartPageInner />
    </Suspense>
  );
}
