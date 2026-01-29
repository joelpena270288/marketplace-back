import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../auth/dto/JWT.consts';
import {
  validateOrReject,
  IsString,
  Length,
  IsOptional,
  ValidationError,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notification/notification.service';
import { ConversationService } from '../conversation/conversation.service';

// DTO con validación
class MessagePayload {
  @IsString()
  @Length(1, 500)
  message: string;
  @IsOptional()
  @IsString()
  channel?: string; // optional room/channel identifier
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users = new Map<
    string,
    { userId: string; username: string; online: boolean }
  >();
  // map userId -> set of socket ids (support multiple devices)
  private userSockets = new Map<string, Set<string>>();
  // rooms: map roomName -> set of socket ids
  private rooms = new Map<string, Set<string>>();

  // simple per-user in-memory rate limiter: map userId -> array of timestamps (ms)
  private rateMap = new Map<string, number[]>();

  constructor(
    @Inject(forwardRef(() => MessageService))
    private readonly messagesService: MessageService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService?: ConversationService,
  ) {}

  handleConnection(client: Socket) {
    // authenticateUser throws on failure; let it bubble so we disconnect
    try {
      const userData = this.authenticateUser(client);

      this.users.set(client.id, {
        userId: userData.userId,
        username: userData.username,
        online: true,
      });

      // maintain reverse mapping userId -> socket ids
      const prev = this.userSockets.get(userData.userId) ?? new Set<string>();
      prev.add(client.id);
      this.userSockets.set(userData.userId, prev);

      // Update online flags asynchronously and emit to clients
      this.usersService
        .findAll()
        .then((allUsers) => {
          const connectedUsers = Array.from(this.users.values());
          allUsers.forEach((user) => {
            (user as unknown as { online?: boolean }).online =
              connectedUsers.some(
                (connectedUser) => connectedUser.userId === user.userId,
              );
          });
          this.server.emit('users', allUsers);
        })
        .catch((e) => {
          const emsg = e instanceof Error ? e.message : JSON.stringify(e);
          console.warn('Could not fetch full user list for presence:', emsg);
        });
    } catch (e) {
      // If authentication fails, disconnect the client
      const emsg = e instanceof Error ? e.message : JSON.stringify(e);
      console.warn('Cliente no autorizado intentó conectar:', client.id, emsg);
      client.disconnect(true);
    }
  }

  @SubscribeMessage('private_message')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { recipientId: string; message: string },
  ) {
    const user = this.users.get(client.id);
    if (!user) return;

    // Basic validation
    if (!payload || !payload.recipientId || !payload.message) {
      client.emit('error', { message: 'Invalid private message payload' });
      return;
    }

    try {
      // Ensure recipient exists
      const recipient = await this.usersService.findById(payload.recipientId);
      if (!recipient) {
        client.emit('error', { message: 'Recipient not found' });
        return;
      }

      // find or create conversation
  let conv: import('../conversation/entities/conversation.entity').Conversation | null = null;
      if (this.conversationService) {
        conv = await this.conversationService.findDirectConversationBetween(
          user.userId,
          payload.recipientId,
        );
        if (!conv) {
          const uA = await this.usersService.findById(user.userId);
          const uB = await this.usersService.findById(payload.recipientId);
          conv = await this.conversationService.createDirectConversation(uA, uB);
        }
      }

      // Persist message attached to conversation
      const saved = await this.messagesService.createMessage(
        user.username,
        payload.message,
        undefined,
        conv ?? null,
      );

      const messageData = {
        id: saved.id,
        sender: user.username,
        message: saved.message,
        timestamp: saved.timestamp || new Date().toISOString(),
        conversationId: conv?.id ?? null,
      };

      // Collect unique socket ids for recipient and sender to avoid duplicate emits
      const recipientSockets = this.userSockets.get(payload.recipientId) ?? new Set<string>();
      const senderSockets = this.userSockets.get(user.userId) ?? new Set<string>();
      const allSockets = new Set<string>([...recipientSockets, ...senderSockets]);
      allSockets.forEach((sockId) => {
        this.server.to(sockId).emit('private_message', messageData);
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      client.emit('error', { message: msg });
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: string },
  ) {
    const channel = data?.channel;
    if (!channel) return;
    void client.join(channel);
    let s = this.rooms.get(channel);
    if (!s) {
      s = new Set<string>();
      this.rooms.set(channel, s);
    }
    s.add(client.id);

    // emit users in that room
    const usersInRoom = Array.from(s)
      .map((sockId) => this.users.get(sockId))
      .filter(Boolean);
    this.server.to(channel).emit('users', usersInRoom);
  }

  @SubscribeMessage('leave')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: string },
  ) {
    const channel = data?.channel;
    if (!channel) return;
    void client.leave(channel);
    const s = this.rooms.get(channel);
    if (s) {
      s.delete(client.id);
      const usersInRoom = Array.from(s)
        .map((sockId) => this.users.get(sockId))
        .filter(Boolean);
      this.server.to(channel).emit('users', usersInRoom);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MessagePayload,
  ) {
    const user = this.users.get(client.id);
    if (!user) return;

    try {
      // Transform plain payload into a class instance and validate
      const messageInstance = plainToInstance(MessagePayload, payload);
      await validateOrReject(messageInstance, {
        validationError: { target: false },
      });
      // Rate limiting: allow max 5 messages per 10 seconds per user
      const now = Date.now();
      const windowMs = 10_000;
      const maxMessages = 5;
      const timestamps = this.rateMap.get(user.userId) ?? [];
      // remove old timestamps
      const recent = timestamps.filter((t) => now - t < windowMs);
      if (recent.length >= maxMessages) {
        client.emit('error', { message: 'Too many messages, slow down.' });
        return;
      }
      recent.push(now);
      this.rateMap.set(user.userId, recent);
      const savedMessage = await this.messagesService.createMessage(
        user.username,
        messageInstance.message,
        messageInstance.channel,
      );

      const messageData = {
        id: savedMessage.id,
        sender: user.username,
        message: savedMessage.message,
        timestamp: savedMessage.timestamp || new Date().toISOString(),
        channel: savedMessage.channel,
      };

      console.log(`📩 Nuevo mensaje: ${JSON.stringify(messageData)}`);
      if (messageData.channel) {
        this.server.to(messageData.channel).emit('message', messageData);
      } else {
        this.server.emit('message', messageData);
      }
    } catch (error) {
      // If validation errors from class-validator, return structured info
      if (Array.isArray(error)) {
        const ve = error as ValidationError[];
        const details = ve.map((e: ValidationError) => ({
          property: e.property,
          constraints: e.constraints,
          children: e.children,
        }));
        client.emit('error', { message: 'Validation failed', details });
        return;
      }

      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error('❌ Error al procesar el mensaje:', msg);
      client.emit('error', { message: 'Mensaje inválido' });
    }
  }

  handleDisconnect(client: Socket) {
    const user = this.users.get(client.id); // Obtén el usuario asociado al cliente
    if (user) {
      console.log(`🔴 Usuario desconectado: ${user.username}`);

      // Eliminar al usuario del mapa
      this.users.delete(client.id);

      // Remove this socket id from userSockets mapping
      const set = this.userSockets.get(user.userId);
      if (set) {
        set.delete(client.id);
        if (set.size === 0) this.userSockets.delete(user.userId);
        else this.userSockets.set(user.userId, set);
      }

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
    // Extraer el token del handshake del cliente
    const tokenVal = (
      client.handshake.auth as Record<string, unknown> | undefined
    )?.['token']; // El cliente debe enviar el token en `auth`
    if (typeof tokenVal !== 'string') {
      throw new Error('Token no proporcionado');
    }
    const tokenStr = tokenVal;

    // Verificar y decodificar el token
    const decoded = jwt.verify(tokenStr, jwtConstants.secret) as unknown;

    // The auth token payload may use `id` or `userId` depending on how it was
    // created. Normalize both and ensure we return { userId, username }.
    const d = decoded as Record<string, unknown>;
    const userIdRaw = d['userId'] ?? d['id'] ?? d['sub'] ?? null;
    const usernameRaw = d['username'] ?? d['user'] ?? d['name'] ?? null;

    if (
      !(typeof userIdRaw === 'string' || typeof userIdRaw === 'number') ||
      !(typeof usernameRaw === 'string' || typeof usernameRaw === 'number')
    ) {
      throw new Error(
        'Token inválido: falta identificador de usuario o nombre',
      );
    }

    // Retornar los datos del usuario autenticado
    return {
      userId: String(userIdRaw),
      username: String(usernameRaw),
    };
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
