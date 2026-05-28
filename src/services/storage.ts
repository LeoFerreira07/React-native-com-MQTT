import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SensorReading {
  id: string;
  timestamp: string;
  topic: string;
  value: string;
  status: 'ok' | 'warning' | 'error';
}

const STORAGE_KEY = '@pam:sensor_history';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function inferStatus(value: string): SensorReading['status'] {
  const num = parseFloat(value);
  if (isNaN(num)) return 'ok';
  if (num > 90 || num < -10) return 'error';
  if (num > 75 || num < 0) return 'warning';
  return 'ok';
}

export async function saveSensorData(topic: string, value: string): Promise<SensorReading> {
  const reading: SensorReading = {
    id: generateId(),
    timestamp: formatTimestamp(new Date()),
    topic,
    value,
    status: inferStatus(value),
  };

  const history = await getHistory();
  const updated = [reading, ...history].slice(0, 100); // cap at 100 entries
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return reading;
}

export async function getHistory(): Promise<SensorReading[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SensorReading[];
  } catch {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
