import { getEarliestInterval, readLogFile } from "./helpers";
import { WorkerAvailability } from "./types";

export async function solveFirstQuestion(
  inputFilePath: string
): Promise<string> {
  /*
  Returns starting date/time of earliest interval with a free worker.
  */
  const fileContents = await readLogFile(inputFilePath);
  const earliestIntervalPerWorker = fileContents.map(
    (workerAvailability: WorkerAvailability) => {
      return getEarliestInterval(workerAvailability.intervals);
    }
  );
  const earliestInterval = getEarliestInterval(earliestIntervalPerWorker);
  return earliestInterval.start.toISOString();
}

export async function solveSecondQuestion(
  inputFilePath: string
): Promise<string> {
  /*
  Returns ending date/time of latest interval with a free worker.
  */
  return "";
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
