import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../styles/theme';

interface Props {
  temp: number | null;
  hum: number | null;
}

export default function Gauges({ temp, hum }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Leitura dos Sensores (DHT11)</Text>
      
      <View style={styles.row}>
        {/* Temperature Gauge */}
        <View style={styles.gaugeContainer}>
          <CircularProgress
            value={temp ?? 0}
            max={50}
            label="°C"
            color={colors.temperature}
            title="Temperatura"
          />
        </View>

        {/* Humidity Gauge */}
        <View style={styles.gaugeContainer}>
          <CircularProgress
            value={hum ?? 0}
            max={100}
            label="%"
            color={colors.humidity}
            title="Umidade"
          />
        </View>
      </View>
    </View>
  );
}

interface CircleProps {
  value: number;
  max: number;
  label: string;
  color: string;
  title: string;
}

function CircularProgress({ value, max, label, color, title }: CircleProps) {
  const radiusCircle = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radiusCircle;
  const clampedValue = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (clampedValue / max) * circumference;

  return (
    <View style={styles.circleWrapper}>
      <Svg width={110} height={110} viewBox="0 0 110 110">
        {/* Background Circle */}
        <Circle
          cx="55"
          cy="55"
          r={radiusCircle}
          stroke="#1F2335"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Active Progress Circle */}
        <Circle
          cx="55"
          cy="55"
          r={radiusCircle}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 55 55)"
        />
      </Svg>
      {/* Inner Text */}
      <View style={styles.textOverlay}>
        <Text style={[styles.valueText, { color }]}>{value.toFixed(1)}</Text>
        <Text style={styles.unitText}>{label}</Text>
      </View>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  gaugeContainer: {
    alignItems: 'center',
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  textOverlay: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  valueText: {
    fontSize: typography.lg,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textMuted,
  },
  titleText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
