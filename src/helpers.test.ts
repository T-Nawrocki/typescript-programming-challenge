import dayjs from "dayjs";
import { join } from "path";
import {
  convertIntervalToString,
  convertStringToInterval,
  parseWorkerLogLine,
  readLogFile,
} from "./helpers";

it("can convert an interval string in ISO format into an Interval object", () => {
  const logString = "2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z";
  const expectedResult = {
    start: dayjs("2020-01-01T12:00:00.000Z"),
    end: dayjs("2020-01-02T12:00:00.000Z"),
  };
  const actualResult = convertStringToInterval(logString);
  expect(actualResult).toEqual(expectedResult);
});

it("can parse a worker log line into a WorkerAvailability object with a single Interval", () => {
  const line = "1@[2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z]";
  const expectedResult = {
    id: 1,
    intervals: [
      convertStringToInterval(
        "2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z"
      ),
    ],
  };
  const actualResult = parseWorkerLogLine(line);
  expect(actualResult).toEqual(expectedResult);
});

it("can parse a worker log line into a WorkerAvailability object with multiple Intervals", () => {
  const line =
    "19@[2020-01-01T17:15:00.000+12:00/2020-01-01T08:15:00.000+02:00,2020-01-01T19:15:00.000+08:00/2020-01-01T09:00:00.000-03:00]";
  const expectedResult = {
    id: 19,
    intervals: [
      convertStringToInterval(
        "2020-01-01T17:15:00.000+12:00/2020-01-01T08:15:00.000+02:00"
      ),
      convertStringToInterval(
        "2020-01-01T19:15:00.000+08:00/2020-01-01T09:00:00.000-03:00"
      ),
    ],
  };
  const actualResult = parseWorkerLogLine(line);
  expect(actualResult).toEqual(expectedResult);
});

it("can read the contents of a text file into an array of WorkerAvailability objects", async () => {
  const filePath = join(__dirname, "../assets/input0.txt");
  const expectedResult = [
    parseWorkerLogLine("1@[2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z]"),
    parseWorkerLogLine("0@[2020-01-01T18:00:00.000Z/2020-01-01T19:00:00.000Z]"),
    parseWorkerLogLine("2@[2020-01-02T09:00:00.000Z/2020-01-02T10:00:00.000Z]"),
  ];
  const actualResult = await readLogFile(filePath);
  expect(actualResult).toEqual(expectedResult);
});

it("can convert a datetime interval into a slash-separated string", () => {
  const interval = {
    start: dayjs("2020-01-01T12:00:00.000Z"),
    end: dayjs("2020-01-02T12:00:00.000Z"),
  };
  const expectedResult = "2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z";
  const actualResult = convertIntervalToString(interval);
  expect(actualResult).toEqual(expectedResult);
});
