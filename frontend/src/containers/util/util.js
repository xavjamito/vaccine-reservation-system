import moment from "moment";

export const intervals = (startString, endString, interval) => {
  const start = moment(startString, 'hh:mm a');
  const end = moment(endString, 'hh:mm a');

  start.minutes(Math.ceil(start.minutes() / 15) * 15);

  var result = [];

  var current = moment(start);

  while (current <= end) {
      result.push(current.format('HH:mm'));
      current.add(interval, 'minutes');
  }

  return result;
}