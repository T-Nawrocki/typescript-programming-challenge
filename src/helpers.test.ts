import dayjs from "dayjs";
import { join } from "path";
import {
  convertIntervalToString,
  convertStringToInterval,
  getAllAvailableIntervals,
  getEarliestInterval,
  getIntervalOverlap,
  getLatestInterval,
  mergeIntervals,
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

it("can get a flat array of Intervals from a list of WorkerAvailabilities", () => {
  const workerAvailabilities = [
    parseWorkerLogLine(
      "1@[2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z,2020-01-01T18:00:00.000Z/2020-01-01T19:00:00.000Z]"
    ),
    parseWorkerLogLine("2@[2020-01-02T09:00:00.000Z/2020-01-02T10:00:00.000Z]"),
  ];
  const expectedResult = [
    convertStringToInterval(
      "2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z"
    ),
    convertStringToInterval(
      "2020-01-01T18:00:00.000Z/2020-01-01T19:00:00.000Z"
    ),
    convertStringToInterval(
      "2020-01-02T09:00:00.000Z/2020-01-02T10:00:00.000Z"
    ),
  ];
  const actualResult = getAllAvailableIntervals(workerAvailabilities);
  expect(actualResult).toEqual(expectedResult);
});

it("can get the earliest interval from an array of intervals", () => {
  const intervals = [
    convertStringToInterval(
      "2019-01-01T17:15:00.000+12:00/2020-01-01T08:15:00.000+02:00"
    ),
    convertStringToInterval(
      "2020-01-01T19:15:00.000+08:00/2020-01-01T09:00:00.000-03:00"
    ),
  ];
  const expectedResult = intervals[0];
  const actualResult = getEarliestInterval(intervals);
  expect(actualResult).toEqual(expectedResult);
});

it("can get the latest interval from an array of intervals", () => {
  const intervals = [
    convertStringToInterval(
      "2019-01-01T17:15:00.000+12:00/2020-01-01T08:15:00.000+02:00"
    ),
    convertStringToInterval(
      "2020-01-01T19:15:00.000+08:00/2020-01-01T09:00:00.000-03:00"
    ),
  ];
  const expectedResult = intervals[1];
  const actualResult = getLatestInterval(intervals);
  expect(actualResult).toEqual(expectedResult);
});

describe("Interval Overlap", () => {
  it("can get a new Interval representing the overlap between two Intervals", () => {
    const interval1 = convertStringToInterval(
      "2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z"
    );
    const interval2 = convertStringToInterval(
      "2020-01-01T18:00:00.000Z/2020-01-02T18:00:00.000Z"
    );
    const expectedResult = convertStringToInterval(
      "2020-01-01T18:00:00.000Z/2020-01-02T12:00:00.000Z"
    );
    const actualResult = getIntervalOverlap(interval1, interval2);
    expect(expectedResult).toEqual(actualResult);
  });

  it("returns the inner interval, if one interval is completely contained by another", () => {
    const interval1 = convertStringToInterval(
      "2020-01-01T12:00:00.000Z/2020-01-12T12:00:00.000Z"
    );
    const interval2 = convertStringToInterval(
      "2020-01-01T18:00:00.000Z/2020-01-02T18:00:00.000Z"
    );
    const expectedResult = interval2;
    const actualResult = getIntervalOverlap(interval1, interval2);
    expect(expectedResult).toEqual(actualResult);
  });

  it("returns null if there one Interval starts after the other ends", () => {
    const interval1 = convertStringToInterval(
      "2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z"
    );
    const interval2 = convertStringToInterval(
      "2020-01-03T18:00:00.000Z/2020-01-03T18:00:00.000Z"
    );
    expect(getIntervalOverlap(interval1, interval2)).toBeNull();
  });

  it("returns null if there one Interval starts at the same time the other ends", () => {
    const interval1 = convertStringToInterval(
      "2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z"
    );
    const interval2 = convertStringToInterval(
      "2020-01-02T12:00:00.000Z/2020-01-03T18:00:00.000Z"
    );
    expect(getIntervalOverlap(interval1, interval2)).toBeNull();
  });

  it("returns null if the two Intervals are the same", () => {
    const interval = convertStringToInterval(
      "2020-01-01T12:00:00.000Z/2020-01-02T12:00:00.000Z"
    );
    expect(getIntervalOverlap(interval, interval)).toBeNull();
  });
});

describe("mergeIntervals", () => {
  it("returns an empty array if there are no intervals to merge", () => {
    expect(mergeIntervals([])).toEqual([]);
  });

  it("can merge overlapping intervals together", () => {
    const intervals = [
      convertStringToInterval(
        "2020-01-01T12:00:00.000Z/2020-01-01T18:00:00.000Z"
      ),
      convertStringToInterval(
        "2020-01-01T15:15:00.000Z/2020-01-01T20:00:00.000Z"
      ),
    ];
    const expectedResult = [
      convertStringToInterval(
        "2020-01-01T12:00:00.000Z/2020-01-01T20:00:00.000Z"
      ),
    ];
    const actualResult = mergeIntervals(intervals);
    expect(actualResult).toEqual(expectedResult);
  });

  it("can merge adjacent intervals together", () => {
    const intervals = [
      convertStringToInterval(
        "2020-01-01T12:00:00.000Z/2020-01-01T18:00:00.000Z"
      ),
      convertStringToInterval(
        "2020-01-01T18:00:00.000Z/2020-01-01T20:00:00.000Z"
      ),
    ];
    const expectedResult = [
      convertStringToInterval(
        "2020-01-01T12:00:00.000Z/2020-01-01T20:00:00.000Z"
      ),
    ];
    const actualResult = mergeIntervals(intervals);
    expect(actualResult).toEqual(expectedResult);
  });

  it("will not merge non-overlapping or adjacent intervals", () => {
    const intervals = [
      convertStringToInterval(
        "2020-01-01T12:00:00.000Z/2020-01-01T18:00:00.000Z"
      ),
      convertStringToInterval(
        "2020-01-01T20:00:00.000Z/2020-01-01T23:00:00.000Z"
      ),
    ];
    const expectedResult = intervals;
    const actualResult = mergeIntervals(intervals);
    expect(actualResult).toEqual(expectedResult);
  });
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
