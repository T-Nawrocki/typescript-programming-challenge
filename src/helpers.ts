import dayjs from "dayjs";
import { Interval } from "./types";

export const parseInterval = (workerString: string): Interval => {
  /* 
  Parses the two datetimes from a worker string and returns them in an array
  */
  const startAndEnd = workerString
    .substring(workerString.indexOf("[") + 1, workerString.indexOf("]"))
    .split("/")
    .map((dateTimeString) => dayjs(dateTimeString));
  return { start: startAndEnd[0], end: startAndEnd[1] };
};
