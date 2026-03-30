import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Socket connected ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket disconnected ', client.id);

  }

}
