import {StatusCodes, ReasonPhrases} from 'http-status-codes';

interface IBaseResponse {
    success: boolean,
    statusCode: number,
    data?: any
}

interface IAPIResponse extends IBaseResponse {
    message: string,
}

interface ISVGResponse extends IBaseResponse {
    data: string,
    filename: string
}

interface IPDFResponse extends IBaseResponse {
    data: Buffer,
    filename: string
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

    static svg(data: string, filename: string, statusCode: number = StatusCodes.OK): ISVGResponse {
        return {
            success: true,
            statusCode,
            data,
            filename
        }
    }

    static pdf(data: Buffer, filename: string, statusCode: number = StatusCodes.OK): IPDFResponse {
        return {
            success: true,
            statusCode,
            data,
            filename
        }
    }
}

export default ResponseFactory;