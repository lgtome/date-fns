import { IntlOptionsUnit } from 'src/types'
import {
  secondsInDay,
  secondsInHour,
  secondsInMinute,
  secondsInMonth,
  secondsInQuarter,
  secondsInWeek,
  secondsInYear,
} from '../constants'
import differenceInCalendarDays from '../differenceInCalendarDays/index'
import differenceInCalendarMonths from '../differenceInCalendarMonths/index'
import differenceInCalendarQuarters from '../differenceInCalendarQuarters/index'
import differenceInCalendarWeeks from '../differenceInCalendarWeeks/index'
import differenceInCalendarYears from '../differenceInCalendarYears/index'
import differenceInHours from '../differenceInHours/index'
import differenceInMinutes from '../differenceInMinutes/index'
import differenceInSeconds from '../differenceInSeconds/index'
import toDate from '../toDate/index'
import requiredArgs from '../_lib/requiredArgs/index'

interface Options {
  unit?: IntlOptionsUnit
  locale?: Intl.RelativeTimeFormatStyle
  localeMatcher?: Intl.RelativeTimeFormatLocaleMatcher
  numeric?: Intl.RelativeTimeFormatNumeric
  style?: Intl.RelativeTimeFormatStyle
}

/**
 * @name intlFormatDistance
 * @category Common Helpers
 * @summary Formats distance between two dates in human-readable format
 * @description
 * The function calculates the difference between two given dates and either picks the most appropriate unit
 * depending on the distance (the less the distance the smaller the unit),
 * or allows the user to specify the unit as well.
 * If the unit is specified, it will be applied accordingly. Otherwise - see the table below:
 *
 * |    Distance between dates   |               Result               |
 * |-----------------------------|------------------------------------|
 * |  1 second                   | in 1 second                        |
 * |  n seconds                  | in n seconds                       |
 * |  1 minute                   | in 1 minute                        |
 * |  n minutes                  | in n minutes                       |
 * |  1 hour                     | in 1 hour                          |
 * |  n hours                    | in n hours                         |
 * |  1 day                      | in 1 day                           |
 * |  n days                     | in n days                          |
 * |  1 week                     | in 1 week                          |
 * |  n weeks                    | in n weeks                         |
 * |  1 month                    | in 1 month                         |
 * |  n months                   | in n months                        |
 * |  1 quarter                  | in 1 quarter                       |
 * |  n quarters                 | in n quarters                      |
 * |  1 year                     | in 1 year                          |
 * |  n years                    | in n years                         |
 *
 *
 *  With `unit = 'hour'` - formats the distance with the unit of an hour
 * |   Distance between dates    |               Result               |
 * |-----------------------------|------------------------------------|
 * | 1 day                       | in 24 hours                        |
 * | 1 week                      | in 168 hours                       |
 *
 *
 *  With `locale = 'de'` - formats the distance with the given locale `de`
 * |   Distance between dates    |               Result               |
 * |-----------------------------|------------------------------------|
 * | 1 day                       | in 1 Tag                           |
 * | 1 week                      | in 1 Woche                         |
 *
 *
 *  With `numeric: 'auto'` - formats the distance with the given message format `auto`
 * | Distance between dates      | Result                             |
 * |-----------------------------|------------------------------------|
 * | 0 seconds                   | now                                |
 * | 1 day                       | tomorrow                           |
 *
 *
 *  Other options examples
 * |   Other options   |     Possible values     |       Result       |
 * |-------------------|-------------------------|--------------------|
 * | localeMatcher     | 'lookup' and 'best fit' | N/A                |
 * |                   |                         |                    |
 * | numeric           | 'always'                | 1 day ago          |
 * |                   | 'auto'                  | yesterday          |
 * | style             | 'long'                  | in 1 month         |
 * |                   | 'short'                 | in 1 mo.           |
 * |                   | 'narrow'                | in 1 mo.           |
 *
 * @param {Date|Number} date - the date
 * @param {Date|Number} baseDate - the date to compare with.
 * @param {Object} [options] - an object with options.
 * @param {String} [options.unit] - formats the distance with the given unit ('year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second').
 * @param {String|String[]} [options.locale] - the locale to use (BCP 47 language tag) e.g. "hi": Hindi (language) or "de-AT": German (language) as used in Austria (region).
 * @param {String} [options.localeMatcher='best fit'] - the locale matching algorithm to use. Other value: "lookup".
 * @param {String} [options.numeric='always'] - the output message format. Other value: "auto".
 * @param {String} [options.style='long'] - the length of the internationalized message. Other values: "short" or "narrow".
 * @returns {String} the distance in words according to language-sensitive relative time formatting.
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `date` must not be Invalid Date
 * @throws {RangeError} `baseDate` must not be Invalid Date
 * @throws {RangeError} `options.unit` must not be invalid Unit
 * @throws {RangeError} `options.locale` must not be invalid locale
 * @throws {RangeError} `options.localeMatcher` must not be invalid localeMatcher
 * @throws {RangeError} `options.numeric` must not be invalid numeric
 * @throws {RangeError} `options.style` must not be invalid style
 *
 * @example
 * // What is the distance between Apr, 4 1986 11:30:00 and Apr, 4 1986 10:30:00 in Intl?
 * intlFormatDistance(
 *   new Date(1986, 3, 4, 11, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0)
 * )
 * //=> 'in 1 hour'
 *
 * @example
 * // What is the distance between Apr, 4 1987 10:30:00 and Apr, 4 1986 10:30:00 in Intl?
 * intlFormatDistance(
 *   new Date(1987, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0)
 * )
 * //=> 'in 1 year'
 *
 * @example
 * // What is the distance between Apr, 4 1987 10:30:00 and Apr, 4 1986 10:30:00 in quarters in Intl?
 * intlFormatDistance(
 *   new Date(1987, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'quarter' }
 * )
 * //=> 'in 4 quarters'
 *
 * @example
 * // What is the distance between Apr, 4 1987 10:30:00 and Apr, 4 1986 10:30:00 in months in Intl?
 * intlFormatDistance(
 *   new Date(1987, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'month' }
 * )
 * //=> 'in 12 months'
 *
 * @example
 * // What is the distance between Apr, 4 1987 10:30:00 and Apr, 4 1986 10:30:00 in weeks in Intl?
 * intlFormatDistance(
 *   new Date(1987, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'week' }
 * )
 * //=> 'in 52 weeks'
 *
 * @example
 * // What is the distance between Apr, 4 1987 10:30:00 and Apr, 4 1986 10:30:00 in days in Intl?
 * intlFormatDistance(
 *   new Date(1987, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'day' }
 * )
 * //=> 'in 365 days'
 *
 * @example
 * // What is the distance between Apr, 4 1987 10:30:00 and Apr, 4 1986 10:30:00 in hours in Intl?
 * intlFormatDistance(
 *   new Date(1987, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'hour' }
 * )
 * //=> 'in 8,760 hours'
 *
 * @example
 * // What is the distance between Apr, 4 1987 10:30:00 and Apr, 4 1986 10:30:00 in minutes in Intl?
 * intlFormatDistance(
 *   new Date(1987, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'minute' }
 * )
 * //=> 'in 525,600 minutes'
 *
 * @example
 * // What is the distance between Apr, 4 1987 10:30:00 and Apr, 4 1986 10:30:00 in seconds in Intl?
 * intlFormatDistance(
 *   new Date(1987, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'second' }
 * )
 * //=> 'in 31,536,000 seconds'
 *
 * @example
 * // What is the distance between Apr, 4 1986 11:30:00 and Apr, 4 1986 10:30:00 in minutes in Spanish in Intl?
 * intlFormatDistance(
 *   new Date(1986, 3, 4, 11, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'minute', locale: 'es' }
 * )
 * //=> 'dentro de 60 minutos'
 *
 * @example
 * // What is the distance between Apr, 4 1986 11:30:00 and Apr, 4 1986 10:30:00 in minutes in German in Intl?
 * intlFormatDistance(
 *   new Date(1986, 3, 4, 11, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'minute', locale: 'de' }
 * )
 * //=> 'in 60 Minuten'
 */

