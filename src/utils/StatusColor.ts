import {RequestStatus} from "../model/Request.ts";

export const statusColors = {
    [RequestStatus.NEW]: "#2196F3", // Синий
    [RequestStatus.PROCESSING]: "#FFC107", // Желтый
    [RequestStatus.PROCESSED]: "#4CAF50", // Зелёный
    [RequestStatus.CANCELED]: "#F44336", // Красный
};