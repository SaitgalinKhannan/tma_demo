export interface Request {
    requestId: number;
    userId: number;
    messageId: number;
    currencyTo: string;
    currencyFrom: string;
    sumTo: number;
    sumFrom: number;
    requestStatus: RequestStatus;
    requestDate: number;
    percent: number;
    exchangeRate: number;
    profit: number;
    usdt: number;
    bank: string | null;
    typeOfDelivery: number;
    addInfo: string
}

export enum RequestType {
    ALL = "ALL",
    NEW = "NEW",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    CANCELED = "CANCELED"
}

export enum RequestStatus {
    NEW = "NEW",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    CANCELED = "CANCELED"
}