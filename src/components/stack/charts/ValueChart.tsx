import { useState, useId, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { type ChartDataPoint, type ChartSummary, type TimeRange } from '@/data/chart-data';

interface ValueChartProps {
  data: ChartDataPoint[];
  summary: ChartSummary;
  label: string;
  valuePrefix?: string;
  valueSuffix?: string;
  timeRanges?: TimeRange[];
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  compact?: boolean;
  height?: number;
  className?: string;
}

// Vertical crosshair cursor
const CustomCursor = ({ points, height }: any) => {
  if (!points?.[0]) return null;
  return (
    <line
      x1={points[0].x} y1={0}
      x2={points[0].x} y2={height}
      stroke="hsl(var(--muted-foreground))"
      strokeWidth={1}
      strokeDasharray="4 4"
      opacity={0.4}
    />
  );
};

const ValueChart = ({
  data,
  summary,
  label,
  valuePrefix = '',
  valueSuffix = '',
  timeRanges = ['1W', '1M', '3M', '6M', '1Y'],
  selectedRange,
  onRangeChange,
  compact = false,
  height,
  className = '',
}: ValueChartProps) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const chartId = useId().replace(/:/g, '');

  const displayValue = hoveredValue ?? summary.currentValue;
  const isPositive = summary.direction === 'up';
  const isNegative = summary.direction === 'down';

  const lineColor = isNegative
    ? 'hsl(var(--destructive))'
    : 'hsl(var(--success))';

  const chartHeight = height ?? (compact ? 120 : 180);

  const formatValue = (v: number) =>
    `${valuePrefix}${v.toLocaleString()}${valueSuffix}`;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const handleMouseMove = useCallback((state: any) => {
    if (state?.activePayload?.[0]) {
      const p = state.activePayload[0].payload as ChartDataPoint;
      setHoveredValue(p.value);
      setHoveredDate(p.date);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredValue(null);
    setHoveredDate(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {/* Value Header */}
      <div className={compact ? 'mb-2' : 'mb-3'}>
        <div className="flex items-baseline gap-2">
          <span className={`font-bold text-foreground ${compact ? 'text-xl' : 'text-2xl'}`}>
            {formatValue(displayValue)}
          </span>
          {hoveredDate && (
            <span className="text-xs text-muted-foreground">
              {formatDate(hoveredDate)}
            </span>
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-1.5 mt-0.5">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            ) : isNegative ? (
              <TrendingDown className="w-3.5 h-3.5 text-destructive" />
            ) : null}
            <span className={`text-sm font-medium ${
              isPositive ? 'text-success' : isNegative ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {summary.changeAmount >= 0 ? '+' : ''}{formatValue(summary.changeAmount)}
              {' '}
              ({summary.changePercent >= 0 ? '+' : ''}{summary.changePercent}%)
            </span>
            {!hoveredDate && (
              <span className="text-xs text-muted-foreground">{label}</span>
            )}
          </div>
        )}
        {compact && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 text-success" />
            ) : isNegative ? (
              <TrendingDown className="w-3 h-3 text-destructive" />
            ) : null}
            <span className={`text-xs font-medium ${
              isPositive ? 'text-success' : isNegative ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {summary.changePercent >= 0 ? '+' : ''}{summary.changePercent}%
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height: chartHeight, touchAction: 'pan-y' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id={`grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <ReferenceLine
              y={summary.previousValue}
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <Tooltip
              content={() => null}
              cursor={<CustomCursor />}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#grad-${chartId})`}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: 'hsl(var(--background))',
                fill: lineColor,
              }}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time Range Selector */}
      {!compact && (
        <div className="flex gap-1 p-1 bg-secondary rounded-xl mt-3">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              className={`relative flex-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedRange === range
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {selectedRange === range && (
                <motion.div
                  layoutId={`range-pill-${chartId}`}
                  className="absolute inset-0 bg-primary rounded-lg"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{range}</span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ValueChart;
