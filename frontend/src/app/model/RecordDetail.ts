import { Record } from './Record';

export interface RecordDetail extends Record {
  peaks: number[][];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  peaks_distances: number[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  pulse_wave: number[][];
}
