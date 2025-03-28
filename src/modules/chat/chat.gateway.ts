import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../auth/dto/JWT.consts';
import { validateOrReject } from 'class-validator';
import { IsString, Length } from 'class-validator';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notification/notification.service';

// DTO con validación
class MessagePayload {
  @IsString()
  @Length(1, 500)
  message: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users = new Map<
    string,
    { userId: string; username: string; online: boolean }
  >();

  constructor(
    private readonly messagesService: MessageService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
  ) {}
  async handleConnection(client: Socket) {
    const user = this.authenticateUser(client); // Valida y obtiene el usuario conectado
    this.users.set(client.id, {
      userId: user.userId,
      username: user.username,
      online: true,
    });

    // Lista completa de usuarios con estado actualizado
    const allUsers = await this.usersService.findAll(); // Obtiene todos los usuarios del sistema
    const connectedUsers = Array.from(this.users.values());
    allUsers.forEach((user) => {
      user.online = connectedUsers.some(
        (connectedUser) => connectedUser.userId === user.userId,
      );
    });

    // Emitir lista actualizada al cliente
    this.server.emit('users', allUsers);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MessagePayload,
  ) {
    const user = this.users.get(client.id);
    if (!user) return;

    try {
      // Validar entrada del mensaje
      await validateOrReject(payload);
      const savedMessage = await this.messagesService.createMessage(
        user.username,
        payload.message,
      );

      const messageData = {
        id: savedMessage.id,
        sender: user.username,
        message: savedMessage.message,
        timestamp: savedMessage.timestamp || new Date().toISOString(),
      };

      console.log(`📩 Nuevo mensaje: ${JSON.stringify(messageData)}`);
      this.server.emit('message', messageData);
    } catch (error) {
      console.error('❌ Error al procesar el mensaje:', error.message);
      client.emit('error', { message: 'Mensaje inválido' });
    }
  }

  async handleDisconnect(client: Socket) {
    const user = this.users.get(client.id); // Obtén el usuario asociado al cliente
    if (user) {
      console.log(`🔴 Usuario desconectado: ${user.username}`);

      // Eliminar al usuario del mapa
      this.users.delete(client.id);

      // Emitir un mensaje al chat indicando que el usuario se ha desconectado
      const disconnectMessage = {
        id: new Date().getTime(), // ID único basado en la hora
        sender: 'Sistema', // Sistema o notificación
        message: `${user.username} se ha desconectado.`,
        timestamp: new Date().toISOString(),
      };
      this.server.emit('message', disconnectMessage);

      // Emitir la lista actualizada de usuarios conectados
      this.server.emit('users', Array.from(this.users.values()));
    }
  }

  authenticateUser(client: Socket) {
    try {
      // Extraer el token del handshake del cliente
      const token = client.handshake.auth?.token; // El cliente debe enviar el token en `auth`
      if (!token) {
        throw new Error('Token no proporcionado');
      }

      // Verificar y decodificar el token
      const decoded = jwt.verify(token, jwtConstants.secret) as {
        userId: string;
        username: string;
      };

      // Retornar los datos del usuario autenticado
      return {
        userId: decoded.userId,
        username: decoded.username,
      };
    } catch (error) {
      console.error('❌ Error al autenticar al usuario:', error.message);
      throw new Error('Autenticación fallida');
    }
  }
  @SubscribeMessage('notification')
  async sendNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string; message: string },
  ) {
    // Guardar la notificación en la base de datos
    const savedNotification = await this.notificationService.createNotification(
      payload.userId,
      payload.message,
    );

    // Buscar el socket del usuario conectado
    const userSocket = Array.from(this.users.entries()).find(
      ([, userData]) => userData.userId === payload.userId,
    );

    if (userSocket) {
      const socketId = userSocket[0];
      this.server.to(socketId).emit('notification', {
        id: savedNotification.id,
        message: savedNotification.message,
        timestamp: savedNotification.createdAt,
      });

      console.log(
        `🔔 Notificación enviada a ${payload.userId}: ${payload.message}`,
      );
    }
  }
}
