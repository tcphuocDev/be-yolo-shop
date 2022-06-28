import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiError } from '@utils/api.error';
import { I18nService } from 'nestjs-i18n';
import { DEFAULT_LANG } from '@utils/constant';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';

const classValidationPatterns = {
  IS_INSTANCE:
    '$IS_INSTANCE decorator expects and object as value, but got falsy value.',
  IS_DECIMAL: '{property} is not a valid decimal number.',
  IS_BIC_OR_SWIFT_CODE: '{property} must be a BIC or SWIFT code',
  IS_BOOLEAN_STRING: '{property} must be a boolean string',
  IS_BOOLEAN: '{property} must be a boolean value',
  IS_BTC_ADDRESS: '{property} must be a BTC address',
  IS_CREDIT_CARD: '{property} must be a credit card',
  IS_CURRENCY: '{property} must be a currency',
  IS_URI_FORMAT: '{property} must be a data uri format',
  IS_DATE: '{property} must be a Date instance',
  IS_FIREBASE_PUSH_ID: '{property} must be a Firebase Push Id',
  IS_HASH_OF_TYPE_: '{property} must be a hash of type (.+)',
  IS_HEXADECIMAL_COLOR: '{property} must be a hexadecimal color',
  IS_HEXADECIMAL_NUBMER: '{property} must be a hexadecimal number',
  IS_HSL_COLOR: '{property} must be a HSL color',
  IS_IDENTITY_CARD_NUMBER: '{property} must be a identity card number',
  IS_ISSN: '{property} must be a ISSN',
  IS_JSON_STRING: '{property} must be a json string',
  JWT_STRING: '{property} must be a jwt string',
  IS_LATITUDE_STRING_OR_NUMBER:
    '{property} must be a latitude string or number',
  IS_LATITUDE_LONGTITUDE_STRING:
    '{property} must be a latitude,longitude string',
  IS_LINGTITUDE_STRING_OR_NUMBER:
    '{property} must be a longitude string or number',
  IS_LOWER_CASE_STRING: '{property} must be a lowercase string',
  IS_MAC_ADDRESS: '{property} must be a MAC Address',
  IS_MONGODB_ID: '{property} must be a mongodb id',
  IS_NAGATIVE_NUMBER: '{property} must be a negative number',
  IS_A_NON_EMPTY_OBJECT: '{property} must be a non-empty object',
  IS_A_NUMBER_CONFIRMING_TO_THE_SPECIFICIED:
    '{property} must be a number conforming to the specified constraints',
  IS_A_NUMBER_STRING: '{property} must be a number string',
  IS_A_PHONE_NUMBER: '{property} must be a phone number',
  IS_A_PORT: '{property} must be a port',
  IS_A_POSITIVE_NUMBER: '{property} must be a positive number',
  IS_A_POSTAL_CODE: '{property} must be a postal code',
  IS_A_SEMANTIC_VERSIONING_SPECIFICATION:
    '{property} must be a Semantic Versioning Specification',
  IS_A_STRING: '{property} must be a string',
  IS_A_VALID_DOMAIN_NAME: '{property} must be a valid domain name',
  PROPERTY_MUST_BE_A_VALID_ENUM_VALUE: '{property} must be a valid enum value',
  PROPERTY_MUST_BE_A_VALID_ISO_8601_DATE_STRING:
    '{property} must be a valid ISO 8601 date string',
  PROPERTY_MUST_BE_A_VALID_ISO31661_ALPHA2_CODE:
    '{property} must be a valid ISO31661 Alpha2 code',
  PROPERTY_MUST_BE_A_VALID_ISO31661_ALPHA3_CODE:
    '{property} must be a valid ISO31661 Alpha3 code',
  PROPERTY_MUST_BE_A_VALID_PHONE_NUMBER:
    '{property} must be a valid phone number',
  PROPERTY_MUST_BE_A_VALID_REPRESENTATION_OF_MILITARY_TIME_IN_THE_FORMAT_HH_MM:
    '{property} must be a valid representation of military time in the format HH:MM',
  PROPERTY_MUST_BE_AN_ARRAY: '{property} must be an array',
  PROPERTY_MUST_BE_AN_EAN:
    '{property} must be an EAN (European Article Number)',
  PROPERTY_MUST_BE_AN_EMAIL: '{property} must be an email',
  PROPERTY_MUST_BE_AN_ETHEREUM_ADDRESS:
    '{property} must be an Ethereum address',
  PROPERTY_MUST_BE_AN_IBAN: '{property} must be an IBAN',
  PROPERTY_MUST_BE_AN_INSTANCE_OF: '{property} must be an instance of (.+)',
  PROPERTY_MUST_BE_AN_INTEGER_NUMBER: '{property} must be an integer number',
  PROPERTY_MUST_BE_AN_IP_ADDRESS: '{property} must be an ip address',
  PROPERTY_MUST_BE_AN_ISBN: '{property} must be an ISBN',
  PROPERTY_MUST_BE_AN_ISIN:
    '{property} must be an ISIN (stock/security identifier)',
  PROPERTY_MUST_BE_AN_ISRC: '{property} must be an ISRC',
  PROPERTY_MUST_BE_AN_OBJECT: '{property} must be an object',
  PROPERTY_MUST_BE_AN_ADDRESS: '{property} must be an URL address',
  PROPERTY_MUST_BE_AN_URL_UUID: '{property} must be an UUID',
  PROPERTY_MUST_BE_BASED32_ENCODED: '{property} must be base32 encoded',
  PROPERTY_MUST_BE_BASE64_ENCODED: '{property} must be base64 encoded',
  PROPERTY_MUST_BE_DEVISIBLE_BY: '{property} must be divisible by (.+)',
  PROPERTY_MUST_BE_EMPTY: '{property} must be empty',
  PROPERTY_MUST_BE_EQUAL_TO: '{property} must be equal to (.+)',
  PROPERTY_MUST_BE_A_LOCALE: '{property} must be locale',
  PROPERTY_MUST_BE_LONGER_THAN_OR_EQUAL_TO_S_AND_SHORTER_THAN_OR_EQUAL_TO_S_CHARACTER:
    '{property} must be longer than or equal to (\\S+) and shorter than or equal to (\\S+) characters',
  PROPERTY_MUST_BE_LONGER_THAN_OR_EQUAL_TO_S_CHARACTER:
    '{property} must be longer than or equal to (\\S+) characters',
  PROPERTY_MUST_BE_MAGNET_URI_FORAMT: '{property} must be magnet uri format',
  PROPERTY_MUST_BE_MIME_TYPE_FORMAT: '{property} must be MIME type format',
  PROPERTY_MUST_BE_ONE_OF_THE_FOLLOWING_VALUE_D:
    '{property} must be one of the following values: (\\S+)',
  PROPERTY_MUST_BE_RFC_339_DATE: '{property} must be RFC 3339 date',
  PROPERTY_MUST_BE_RGB_COLOR: '{property} must be RGB color',
  PROPERTY_MUST_BE_SHOTER_THAN_OR_EQUAL_S_CHARACTERS:
    '{property} must be shorter than or equal to (\\S+) characters',
  PROPERTY_MUST_BE_SHORTER_THAN_OR_EQUAL_TO_S_CHARACTER:
    '{property} must be shorter than or equal to (\\S+) characters',
  PROPERTY_MUST_BE_UPPERCASE: '{property} must be uppercase',
  PROPERTY_MUST_BE_VALID_OCTAL_NUMBER: '{property} must be valid octal number',
  PROPERTY_MUST_CONTAIN_PASSPORT_NUMBER:
    '{property} must be valid passport number',
  PROPERTY_MUST_CONTAIN_A_S_VALUE: '{property} must contain (\\S+) values',
  PROPERTY_MUST_CONTAIN_A_S_STRING: '{property} must contain a (\\S+) string',
  PROPERTY_MUST_CONTAIN_A_FULL_WIDTH_AND_HALF_WIDTH_CHARACTER:
    '{property} must contain a full-width and half-width characters',
  PROPERTY_MUST_CONTAIN__FULL_WIDTH_CHARACTER:
    '{property} must contain a full-width characters',
  PROPERTY_MUST_CONTAIN_A_HALF_WIDTH_CHARACTER:
    '{property} must contain a half-width characters',
  PROPERTY_MUST_CONTAIN_ANY_SURROGATE_PAIRS_CHARS:
    '{property} must contain any surrogate pairs chars',
  PROPERTY_MUST_CONTAIN_AT_LEAST_ELEMENTS:
    '{property} must contain at least (\\S+) elements',
  PROPERTY_MUST_CONTAIN_NOT_MORE_THAN_ELEMENTS:
    '{property} must contain not more than (\\S+) elements',
  PROPERTY_MUST_CONTAIN_ONE_OR_MORE_MULTIBYTE_CHARS:
    '{property} must contain one or more multibyte chars',
  PROPERTY_MUST_CONTAIN_ONLY_ASCII_CHARACTERS:
    '{property} must contain only ASCII characters',
  PROPERTY_MUST_CONTAIN_ONLY_LETTERS_AZAZ:
    '{property} must contain only letters (a-zA-Z)',
  PROPERTY_MUST_CONTAIN_ONLY_LETTERS_AND_NUMBER:
    '{property} must contain only letters and numbers',
  PROPERTY_MUST_MATCH_REGULAR_EXPRESSION:
    '{property} must match (\\S+) regular expression',
  PROPERTY_SHOULD_NOT_BE_GREATER_THAN:
    '{property} must not be greater than (.+)',
  PROPERTY_SHOULD_NOT_BE_LESS_THAN: '{property} must not be less than (.+)',
  PROPERTY_SHOULD_NOT_BE_EMPTY: '{property} should not be empty',
  PROPERTY_SHOULD_NOT_BE_EQUAL_TO: '{property} should not be equal to (.+)',
  PROPERTY_SHOULD_NOT_BE_NULL_OR_UNDEFINED:
    '{property} should not be null or undefined',
  PROPERTY_SHOULD_NOT_BE_ONE_OF_THE_FOLLOWING_VALUES:
    '{property} should not be one of the following values: (.+)',
  PROPERTY_SHOLD_NOT_CONATAIN_VALUE:
    '{property} should not contain (\\S+) values',
  PROPERTY_SHOLD_NOT_CONATAIN_A_STRING:
    '{property} should not contain a (\\S+) string',
  PROPERTY_BYTE_LENGTH_MUST_FALL_INTO:
    "{property}'s byte length must fall into \\((\\S+), (\\S+)\\) range",
  ALL_PROPERTY_ELEMENTS_MUST_BE_UNIQUE:
    "All {property}'s elements must be unique",
  EACH_VALUE_IN: 'each value in ',
  MAXIMAL_ALLOWED_DATE_FOR: 'maximal allowed date for {property} is (.+)',
  MINIMAL_ALLOWED_DATE_FOR: 'minimal allowed date for {property} is (.+)',
  NESTED_PROPERTY_MUST_BE_EITHER_OBJECT_OR_ARRAY:
    'nested property {property} must be either object or array',
};

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly i18n: I18nService) {}
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const message = await this.getMessage(errors, value?.lang);
      return {
        request: object,
        responseError: new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          message,
        ).toResponse(),
      };
    }
    return {
      request: object,
      responseError: {},
    };
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private async getMessage(
    errors: ValidationError[],
    lang: string,
  ): Promise<string> {
    const error = errors[0];
    if (!error) return 'Unknown error';
    if (!error.children || !error.children.length) {
      let match: string[] | null;
      let constraint: string;

      // Find the matching pattern.
      let patternFinded;
      for (const key in classValidationPatterns) {
        const pattern = classValidationPatterns[key].replace('$', '\\$');
        constraint = Object.values(error.constraints)[0].replace(
          error.property,
          '{property}',
        );
        match = new RegExp(pattern, 'g').exec(constraint);
        if (match) {
          patternFinded = key;
          break;
        }
      }

      // Replace the constraints values back to the $constraintX words.
      let i18nKey = constraint;
      const replacements = { property: error.property };
      if (match) {
        for (let i = 1; i < match.length; i += 1) {
          i18nKey = i18nKey.replace(match[i], `{{constraint${i}}}`);
          replacements[`constraint${i}`] = match[i];
        }
      }
      await this.i18n.refresh();
      return patternFinded
        ? await this.i18n.translate(`validation.${patternFinded}`, {
            lang: lang !== undefined ? lang : DEFAULT_LANG, // To do implement request lang in body
            args: replacements,
          })
        : Object.values(error.constraints)[0];
    }

    return this.getMessage(error.children, lang);
  }
}
