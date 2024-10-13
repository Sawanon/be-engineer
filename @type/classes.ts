
export class CustomError extends Error {
    code = 404;
    isError = true;
    constructor(message: string | undefined, statusCode?: number) {
       super(message);
       if (statusCode) this.code = statusCode;
    }
 }
 