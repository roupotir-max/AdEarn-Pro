import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import {
  DAILY_MAX_ADS,
  DailyEarningsHistoryMap,
  REWARD_PER_AD,
} from '../types';

interface EarningsChartProps {
  history: DailyEarningsHistoryMap;
  todayCount: number;
}

interface ChartPoint {
  dateKey: string;
  label: string;
  fullDate: string;
  earnings: number;
  ads: number;
  isToday: boolean;
}

export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatShortBnDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('bn-BD', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  } catch {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }
}

function formatFullBnDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

export const EarningsChart: React.FC<EarningsChartProps> = ({
  history,
  todayCount,
}) => {
  const [rangeDays, setRangeDays] = useState<7 | 14>(7);

  const chartData = useMemo<ChartPoint[]>(() => {
    const today = new Date();
    const todayKey = toLocalDateKey(today);
    const points: ChartPoint[] = [];

    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toLocalDateKey(d);
      const isToday = key === todayKey;
      const stored = history[key];

      const ads = isToday
        ? Math.max(todayCount, stored?.ads ?? 0)
        : stored?.ads ?? 0;
      const earnings = isToday
        ? Math.max(todayCount * REWARD_PER_AD, stored?.earnings ?? 0)
        : stored?.earnings ?? 0;

      points.push({
        dateKey: key,
        label: isToday ? 'আজ' : formatShortBnDate(d),
        fullDate: formatFullBnDate(d),
        earnings,
        ads,
        isToday,
      });
    }

    return points;
  }, [history, rangeDays, todayCount]);

  const totalPeriodEarnings = useMemo(
    () => chartData.reduce((sum, item) => sum + item.earnings, 0),
    [chartData]
  );

  const todayEarnings = chartData[chartData.length - 1]?.earnings ?? 0;
  const maxDailyGoal = DAILY_MAX_ADS * REWARD_PER_AD;

  return (
    <section className="bg-[#131c31] rounded-2xl border border-white/10 p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
            <h3 className="text-base font-bold text-white">
              দৈনিক আয়ের হিসাব
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 tabular-nums">
            আজকের আয়:{' '}
            <span className="font-semibold text-emerald-400">
              ৳{todayEarnings}
            </span>
            <span className="mx-1.5 text-slate-600" aria-hidden="true">
              ·
            </span>
            গত {rangeDays === 7 ? '৭' : '১৪'} দিন:{' '}
            <span className="font-semibold text-slate-200">
              ৳{totalPeriodEarnings}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-white/5 shrink-0">
          <button
            type="button"
            onClick={() => setRangeDays(7)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              rangeDays === 7
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ৭ দিন
          </button>
          <button
            type="button"
            onClick={() => setRangeDays(14)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              rangeDays === 14
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ১৪ দিন
          </button>
        </div>
      </div>

      <div className="w-full h-[200px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.08)"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={rangeDays === 14 ? 1 : 0}
            />
            <YAxis
              width={48}
              domain={[0, (dataMax: number) => Math.max(dataMax, 50)]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val: number) => `৳${val}`}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const point = payload[0].payload as ChartPoint;
                return (
                  <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl border border-white/15 text-xs">
                    <p className="font-semibold text-slate-200 mb-1">
                      {point.isToday ? `আজ (${point.fullDate})` : point.fullDate}
                    </p>
                    <p className="text-amber-400 font-bold tabular-nums">
                      আয়: ৳{point.earnings}
                    </p>
                    <p className="text-slate-300 tabular-nums mt-0.5">
                      দেখা হয়েছে: {point.ads}টি অ্যাড
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="earnings" radius={[6, 6, 0, 0]} maxBarSize={32}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.dateKey}
                  fill={entry.isToday ? '#3b82f6' : '#10b981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 tabular-nums">
        <span>দৈনিক সর্বোচ্চ আয় সুযোগ: ৳{maxDailyGoal}</span>
        <span>প্রতি অ্যাড: ৳{REWARD_PER_AD}</span>
      </div>
    </section>
  );
};
