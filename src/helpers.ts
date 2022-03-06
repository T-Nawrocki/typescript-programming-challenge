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

export const getAllAvailableIntervals = (
  workerAvailabilities: WorkerAvailability[]
): Interval[] => {
  return workerAvailabilities
    .map((workerAvailability) => workerAvailability.intervals)
    .flat();
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

export const getLatestInterval = (intervals: Interval[]): Interval => {
  /*
  Takes an array of Intervals and finds the Interval with the latest 
  end datetime.
  */
  return intervals.reduce((latest, current) => {
    return !latest || current.end.isAfter(latest.end) ? current : latest;
  });
};

export const getIntervalOverlap = (
  interval1: Interval,
  interval2: Interval
): Interval | null => {
  /*
  Takes a pair of Intervals and determines if they have any overlap.
  If so, returns a new Interval which covers their overlap. Else returns null.
  */
  const startsSecond = interval1.start.isAfter(interval2.start)
    ? interval1
    : interval2;
  const endsFirst = interval1.end.isBefore(interval2.end)
    ? interval1
    : interval2;
  if (
    interval1 === interval2 ||
    startsSecond.start.isAfter(endsFirst.end) ||
    startsSecond.start.isSame(endsFirst.end)
  )
    return null;
  return { start: startsSecond.start, end: endsFirst.end };
};

export const mergeIntervals = (intervals: Interval[]): Interval[] => {
  /*
  Takes an array of intervals, sorts it into ascending order and then merges 
  any overlapping intervals together, returning the array of merged intervals.
  */
  if (intervals.length === 0) return []; // none to merge, none to return

  const sorted = intervals.sort((a, b) => (b.start.isBefore(a.start) ? 1 : -1));
  const results: Interval[] = [];

  let currentResult = sorted[0];
  for (let newInterval of sorted) {
    if (
      newInterval.start.isSame(currentResult.end) ||
      newInterval.start.isBefore(currentResult.end)
    )
      // Overlap or bordering, so continue building currentResult
      currentResult.end = getLatestInterval([newInterval, currentResult]).end;
    else {
      // No overlap, so currentResult is finished and can be pushed to results
      results.push(currentResult);
      currentResult = newInterval;
    }
  }
  // Push the last currentResult into results
  results.push(currentResult);

  return results;
};

export const convertIntervalToString = (interval: Interval): string => {
  const startString = interval.start.toISOString();
  const endString = interval.end.toISOString();
  return `${startString}/${endString}`;
};
