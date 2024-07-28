import {RequestStatus} from "../model/Request.ts";

export default function requestStatusText(status: RequestStatus | undefined): string {
    switch (status) {
        case RequestStatus.NEW:
            return "Новая заявка";
        case RequestStatus.PROCESSING:
            return "Заявка в обработке";
        case RequestStatus.PROCESSED:
            return "Заявка обработана";
        case RequestStatus.CANCELED:
            return "Заявка отменена";
        default:
            return "Неизвестный статус заявки";
    }
}