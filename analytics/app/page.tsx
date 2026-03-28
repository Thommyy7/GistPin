import ExcelExportButton from '@/components/ui/ExcelExportButton';
import ScatterChart from '@/components/charts/ScatterChart';
import RadarChart from '@/components/charts/RadarChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import LocationTable from '@/components/ui/LocationTable';
import LiveGistCounter from '@/components/LiveGistCounter';
import UserAreaChart from '@/components/charts/UserAreaChart';

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: '40px 24px 64px',
      }}
    >
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          background: 'linear-gradient(135deg, #ffffff 0%, #dcfce7 100%)',
          borderRadius: 26,
          padding: '28px 30px',
          boxShadow: '0 18px 46px rgba(15,23,42,0.08)',
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: 999,
              padding: '6px 12px',
              background: '#14532d',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Excel Export
          </div>

          <h1 style={{ margin: '0 0 8px', fontSize: 38, lineHeight: 1.05 }}>
            Analytics Dashboard
          </h1>

          <p style={{ margin: 0, color: '#475569', fontSize: 16, maxWidth: 680 }}>
            Export current analytics into an Excel workbook with dedicated sheets for overview,
            users, locations, and engagement metrics.
          </p>
        </div>

        <ExcelExportButton />
      </section>

      <h2>Live Gists</h2>
      <LiveGistCounter />

      <h2>New vs Returning Users (90 days)</h2>
      <UserAreaChart />

      <h2>Scatter</h2>
      <ScatterChart />

      <h2>Radar</h2>
      <RadarChart />

      <h2>Category Distribution</h2>
      <CategoryPieChart />

      <h2>Locations</h2>
      <LocationTable />
    </main>
  );
}
