import moment from "moment/moment";

export function getLongDate(date) {
  return moment(date).format("MMM Do YY");
}
