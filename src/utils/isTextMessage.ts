import {TextMessage} from "../model/Message.ts";

export function isTextMessage(message: any): message is TextMessage {
    return typeof message === 'object' &&
        message !== null &&
        typeof message.id === 'string' &&
        typeof message.dialogId === 'string' &&
        typeof message.sessionId === 'string' &&
        typeof message.textMessage === 'string' &&
        typeof message.sender === 'string' &&
        typeof message.receiver === 'string' &&
        typeof message.timestamp === 'number' &&
        'senderStatus' in message &&
        'receiverStatus' in message;
}