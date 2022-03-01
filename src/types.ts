import { Dayjs } from "dayjs";

export interface Interval {
  start: Dayjs;
  end: Dayjs;
}

export interface WorkerAvailability {
  id: number;
  intervals: Interval[];
}
