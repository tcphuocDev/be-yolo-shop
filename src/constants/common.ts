import * as dotenv from 'dotenv';
dotenv.config();

export enum APIPrefix {
  Version = 'api/v1',
}
export const jwtConstants = {
  secret: 'dadfasf',
  expiresIn: '6000s',
};
export enum SortOrder {
  Ascending = 1,
  Descending = -1,
}

export const SORT_CONST = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
};

export const FORMAT_CODE_PERMISSION = 'USER_';

export const convertToSlug = function (url: string) {
  url = url.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  url = url.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  url = url.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  url = url.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  url = url.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  url = url.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  url = url.replace(/đ/g, 'd');
  url = url.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'a');
  url = url.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'e');
  url = url.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'i');
  url = url.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'o');
  url = url.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'u');
  url = url.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'y');
  url = url.replace(/Đ/g, 'd');

  url = url.replace(
    /[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi,
    '',
  );
  const cloneArray = url.toLowerCase().split(' ');

  const reWrite = [];

  for (let item of cloneArray) {
    if (item !== '') reWrite.push(item);
  }

  return reWrite.join('-');
};