export default function intlFormatDistance(
  date: Date | number,
  baseDate: Date | number,
  options?: Options
): string {
  requiredArgs(2, arguments)

  let value: number = 0
  let unit: Intl.RelativeTimeFormatUnit
  const dateLeft = toDate(date)
  const dateRight = toDate(baseDate)

  if (!options?.unit) {
    // Get the unit based on diffInSeconds calculations if no unit passed in
    const diffInSeconds = differenceInSeconds(dateLeft, dateRight) // The smallest unit

    if (Math.abs(diffInSeconds) < secondsInMinute) {
      value = differenceInSeconds(dateLeft, dateRight)
      unit = 'second'
    } else if (Math.abs(diffInSeconds) < secondsInHour) {
      value = differenceInMinutes(dateLeft, dateRight)
      unit = 'minute'
    } else if (Math.abs(diffInSeconds) < secondsInDay) {
      value = differenceInHours(dateLeft, dateRight)
      unit = 'hour'
    } else if (Math.abs(diffInSeconds) < secondsInWeek) {
      value = differenceInCalendarDays(dateLeft, dateRight)
      unit = 'day'
    } else if (Math.abs(diffInSeconds) < secondsInMonth) {
      value = differenceInCalendarWeeks(dateLeft, dateRight)
      unit = 'week'
    } else if (Math.abs(diffInSeconds) < secondsInQuarter) {
      value = differenceInCalendarMonths(dateLeft, dateRight)
      unit = 'month'
    } else if (Math.abs(diffInSeconds) < secondsInYear) {
      if (differenceInCalendarQuarters(dateLeft, dateRight) < 4) {
        // To filter out cases that are less than a year but match 4 quarters
        value = differenceInCalendarQuarters(dateLeft, dateRight)
        unit = 'quarter'
      } else {
        value = differenceInCalendarYears(dateLeft, dateRight)
        unit = 'year'
      }
    } else {
      value = differenceInCalendarYears(dateLeft, dateRight)
      unit = 'year'
    }
  } else {
    // Get the value if unit has been passed in
    unit = options?.unit
    if (unit === 'second') {
      value = differenceInSeconds(dateLeft, dateRight)
    } else if (unit === 'minute') {
      value = differenceInMinutes(dateLeft, dateRight)
    } else if (unit === 'hour') {
      value = differenceInHours(dateLeft, dateRight)
    } else if (unit === 'day') {
      value = differenceInCalendarDays(dateLeft, dateRight)
    } else if (unit === 'week') {
      value = differenceInCalendarWeeks(dateLeft, dateRight)
    } else if (unit === 'month') {
      value = differenceInCalendarMonths(dateLeft, dateRight)
    } else if (unit === 'quarter') {
      value = differenceInCalendarQuarters(dateLeft, dateRight)
    } else if (unit === 'year') {
      value = differenceInCalendarYears(dateLeft, dateRight)
    }
  }

  const rtf = new Intl.RelativeTimeFormat(options?.locale, {
    localeMatcher: options?.localeMatcher,
    numeric: options?.numeric || 'auto',
    style: options?.style,
  })

  return rtf.format(value, unit)
}
