import { ErrorMessageEnum } from './error-message.enum';

export enum ResponseCodeEnum {
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
  TOKEN_EXPIRED = 403,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  SUCCESS = 200,
}

const CODE_MESSAGES = {
  NOT_FOUND: ErrorMessageEnum.NOT_FOUND,
  INTERNAL_SERVER_ERROR: ErrorMessageEnum.INTERNAL_SERVER_ERROR,
  UNAUTHORIZED: ErrorMessageEnum.UNAUTHORIZED,
  TOKEN_EXPIRED: ErrorMessageEnum.TOKEN_EXPIRED,
  FORBIDDEN: ErrorMessageEnum.FORBIDDEN,
  BAD_REQUEST: ErrorMessageEnum.BAD_REQUEST,
  SUCCESS: ErrorMessageEnum.SUCCESS,
};

export const getMessage = (code: ResponseCodeEnum): string => {
  return CODE_MESSAGES[`${ResponseCodeEnum[code]}`];
};
