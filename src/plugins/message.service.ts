import { MultipartFile } from "@fastify/multipart";
import { createMessageScheme, Message, MessageBody } from "../schemas/message";
import { FileService } from "./file.service";
import { ListMessagesArgs, MessageRepository } from "./message.repository";
import fp from "fastify-plugin";

interface MessageService {
  handleIncTextMessage(
    message: MessageBody,
    authorId: number,
  ): Promise<Message>;

  handleIncFileMessage(
    message: MultipartFile,
    authorId: number,
  ): Promise<Message>;

  retrieveMessages(messagesArgs: ListMessagesArgs): Promise<Message[]>;

  retrieveMessageContent(id: number): Promise<Message | null>;
}

class HTTPMessageService implements MessageService {
  constructor(
    private fileService: FileService,
    private messageRepository: MessageRepository,
  ) {}

  async handleIncTextMessage(
    { content }: MessageBody,
    authorId: number,
  ): Promise<Message> {
    const parsedMessage = createMessageScheme.parse({
      contentType: "TEXT",
      content,
      userId: authorId,
    });
    const newMessage =
      await this.messageRepository.createMessage(parsedMessage);

    return newMessage;
  }

  async handleIncFileMessage(
    message: MultipartFile,
    authorId: number,
  ): Promise<Message> {
    const { filename, mimetype } = await this.fileService.saveFile(message);
    const defaultFolder = this.fileService.getDefaultFolder();
    const content = `/${defaultFolder}/${filename}`;
    const parsedMessage = createMessageScheme.parse({
      contentType: "FILE",
      content,
      userId: authorId,
      mimetype,
    });
    const newMessage =
      await this.messageRepository.createMessage(parsedMessage);
    return newMessage;
  }

  async retrieveMessages(messagesArgs: ListMessagesArgs): Promise<Message[]> {
    return this.messageRepository.listMessages(messagesArgs);
  }

  async retrieveMessageContent(id: number): Promise<Message | null> {
    return this.messageRepository.getMessageById(id);
  }
}

export default fp(
  async (fastify, opts) => {
    const { messageRepository, fileService } = fastify;
    fastify.decorate(
      "messageService",
      new HTTPMessageService(fileService, messageRepository),
    );
  },
  {
    name: "message-service",
    dependencies: ["message-repository", "file-service"],
  },
);

declare module "fastify" {
  export interface FastifyInstance {
    messageService: MessageService;
  }
}
