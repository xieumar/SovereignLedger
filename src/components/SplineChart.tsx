import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop, Line } from 'react-native-svg';
import { COLORS, SPACING } from '@/constants';

const { width: SCREEN_W } = Dimensions.get('window');

interface Props {
  data: number[];
  labels: string[];
  color?: string;
  secondData?: number[];
  secondColor?: string;
  height?: number;
}

const smoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
};

export const SplineChart = ({
  data, labels, color = COLORS.chart1,
  secondData, secondColor = COLORS.chart2,
  height = 140,
}: Props) => {
  const chartWidth = SCREEN_W - 64;
  const padX = 12;
  const padY = 16;

  const allValues = [...data, ...(secondData ?? [])];
  const maxVal = Math.max(...allValues, 1);
  const minVal = Math.min(...allValues, 0);
  const range = maxVal - minVal || 1;

  const toPoint = (value: number, index: number, arr: number[]) => ({
    x: padX + (index / (arr.length - 1)) * (chartWidth - padX * 2),
    y: padY + (1 - (value - minVal) / range) * (height - padY * 2),
  });

  const points = useMemo(() => data.map(toPoint), [data, maxVal, minVal]);
  const secondPoints = useMemo(
    () => secondData?.map(toPoint) ?? [],
    [secondData, maxVal, minVal]
  );

  const linePath = smoothPath(points);
  const secondLinePath = smoothPath(secondPoints);

  // Fill path
  const fillPath = linePath
    ? `${linePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`
    : '';

  return (
    <View>
      <Svg width={chartWidth} height={height}>
        <Defs>
          <SvgGradient id="fill1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.3" />
            <Stop offset="1" stopColor={color} stopOpacity="0.0" />
          </SvgGradient>
          <SvgGradient id="fill2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={secondColor} stopOpacity="0.2" />
            <Stop offset="1" stopColor={secondColor} stopOpacity="0.0" />
          </SvgGradient>
        </Defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((f, i) => (
          <Line
            key={i}
            x1={padX} y1={padY + f * (height - padY * 2)}
            x2={chartWidth - padX} y2={padY + f * (height - padY * 2)}
            stroke={COLORS.cardBorder}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Fill area */}
        {fillPath && (
          <Path d={fillPath} fill="url(#fill1)" />
        )}

        {/* Second line fill */}
        {secondLinePath && (
          <Path
            d={`${secondLinePath} L ${secondPoints[secondPoints.length - 1].x} ${height - padY} L ${secondPoints[0].x} ${height - padY} Z`}
            fill="url(#fill2)"
          />
        )}

        {/* Main line */}
        {linePath && (
          <Path d={linePath} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* Second line */}
        {secondLinePath && (
          <Path d={secondLinePath} stroke={secondColor} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="5 3" />
        )}

        {/* Data point dots */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
      </Svg>

      {/* X Labels */}
      <View style={[styles.labelsRow, { width: chartWidth }]}>
        {labels.map((l, i) => (
          <Text key={i} style={styles.labelText}>{l}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 4,
  },
  labelText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
});