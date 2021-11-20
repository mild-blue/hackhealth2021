import { Record } from './Record';

export interface PatientDetail {
  id: string;
  name: string;
  data: Record[];
}
