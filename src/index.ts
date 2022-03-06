import {
  getAllAvailableIntervals,
  getEarliestInterval,
  getLatestInterval,
  readLogFile,
} from "./helpers";
import { WorkerAvailability } from "./types";

export async function solveFirstQuestion(
  inputFilePath: string
): Promise<string> {
  /*
  Returns starting date/time of earliest interval with a free worker.
  */
  const fileContents = await readLogFile(inputFilePath);
  const allIntervals = getAllAvailableIntervals(fileContents);
  const earliestInterval = getEarliestInterval(allIntervals);
  return earliestInterval.start.toISOString();
}

export async function solveSecondQuestion(
  inputFilePath: string
): Promise<string> {
  /*
  Returns ending date/time of latest interval with a free worker.
  */
  const fileContents = await readLogFile(inputFilePath);
  const allIntervals = getAllAvailableIntervals(fileContents);
  const latestInterval = getLatestInterval(allIntervals);
  return latestInterval.end.toISOString();
}

export async function solveThirdQuestion(
  inputFilePath: string
): Promise<string[]> {
  /*
  Returns date/time intervals where at least two workers are free.
  Results are in ascending order (earliest to latest interval).
  Overlapping intervals in results are merged into a single interval.
  */
  return [];
}
