// Перечисление для статуса сообщения
export enum MessageStatus {
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
    FAILED = 'FAILED'
}

// Базовый интерфейс для всех сообщений
export interface BaseMessage {
    id: string;
    chatId: string;
    sessionId: string;
    sender: string;
    receiver: string;
    timestamp: number;
    senderStatus: MessageStatus;
    receiverStatus: MessageStatus;
}

// Интерфейс для текстового сообщения
export interface TextMessage extends BaseMessage {
    type: 'TextMessage';
    textMessage: string;
}

// Интерфейс для фото сообщения
export interface PhotoMessage extends BaseMessage {
    type: 'PhotoMessage';
    photoUrl: string;
}

// Объединенный тип для всех сообщений
export type Message = TextMessage | PhotoMessage;

// Функция для определения типа сообщения
export function isTextMessage(message: Message): message is TextMessage {
    return message.type === 'TextMessage';
}

export function isPhotoMessage(message: Message): message is PhotoMessage {
    return message.type === 'PhotoMessage';
}

// Пример использования
export function handleMessage(message: Message) {
    if (isTextMessage(message)) {
        console.log(`Текстовое сообщение: ${message.textMessage}`);
    } else if (isPhotoMessage(message)) {
        console.log(`Фото сообщение: ${message.photoUrl}`);
    } else {
        console.log(message);
    }
}