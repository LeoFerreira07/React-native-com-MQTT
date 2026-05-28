import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../styles/theme';
import { SensorReading } from '../services/storage';

interface Props {
  history: SensorReading[];
  onClear: () => void;
}

const statusColors: Record<SensorReading['status'], string> = {
  ok:      colors.ok,
  warning: colors.warning,
  error:   colors.error,
};

const topicIcon: Record<string, string> = {
  'pam/temperatura': '🌡',
  'pam/umidade':     '💧',
  'pam/presenca':    '👁',
};

function getIcon(topic: string): string {
  return topicIcon[topic] ?? '📡';
}

function HistoryItem({ item }: { item: SensorReading }) {
  const badgeColor = statusColors[item.status];
  return (
    <View style={styles.item}>
      <Text style={styles.itemIcon}>{getIcon(item.topic)}</Text>
      <View style={styles.itemBody}>
        <Text style={styles.itemTopic}>{item.topic}</Text>
        <Text style={styles.itemTime}>{item.timestamp}</Text>
      </View>
      <View style={[styles.badge, { borderColor: badgeColor }]}>
        <Text style={[styles.badgeText, { color: badgeColor }]}>{item.value}</Text>
      </View>
    </View>
  );
}

export default function HistoryList({ history, onClear }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico Local</Text>
        <View style={styles.headerRight}>
          <Text style={styles.count}>{history.length} leituras</Text>
          {history.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={onClear} activeOpacity={0.7}>
              <Text style={styles.clearText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Nenhuma leitura ainda.</Text>
          <Text style={styles.emptyHint}>Conecte ao broker ou simule um envio.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryItem item={item} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  count: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.disconnected,
  },
  clearText: {
    fontSize: typography.xs,
    color: colors.disconnected,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  itemIcon: {
    fontSize: 18,
    width: 26,
    textAlign: 'center',
  },
  itemBody: {
    flex: 1,
  },
  itemTopic: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  itemTime: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: typography.xs,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 26 + spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.xs,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
});
