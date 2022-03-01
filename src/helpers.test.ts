import dayjs from "dayjs";
import { join } from "path";
import { parseInterval, readLogFile } from "./helpers";

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
  const logString = "12@[2021-02-22T19:30:50Z/2021-02-28T19:30:50Z]";
  const expectedResult = {
    start: dayjs("2021-02-22T19:30:50Z"),
    end: dayjs("2021-02-28T19:30:50Z"),
  };
  const actualResult = parseInterval(logString);
  expect(actualResult).toEqual(expectedResult);
});
