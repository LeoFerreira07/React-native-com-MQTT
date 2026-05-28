import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '../styles/theme';

interface Props {
  visible: boolean;
  onRetry: () => void;
  onLater: () => void;
}

export default function StatusModal({ visible, onRetry, onLater }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
          </View>
          
          <Text style={styles.title}>Falha na Conexão</Text>
          <Text style={styles.modalText}>
            Não foi possível conectar ao Broker MQTT. Verifique as credenciais ou sua conexão.
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, styles.btnLater]} onPress={onLater} activeOpacity={0.75}>
              <Text style={styles.btnLaterText}>Depois</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btn, styles.btnRetry]} onPress={onRetry} activeOpacity={0.75}>
              <Text style={styles.btnText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 26, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.bg1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.disconnected + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.disconnected,
  },
  warningIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.2,
  },
  modalText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLater: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btnLaterText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textMuted,
  },
  btnRetry: {
    backgroundColor: colors.violet,
    borderWidth: 1.5,
    borderColor: colors.violet,
  },
  btnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
