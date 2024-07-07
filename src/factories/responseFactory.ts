import {StatusCodes, ReasonPhrases} from 'http-status-codes';

interface IAPIResponse {
    success: boolean,
    statusCode: number,
    message: string,
    data?: any
}

class ResponseFactory {
    static success(message: string = ReasonPhrases.OK, data?: any, statusCode: number = StatusCodes.OK): IAPIResponse {
        return {
            success: true,
            statusCode,
            message,
            data
        }
    }

    static error(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR): IAPIResponse {
        return {
            success: false,
            statusCode,
            message
        }
    }
}

export default ResponseFactory;