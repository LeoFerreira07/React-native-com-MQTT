import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../styles/theme';

interface Props {
  isLighton: boolean;
  onToggle: () => void;
}

export default function LightControl({ isLighton, onToggle }: Props) {
  const glowAnim = useRef(new Animated.Value(isLighton ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(glowAnim, {
      toValue: isLighton ? 1 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [isLighton]);

  // Interpolate glow colors
  const cardBorder = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, '#F1C40F'],
  });

  const bulbColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3A3E4D', '#F1C40F'],
  });

  const haloGlow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(241, 196, 15, 0)', 'rgba(241, 196, 15, 0.15)'],
  });

  return (
    <Animated.View style={[styles.card, { borderColor: cardBorder, backgroundColor: colors.bg1 }]}>
      <Text style={styles.cardTitle}>Controle do LED (GPIO 2)</Text>
      
      <Animated.View style={[styles.halo, { backgroundColor: haloGlow }]}>
        <TouchableOpacity style={styles.button} onPress={onToggle} activeOpacity={0.85}>
          <Svg width={120} height={120} viewBox="0 0 24 24" fill="none">
            {/* Base/Thread support */}
            <Path
              d="M9 18h6M10 21h4"
              stroke="#8A8F9E"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Glow / Ray indicators if light is on */}
            {isLighton && (
              <>
                <Path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M19.07 4.93l-1.41 1.41M20 12h2" stroke="#F1C40F" strokeWidth={1.5} strokeLinecap="round" />
              </>
            )}
            {/* Bulb body */}
            <AnimatedPath
              d="M12 2a7 7 0 00-7 7c0 2.22 1.2 3.82 2.22 5.03.62.74.78 1.97.78 2.97h8c0-1 .16-2.23.78-2.97C17.8 12.82 19 11.22 19 9a7 7 0 00-7-7z"
              fill={bulbColor}
              stroke={isLighton ? '#F1C40F' : '#8A8F9E'}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </Animated.View>

      <Text style={[styles.statusText, { color: isLighton ? '#F1C40F' : colors.textMuted }]}>
        {isLighton ? 'LIGADO' : 'DESLIGADO'}
      </Text>
    </Animated.View>
  );
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 240,
    ...shadow.card,
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
    marginBottom: spacing.md,
  },
  halo: {
    padding: spacing.md,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  button: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: typography.md,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: spacing.xs,
  },
});
