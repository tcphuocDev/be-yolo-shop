export enum OrderStatusEnum {
  INCART = 0,
  WAITING_CONFIRM = 1,
  CONFIRMED = 2,
  SHIPPING = 3,
  RECEIVED = 4,
  SUCCESS = 5,
  REJECT = 6,
}

export const OrderStatusTitle = [
  'Trong giỏ hàng',
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đang giao hàng',
  'Đã nhận',
  'Hoàn thành',
  'Đã huỷ',
];

export enum IsMe {
  No,
  Yes,
}
