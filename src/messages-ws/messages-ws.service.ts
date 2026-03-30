import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { User } from '../auth/entities/user.entity';

interface ConnectedClients {
  [id: string]: {
    socket: Socket,
    user: User
  }
}

@Injectable()
export class MessagesWsService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  private connectedClients: ConnectedClients = {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new Error('User not found')
    if (!user.isActive) throw new Error('User not active')
    this.connectedClients[client.id] = {
      socket: client,
      user: user
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getconnectedClients(): string[] {
    return Object.keys(this.connectedClients)
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName
  }

}
