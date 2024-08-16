import { Client } from '@stomp/stompjs';
import sockjs from "sockjs-client/dist/sockjs"

// Khởi tạo biến client để quản lý kết nối WebSocket
let client = null;

// Hàm khởi động WebSocket
const startWebSocket = (onMessage) => {
  client = new Client({
    brokerURL: 'http://localhost:8080/api/ws', // Thay đổi URL nếu cần
    connectHeaders: {
      // Thêm bất kỳ header nếu cần
    },
    debug: function (str) {
      console.log('%cDebug:', 'color: green;', str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    webSocketFactory: () => new sockjs('http://localhost:8080/api/ws'), // Thay đổi URL nếu cần
    onConnect: (frame) => {
      client.subscribe('/topic/payment-status', (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    },
    onStompError: (frame) => {
      console.error(frame);
    }
  });

  client.activate();
};

export default startWebSocket;