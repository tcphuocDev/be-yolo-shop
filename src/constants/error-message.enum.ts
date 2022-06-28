export enum ErrorMessageEnum {
  // ================= General error message ===============================
  NOT_FOUND = 'Data not found',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Access denied',
  BAD_REQUEST = 'Bad request',
  SUCCESS = 'Success',
  TOKEN_EXPIRED = 'Token expired',

  // ================= General User error message ===============================
  UNIQUE_DATA_USERNAME = 'Dữ liệu Tên Đăng Nhập đã tồn tại',
  UNIQUE_DATA_CODE = 'Dữ liệu Mã đã tồn tại',
  UNIQUE_DATA_EMAIL = 'Dữ liệu Email đã tồn tại',
  USER_ROLE_NOT_FOUND = 'Dữ liệu Quyền không tồn tại',
  USER_NOT_FOUND = 'Dữ liệu Người Dùng không tồn tại',
  NAME_ALREADY_EXISTS = 'Dữ liệu Tên đã tồn tại',
  CAN_NOT_DELETE = 'Dữ liệu này không thể xóa',
}
