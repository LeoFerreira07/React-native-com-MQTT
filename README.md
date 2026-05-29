# PAM Dashboard — Monitoramento de Sensores IoT

Aplicativo React Native (Expo + TypeScript) para monitoramento de sensores em tempo real via MQTT com persistência local de dados.

---

## Arquitetura

### Persistência Local com AsyncStorage

O app usa **AsyncStorage** (`@react-native-async-storage/async-storage`) para armazenar o histórico de leituras dos sensores diretamente no dispositivo.

**Por que AsyncStorage?**
- **Sobrevive ao reload**: os dados persistem entre sessões sem necessidade de servidor.
- **Offline-first**: o histórico é exibido imediatamente ao abrir o app, mesmo sem conexão.
- **Simples e eficiente**: chave/valor assíncrono, ideal para séries temporais pequenas (<1 MB).
- **Nativo**: integrado ao ecossistema Expo/React Native sem configuração extra de servidor.

**Fluxo de dados:**
```
Broker MQTT → mqttService.ts → saveSensorData() → AsyncStorage
                                                   ↓
App.tsx ← getHistory() ← AsyncStorage (na inicialização)
```

A cada nova mensagem recebida pelo broker nos tópicos `casa/temp`, `casa/umid` ou `casa/luz`, o app atualiza seu estado em tempo real e o `saveSensorData()` persiste a leitura no AsyncStorage (cap de 100 entradas).

### Comunicação MQTT

O serviço `src/services/mqttService.ts` implementa a classe `MQTTService` do guia, rodando sobre WebSocket (`ws://broker.hivemq.com:8000/mqtt` ou `wss://`), compatível com React Native/Expo. O Metro bundler shima os módulos `net` e `tls` do Node.js, garantindo um bundle limpo.

---

## Estrutura de Pastas

```
pam/
├── App.tsx                    # Dashboard principal (App.js)
├── metro.config.js            # Shims para compatibilidade mqtt/RN
├── shims/                     # Polyfills mínimos (net, tls)
├── .env.example               # Exemplo de variáveis de ambiente
└── src/
    ├── components/
    │   ├── ConnectionBadge.tsx  # Indicador de status com animação pulsante
    │   ├── StatusModal.tsx      # Feedback visual de falha de conexão
    │   ├── LightControl.tsx     # Botão liga/desliga do LED
    │   ├── Gauges.tsx           # Medidores de Temperatura e Umidade
    │   └── HistoryList.tsx      # Tabela de histórico persistido
    ├── services/
    │   ├── mqttService.ts       # Classe MQTTService do guia
    │   └── storage.ts           # CRUD de persistência no AsyncStorage
    └── styles/
        └── theme.ts             # Tokens de design (cores, espaços, tipografia)
```

---

## Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Copiar arquivo .env
cp .env.example .env

# 3. Executar no navegador (para testes rápidos)
npm run web
```

---

## Guia para o Vídeo Demonstrativo

### Configurando o MQTT Explorer / MQTT.fx

1. **Broker**: `broker.hivemq.com` · Porta: `1883` (TCP) ou `8000` (WS)
2. **Tópicos para publicar/assinar:**
   | Tópico | Uso | Valor de exemplo |
   |--------|-----|-----------------|
   | `casa/temp` | Receber temperatura | `26.8` |
   | `casa/umid` | Receber umidade | `62.0` |
   | `casa/luz` | Controlar LED (GPIO 2) | `1` (Ligado) ou `0` (Desligado) |

### Roteiro de demonstração

1. Abrir o app → histórico inicial é recuperado do AsyncStorage
2. Tap em **Conectar** → status muda para "Conectado"
3. Publicar valor em `casa/temp` ou `casa/umid` pelo MQTT.fx → medidores circulares (Gauges) atualizam instantaneamente
4. Tocar no botão de Lâmpada (LightControl) no aplicativo → o app publica a alteração no tópico `casa/luz` (assista a mudança no console do MQTT.fx)
5. Simular falha de conexão ou trocar credenciais para mostrar o **StatusModal** funcionando
6. Fechar e reabrir o app → histórico ainda presente (**prova de persistência para Menção B**)
7. Tap em **Limpar** no histórico → AsyncStorage zerado e medidores limpos

---

## Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `bg0` | `#0A0E1A` | Fundo profundo |
| `connected` | `#00F5A0` | Neon emerald – broker online |
| `disconnected` | `#E63B60` | Crimson – erro/offline |
| `violet` | `#9B6DFF` | Acento principal |
| `temperature` | `#FF6B6B` | Card temperatura |
| `humidity` | `#48CAE4` | Card umidade |

---

## Critérios Atendidos (Menção B)

- [x] Conexão MQTT em tempo real (WebSocket)
- [x] Persistência local com AsyncStorage (sobrevive ao reload)
- [x] Histórico de leituras com timestamp e badges de status
- [x] Modo de simulação sem broker físico
- [x] Design premium Dark Mode com animações nativas
- [x] Código TypeScript tipado sem erros de compilação
