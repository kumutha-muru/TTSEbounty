import moment from "moment";

export const currentDate = moment(new Date(), "YYYY/MM/DD HH:mm");
export const nextday = moment(currentDate, "YYYY/MM/DD").add(1, "days");

export const today = moment(currentDate).format("dddd");
export const tomorrow = moment(nextday).format("dddd");

export const CurrentDatee = moment(new Date());

export const todayTime = moment(CurrentDatee, "HH:mm");
