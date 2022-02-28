import dayjs from "dayjs";
import { parseInterval } from "./helpers";

it("can parse a datetime interval from a worker log string", () => {
  const logString = "12@[2021-02-22T19:30:50Z/2021-02-28T19:30:50Z]";
  const expectedResult = {
    start: dayjs("2021-02-22T19:30:50Z"),
    end: dayjs("2021-02-28T19:30:50Z"),
  };
  const actualResult = parseInterval(logString);
  expect(actualResult).toEqual(expectedResult);
});
