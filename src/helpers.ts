import dayjs from "dayjs";
import { readFile } from "fs/promises";
import { Interval, WorkerAvailability } from "./types";

export const convertStringToInterval = (intervalString: string): Interval => {
  /* 
  Takes a slash-separated string representing a datetime interval and 
  converts it into an Interval object with start and end datetimes.
  */
  const startAndEnd = intervalString
    .split("/")
    .map((dateTimeString) => dayjs(dateTimeString));
  return { start: startAndEnd[0], end: startAndEnd[1] };
};

export const parseWorkerLogLine = (line: string): WorkerAvailability => {
  /*
  Parses a line from a worker log into a WorkerAvailability object, with
  a worker id and an array of Intervals at which the worker is available.
  */
  const id = parseInt(line.substring(0, line.indexOf("@")));
  const intervals = line
    .substring(line.indexOf("[") + 1, line.indexOf("]"))
    .split(",")
    .map((intervalString) => convertStringToInterval(intervalString));
  return { id: id, intervals: intervals };
};

export const readLogFile = async (
  filePath: string
): Promise<WorkerAvailability[]> => {
  /* 
  Reads a worker log file and returns the contents as a Promise of an array of
  WorkerAvailability objects.
  */
  const content = await readFile(filePath, { encoding: "utf-8" });
  const lines = content.split("\n");
  const workerAvailabilityList = lines.map((line) => parseWorkerLogLine(line));
  return workerAvailabilityList;
};

export const getEarliestInterval = (intervals: Interval[]): Interval => {
  /*
  Takes an array of Intervals and finds the Interval with the earliest 
  start datetime.
  */
  return intervals.reduce((earliest, current) => {
    return !earliest || current.start.isBefore(earliest.start)
      ? current
      : earliest;
  });
};

export const convertIntervalToString = (interval: Interval): string => {
  /*
  Takes an Interval, converts the start and end datetimes into ISO format, and 
  then returns them as a single slash-separated string
  */
  const startString = interval.start.toISOString();
  const endString = interval.end.toISOString();
  return `${startString}/${endString}`;
};
