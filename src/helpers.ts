import dayjs from "dayjs";
import { readFile } from "fs/promises";
import { Interval } from "./types";

export const readLogFile = async (filePath: string): Promise<string[]> => {
  /* 
  Reads a worker log file and returns the contents as an 
  array of strings for each line of text
  */
  const content = await readFile(filePath, { encoding: "utf-8" });
  return content.split("\n");
};

export const convertStringToInterval = (workerString: string): Interval => {
  /* 
  Parses the two datetimes from a worker string and returns them as an Interval
  */
  const startAndEnd = workerString
    .substring(workerString.indexOf("[") + 1, workerString.indexOf("]"))
    .split("/")
    .map((dateTimeString) => dayjs(dateTimeString));
  return { start: startAndEnd[0], end: startAndEnd[1] };
};

export const convertIntervalToString = (interval: Interval): string => {
  /*
  Takes an Interval and converts it into a string in the format "{start}/{end}"
  */
  const startString = interval.start.toISOString();
  const endString = interval.end.toISOString();
  return `${startString}/${endString}`;
};
