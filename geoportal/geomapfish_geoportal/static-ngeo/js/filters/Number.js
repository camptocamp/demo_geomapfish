/**
 * @module epfl_authgeoportail.filters.NumberCoordinates
 */

import ngeoMiscFilters from 'ngeo/misc/filters.js';

/**
 * @param {angular.ILocaleService} $locale Angular locale
 * @returns {formatNumber} Function used to format number into a string.
 * @ngInject
 * @ngdoc filter
 * @ngname ngeoNumber
 */
export function customNumber($locale) {
  const formats = $locale.NUMBER_FORMATS;

  /**
   * @param {number} number The number to format.
   * @param {number} [opt_precision] The used precision, default is 3.
   * @param {number} [opt_ignore_format] If we should format with $locale.
   * @returns {string} The formatted string.
   */
  const result = function (number, opt_precision, opt_ignore_format) {
    const groupSep = opt_ignore_format ? '' : formats.GROUP_SEP;
    const decimalSep = opt_ignore_format ? '' : formats.DECIMAL_SEP;
    if (opt_precision === undefined) {
      opt_precision = 3;
    }

    if (number === Infinity) {
      return '\u221e';
    } else if (number === -Infinity) {
      return '-\u221e';
    } else if (number === 0) {
      // 0 will creates infinity values
      return '0';
    }
    const sign = number < 0;
    number = Math.abs(number);

    const nb_decimal = opt_precision - Math.floor(Math.log(number) / Math.log(10)) - 1;
    const factor = Math.pow(10, nb_decimal);
    number = Math.round(number * factor);
    let decimal = '';
    const unit = Math.floor(number / factor);

    if (nb_decimal > 0) {
      let str_number = `${number}`;
      // 0 padding
      while (str_number.length < nb_decimal) {
        str_number = `0${str_number}`;
      }
      decimal = str_number.substring(str_number.length - nb_decimal);
      while (decimal.endsWith('0')) {
        decimal = decimal.substring(0, decimal.length - 1);
      }
    }

    const groups = [];
    let str_unit = `${unit}`;
    while (str_unit.length > 3) {
      const index = str_unit.length - 3;
      groups.unshift(str_unit.substring(index));
      str_unit = str_unit.substring(0, index);
    }
    groups.unshift(str_unit);

    return (sign ? '-' : '') + groups.join(groupSep) + (decimal.length === 0 ? '' : decimalSep + decimal);
  };
  return result;
}

ngeoMiscFilters.filter('ngeoNumber', customNumber);

export default ngeoMiscFilters;
