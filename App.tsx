import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConnectionBadge from './src/components/ConnectionBadge';
import Gauges from './src/components/Gauges';
import HistoryList from './src/components/HistoryList';
import LightControl from './src/components/LightControl';
import StatusModal from './src/components/StatusModal';
import MQTTService, { ConnectionStatus } from './src/services/mqttService';
import { clearHistory, getHistory, saveSensorData, SensorReading } from './src/services/storage';
import { colors, radius, shadow, spacing, typography } from './src/styles/theme';

// Configurações padrão com fallback (segurança recomendada com .env)
const MQTT_HOST = process.env.EXPO_PUBLIC_MQTT_HOST || 'broker.hivemq.com';
const MQTT_PORT = parseInt(process.env.EXPO_PUBLIC_MQTT_PORT || '8000');
const MQTT_PATH = process.env.EXPO_PUBLIC_MQTT_PATH || '/mqtt';
const MQTT_USER = process.env.EXPO_PUBLIC_MQTT_USER || '';
const MQTT_PASS = process.env.EXPO_PUBLIC_MQTT_PASS || '';

const TOPICS = {
  temp: 'casa/temp',
  umid: 'casa/umid',
  luz: 'casa/luz',
};

const MOCK_TEMP_VALS = [24.5, 26.2, 28.0, 22.8, 19.5, 25.1];
const MOCK_UMID_VALS = [65.0, 72.1, 80.4, 58.9, 44.2, 60.5];

export default function App() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [temp, setTemp] = useState<number | null>(null);
  const [hum, setHum] = useState<number | null>(null);
  const [isLighton, setIsLighton] = useState(false);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const mqttServiceRef = useRef<MQTTService | null>(null);
  const mockIndexRef = useRef(0);

  // Carrega o histórico salvo no AsyncStorage na inicialização
  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  // Callback de recebimento de mensagens MQTT
  const handleMessage = useCallback(async (topic: string, message: string) => {
    const value = message.trim();
    
    // Atualiza estados locais conforme o guia da atividade
    if (topic === TOPICS.temp) {
      setTemp(parseFloat(value));
    } else if (topic === TOPICS.umid) {
      setHum(parseFloat(value));
    } else if (topic === TOPICS.luz) {
      setIsLighton(value === '1');
    }

    // Persistência local (Desafio da atividade - garante Menção B)
    const reading = await saveSensorData(topic, value);
    setHistory((prev) => [reading, ...prev].slice(0, 100));
  }, []);

  // Inicia conexão MQTT
  const startConnection = useCallback(() => {
    setStatus('connecting');
    setModalVisible(false);

    if (!mqttServiceRef.current) {
      mqttServiceRef.current = new MQTTService();
    }

    const config = {
      host: MQTT_HOST,
      port: MQTT_PORT,
      path: MQTT_PATH,
      user: MQTT_USER,
      pass: MQTT_PASS,
      clientId: 'RN_App_' + Math.random().toString(36).substring(2, 10),
    };

    mqttServiceRef.current.connect(
      config,
      handleMessage,
      () => {
        setStatus('connected');
        // Assina todos os tópicos requeridos no guia
        mqttServiceRef.current?.subscribe(TOPICS.temp);
        mqttServiceRef.current?.subscribe(TOPICS.umid);
        mqttServiceRef.current?.subscribe(TOPICS.luz);
      },
      (err) => {
        setStatus('error');
        setModalVisible(true); // Exibe StatusModal de erro em caso de falha
      }
    );
  }, [handleMessage]);

  // Alterna o estado da luz (publica 1 ou 0)
  const toggleLight = useCallback(() => {
    const nextState = !isLighton ? '1' : '0';
    setIsLighton(!isLighton);
    
    if (status === 'connected') {
      mqttServiceRef.current?.publish(TOPICS.luz, nextState);
    } else {
      // Se estiver offline, simula localmente
      handleMessage(TOPICS.luz, nextState);
    }
  }, [isLighton, status, handleMessage]);

  const handleDisconnect = useCallback(() => {
    mqttServiceRef.current?.disconnect();
    setStatus('disconnected');
  }, []);

  // Simulação de dados para testar localmente (essencial para o vídeo demonstrativo)
  const handleSimulate = useCallback(async () => {
    const idx = mockIndexRef.current;
    mockIndexRef.current = (idx + 1) % MOCK_TEMP_VALS.length;

    const simTemp = MOCK_TEMP_VALS[idx].toString();
    const simUmid = MOCK_UMID_VALS[idx].toString();

    await handleMessage(TOPICS.temp, simTemp);
    await handleMessage(TOPICS.umid, simUmid);
  }, [handleMessage]);

  const handleClearHistory = useCallback(async () => {
    if (Platform.OS === 'web') {
      await clearHistory();
      setHistory([]);
      setTemp(null);
      setHum(null);
      return;
    }
    Alert.alert(
      'Limpar Histórico',
      'Deseja apagar permanentemente todas as leituras salvas no AsyncStorage?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setHistory([]);
            setTemp(null);
            setHum(null);
          },
        },
      ]
    );
  }, []);

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg0} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Casa Inteligente</Text>
          <ConnectionBadge status={status} brokerUrl={`${MQTT_HOST}:${MQTT_PORT}`} />
        </View>
        
        <TouchableOpacity
          style={[
            styles.connectBtn,
            isConnected && styles.connectBtnActive,
            isConnecting && styles.connectBtnConnecting,
          ]}
          onPress={isConnected ? handleDisconnect : startConnection}
          activeOpacity={0.75}
        >
          <Text style={styles.connectBtnText}>
            {isConnected ? 'Desconectar' : isConnecting ? 'Conectando...' : 'Conectar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sensores Gauges */}
        <Gauges temp={temp} hum={hum} />

        {/* Light Bulb Toggle */}
        <LightControl isLighton={isLighton} onToggle={toggleLight} />

        {/* Botão de Simulação rápida */}
        <TouchableOpacity style={styles.simulateBtn} onPress={handleSimulate} activeOpacity={0.75}>
          <Text style={styles.simulateBtnText}>⚡  Simular Sensores (DHT11)</Text>
        </TouchableOpacity>

        {/* Histórico Persistido Localmente (AsyncStorage) */}
        <Text style={styles.sectionLabel}>Persistência do Histórico (AsyncStorage)</Text>
        <HistoryList history={history} onClear={handleClearHistory} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Etec Bento Quirino · IoT & Mobile Development</Text>
        </View>
      </ScrollView>

      {/* Modal de Feedback de Erros */}
      <StatusModal
        visible={modalVisible}
        onRetry={startConnection}
        onLater={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg1,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  connectBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.violet,
    backgroundColor: colors.violet + '22',
  },
  connectBtnActive: {
    borderColor: colors.disconnected,
    backgroundColor: colors.disconnected + '22',
  },
  connectBtnConnecting: {
    borderColor: colors.connecting,
    backgroundColor: colors.connecting + '22',
  },
  connectBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  simulateBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    backgroundColor: colors.violet + '15',
    borderWidth: 1.5,
    borderColor: colors.violet,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  simulateBtnText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.violet,
    letterSpacing: 0.4,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.xs,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
});
