import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface DashboardChartPoint {
  month: string;
  revenue: number;
  enrollments: number;
  totalStudents: number;
}

export interface AnalyticsTrendPoint {
  period: string;
  revenue: number;
  enrollments: number;
}

export const DashboardCharts: React.FC<{ data: DashboardChartPoint[] }> =
  React.memo(({ data }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Revenue Trends */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Monthly Revenue Trends (₹)
            </h2>
            <p className="text-xs text-slate-500">
              Month-over-month revenue calculated from student payment receipts
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#475569' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#475569' }}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value ?? 0).toLocaleString()}`,
                    'Revenue',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#adminRevGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Student Enrollment Growth */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Student Enrollment Growth
            </h2>
            <p className="text-xs text-slate-500">
              Monthly new enrollments &amp; cumulative student growth from receipts
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#475569' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#475569' }}
                />
                <Tooltip />
                <Bar
                  dataKey="enrollments"
                  name="New Enrollments"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="totalStudents"
                  name="Cumulative Students"
                  fill="#4F46E5"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  });

DashboardCharts.displayName = 'DashboardCharts';

export const AnalyticsTrendChart: React.FC<{ data: AnalyticsTrendPoint[] }> =
  React.memo(({ data }) => {
    if (data.length === 0) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Revenue &amp; Enrollment Trend (Selected Period)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 12, fill: '#475569' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#475569' }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === 'Revenue (₹)'
                    ? `₹${Number(value ?? 0).toLocaleString()}`
                    : value,
                  name,
                ]}
              />
              <Bar
                dataKey="revenue"
                name="Revenue (₹)"
                fill="#059669"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="enrollments"
                name="Enrollments"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  });

AnalyticsTrendChart.displayName = 'AnalyticsTrendChart';
