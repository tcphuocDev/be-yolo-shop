import { getMessage, ResponseCodeEnum } from 'src/constants/response-code.enum';
import { ResponsePayload } from './response-payload';

export class ResponseBuilder<T> {
  private payload: ResponsePayload<T> = {
    statusCode: ResponseCodeEnum.SUCCESS,
  };

  constructor(data?: T) {
    this.payload.data = data;
  }

  withCode(code: ResponseCodeEnum, withMessage = true): ResponseBuilder<T> {
    this.payload.statusCode = code;
    if (withMessage) {
      this.payload.message = getMessage(code);
    }

    return this;
  }

  withMessage(message: string): ResponseBuilder<T> {
    this.payload.message = message;
    return this;
  }

  withData(data: T): ResponseBuilder<T> {
    this.payload.data = data;
    return this;
  }

  build(): ResponsePayload<T> {
    return this.payload;
  }
}
