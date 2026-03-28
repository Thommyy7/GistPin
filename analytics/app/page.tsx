import dynamic from 'next/dynamic';
import ChartErrorBoundary from '@/components/ui/ChartErrorBoundary';
import ChartSkeleton from '@/components/ui/ChartSkeleton';
import LiveGistCounter from '@/components/LiveGistCounter';

const LazyUserAreaChart = dynamic(() => import('@/components/charts/UserAreaChart'), {
  loading: () => <ChartSkeleton />,
});
const LazyScatterChart = dynamic(() => import('@/components/charts/ScatterChart'), {
  loading: () => <ChartSkeleton />,
});
const LazyRadarChart = dynamic(() => import('@/components/charts/RadarChart'), {
  loading: () => <ChartSkeleton />,
});
const LazyCategoryPieChart = dynamic(() => import('@/components/charts/CategoryPieChart'), {
  loading: () => <ChartSkeleton />,
});
const LazyLocationTable = dynamic(() => import('@/components/ui/LocationTable'), {
  loading: () => <ChartSkeleton />,
});

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
          background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)',
          borderRadius: 26,
          padding: '28px 30px',
          boxShadow: '0 18px 46px rgba(15,23,42,0.08)',
          marginBottom: 28,
        }}
      >
        <h1 style={{ margin: '0 0 10px', fontSize: 38, lineHeight: 1.05 }}>
          Analytics Dashboard
        </h1>
        <p style={{ margin: 0, color: '#475569', fontSize: 16, maxWidth: 720 }}>
          Chart widgets now load lazily with skeleton placeholders and per-widget error
          boundaries to keep the initial dashboard load lighter and more resilient.
        </p>
      </section>

      <h2>Live Gists</h2>
      <LiveGistCounter />

      <h2>New vs Returning Users (90 days)</h2>
      <ChartErrorBoundary title="New vs Returning Users (90 days)">
        <LazyUserAreaChart />
      </ChartErrorBoundary>

      <h2>Scatter</h2>
      <ChartErrorBoundary title="Scatter">
        <LazyScatterChart />
      </ChartErrorBoundary>

      <h2>Radar</h2>
      <ChartErrorBoundary title="Radar">
        <LazyRadarChart />
      </ChartErrorBoundary>

      <h2>Category Distribution</h2>
      <ChartErrorBoundary title="Category Distribution">
        <LazyCategoryPieChart />
      </ChartErrorBoundary>

      <h2>Locations</h2>
      <ChartErrorBoundary title="Locations">
        <LazyLocationTable />
      </ChartErrorBoundary>
    </main>
  );
}
