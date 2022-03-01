import dayjs from "dayjs";
import { join } from "path";
import {
  convertIntervalToString,
  convertStringToInterval,
  readLogFile,
} from "./helpers";

it("can read the contents of a text file into an array of lines", async () => {
  const filePath = join(__dirname, "../assets/input0.txt");
  const expectedResult = [
    "1@[2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z]",
    "0@[2020-01-01T18:00:00.000Z/2020-01-01T19:00:00.000Z]",
    "2@[2020-01-02T09:00:00.000Z/2020-01-02T10:00:00.000Z]",
  ];
  const actualResult = await readLogFile(filePath);
  expect(actualResult).toEqual(expectedResult);
});

it("can parse a datetime interval from a worker log string", () => {
  const logString = "1@[2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z]";
  const expectedResult = {
    start: dayjs("2020-01-01T12:00:00.000Z"),
    end: dayjs("2020-01-02T12:00:00.000Z"),
  };
  const actualResult = convertStringToInterval(logString);
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
