'use client';

import { useState } from 'react';

interface LocationRow {
  location: string;
  country: string;
  gists: number;
  engagement: number;
}

const locations: LocationRow[] = [
  { location: 'Lagos', country: 'Nigeria', gists: 1420, engagement: 87 },
  { location: 'Abuja', country: 'Nigeria', gists: 980, engagement: 74 },
  { location: 'Nairobi', country: 'Kenya', gists: 860, engagement: 81 },
  { location: 'Accra', country: 'Ghana', gists: 740, engagement: 69 },
  { location: 'Kano', country: 'Nigeria', gists: 630, engagement: 62 },
  { location: 'Cape Town', country: 'South Africa', gists: 590, engagement: 78 },
  { location: 'Ibadan', country: 'Nigeria', gists: 510, engagement: 55 },
  { location: 'Dar es Salaam', country: 'Tanzania', gists: 470, engagement: 66 },
];

type SortKey = keyof LocationRow;
type SortDir = 'asc' | 'desc';

export default function TopLocationsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('gists');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...locations].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function arrow(key: SortKey) {
    if (key !== sortKey) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
            {(['location', 'country', 'gists', 'engagement'] as SortKey[]).map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{ padding: '10px 12px', textAlign: 'left', cursor: 'pointer', color: '#6b7280', userSelect: 'none' }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {arrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.location} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.location}</td>
              <td style={{ padding: '10px 12px', color: '#6b7280' }}>{row.country}</td>
              <td style={{ padding: '10px 12px' }}>{row.gists.toLocaleString()}</td>
              <td style={{ padding: '10px 12px' }}>{row.engagement}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
