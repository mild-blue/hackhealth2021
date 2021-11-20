import { Doctor } from './Doctor';

export interface Patient {
  id: string;
  name?: string;
  doctor?: Doctor;
}
