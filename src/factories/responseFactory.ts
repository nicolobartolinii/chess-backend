import {StatusCodes, ReasonPhrases} from 'http-status-codes';

/**
 * Interface for the base response.
 *
 * @interface IBaseResponse
 *
 * @property {boolean} success - Indicates if the operation was successful
 * @property {number} statusCode - The status code of the response
 * @property {any} data - The data to be returned
 */
interface IBaseResponse {
    success: boolean,
    statusCode: number,
    data?: any
}

/**
 * Interface for the API response. Extends the {@link IBaseResponse} interface.
 *
 * @interface IAPIResponse
 * @extends {IBaseResponse}
 *
 * @property {string} message - The message of the response
 */
interface IAPIResponse extends IBaseResponse {
    message: string,
}

/**
 * Interface for the SVG response. Extends the {@link IBaseResponse} interface.
 *
 * @interface ISVGResponse
 * @extends {IBaseResponse}
 *
 * @property {string} data - The SVG data
 * @property {string} filename - The filename of the SVG file
 */
interface ISVGResponse extends IBaseResponse {
    data: string,
    filename: string
}

/**
 * Interface for the PDF response. Extends the {@link IBaseResponse} interface.
 *
 * @interface IPDFResponse
 * @extends {IBaseResponse}
 *
 * @property {Buffer} data - The PDF data
 * @property {string} filename - The filename of the PDF file
 */
interface IPDFResponse extends IBaseResponse {
    data: Buffer,
    filename: string
}

/**
 * Factory class for creating responses. Implementation of the Factory Method pattern.
 *
 * @class ResponseFactory
 */
class ResponseFactory {
    /**
     * Creates a successful response.
     *
     * @param {string} [message=ReasonPhrases.OK] - The message of the response
     * @param {any} [data] - The data to be returned
     * @param {number} [statusCode=StatusCodes.OK] - The status code of the response
     *
     * @returns {IAPIResponse} - The successful response
     */
    static success(message: string = ReasonPhrases.OK, data?: any, statusCode: number = StatusCodes.OK): IAPIResponse {
        return {
            success: true,
            statusCode,
            message,
            data
        }
    }

    /**
     * Creates an error response.
     *
     * @param {string} [message=ReasonPhrases.INTERNAL_SERVER_ERROR] - The message of the response
     * @param {number} [statusCode=StatusCodes.INTERNAL_SERVER_ERROR] - The status code of the response
     *
     * @returns {IAPIResponse} - The error response
     */
    static error(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR): IAPIResponse {
        return {
            success: false,
            statusCode,
            message
        }
    }

    /**
     * Creates a SVG response.
     *
     * @param {string} data - The SVG data
     * @param {string} filename - The filename of the SVG file
     * @param {number} [statusCode=StatusCodes.OK] - The status code of the response
     *
     * @returns {ISVGResponse} - The SVG response
     */
    static svg(data: string, filename: string, statusCode: number = StatusCodes.OK): ISVGResponse {
        return {
            success: true,
            statusCode,
            data,
            filename
        }
    }

    /**
     * Creates a PDF response.
     *
     * @param {Buffer} data - The PDF data
     * @param {string} filename - The filename of the PDF file
     * @param {number} [statusCode=StatusCodes.OK] - The status code of the response
     *
     * @returns {IPDFResponse} - The PDF response
     */
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