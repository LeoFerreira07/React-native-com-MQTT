import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../styles/theme';
import { ConnectionStatus } from '../services/mqttService';

interface Props {
  status: ConnectionStatus;
  brokerUrl?: string;
}

const statusConfig: Record<ConnectionStatus, { label: string; color: string }> = {
  connected:    { label: 'Conectado',     color: colors.connected },
  connecting:   { label: 'Conectando...', color: colors.connecting },
  disconnected: { label: 'Desconectado',  color: colors.disconnected },
  error:        { label: 'Erro',          color: colors.disconnected },
};

export default function ConnectionBadge({ status, brokerUrl }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const cfg = statusConfig[status];

  useEffect(() => {
    if (status === 'connecting') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,   duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [status]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { backgroundColor: cfg.color, opacity: pulse }]} />
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
        {brokerUrl ? (
          <Text style={styles.url} numberOfLines={1}>{brokerUrl}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  textBlock: {
    flexShrink: 1,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  url: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
});
