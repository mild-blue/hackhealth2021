import { Doctor } from './Doctor';

export interface Patient {
  sessionId: string;
  doctor?: Doctor;
}
