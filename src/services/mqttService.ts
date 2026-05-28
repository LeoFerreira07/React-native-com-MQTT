import mqtt, { MqttClient } from 'mqtt';
import { saveSensorData } from './storage';

export default class MQTTService {
  private client: MqttClient | null = null;

  connect(
    config: {
      host: string;
      port: number;
      path?: string;
      user?: string;
      pass?: string;
      clientId: string;
    },
    onMessage: (topic: string, payload: string) => void,
    onConnect: () => void,
    onFailure: (error: any) => void
  ) {
    const { host, port, path, user, pass, clientId } = config;

    // Converte host/porta para URL WebSocket segura ou normal
    let url = host;
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      const isSecure = port === 8883 || port === 8000 || url.includes('hivemq.cloud');
      const cleanHost = host.replace(/^(http|https|ws|wss):\/\//, '');
      url = `${isSecure ? 'wss' : 'ws'}://${cleanHost}:${port}${path || '/mqtt'}`;
    }

    console.log('[MQTT] Conectando a:', url);

    this.client = mqtt.connect(url, {
      clientId,
      username: user || undefined,
      password: pass || undefined,
      reconnectPeriod: 5000,
      connectTimeout: 10000,
      keepalive: 30,
    });

    this.client.on('connect', () => {
      console.log('[MQTT] Conectado com sucesso');
      onConnect();
    });

    this.client.on('error', (err) => {
      console.warn('[MQTT] Erro de conexao:', err.message);
      onFailure(err);
    });

    this.client.on('message', async (topic, payload) => {
      const msgStr = payload.toString();
      // Executa callback original do app
      onMessage(topic, msgStr);
    });
  }

  subscribe(topic: string) {
    if (this.client?.connected) {
      this.client.subscribe(topic);
      console.log(`[MQTT] Subscrito no topico: ${topic}`);
    }
  }

  publish(topic: string, message: string) {
    if (this.client?.connected) {
      this.client.publish(topic, message);
      console.log(`[MQTT] Publicado no topico ${topic}: ${message}`);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end(true);
      this.client = null;
      console.log('[MQTT] Desconectado');
    }
  }
}
