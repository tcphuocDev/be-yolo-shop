import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { getMessage, ResponseCodeEnum } from 'src/constants/response-code.enum';

export class ApiError extends Error {
  private readonly _errorCode: ResponseCodeEnum;

  private readonly _message: string;

  // private _debug: unknown;

  constructor(errorCode: ResponseCodeEnum, message?: string) {
    super(message);

    this._errorCode = errorCode;
    this._message = message;
  }

  get errorCode(): ResponseCodeEnum {
    return this._errorCode;
  }

  get message(): string {
    return this._message || getMessage(this._errorCode);
  }

  // debug(data: unknown): ApiError {
  //   if (config.environment == 'development') {
  //     this._debug = data;
  //   }

  //   return this;
  // }

  toResponse(): ResponsePayload<unknown> {
    return new ResponseBuilder<unknown>()
      .withCode(this._errorCode)
      .withMessage(this.message)
      .build();
  }
}
