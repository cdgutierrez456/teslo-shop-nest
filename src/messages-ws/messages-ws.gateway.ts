import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    console.log(token);

    this.messagesWsService.registerClient(client)
    this.wss.emit('clients-updated', this.messagesWsService.getconnectedClients())
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getconnectedClients())
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    // Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!!'
    // })

    // Emitir a todos menos, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Solo a los demas',
    //   message: payload.message || 'no-message!!!'
    // })

    this.wss.emit('message-from-server', {
      fullName: 'Otro yo',
      message: payload.message || 'no-message!!!'
    })
  }

}
