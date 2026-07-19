export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export interface Job {
  id: number;
  vesselName: string;
  vesselType: string;
  position: string;
  requiredCertificates: string[];
  minimumExperience: number;
  jobStatus: JobStatus;
  description: string;
  closingDate: string;      // ISO date string from backend, e.g. "2026-07-30"
  image?: string | null | undefined;        // URL served by backend for the uploaded job image
}

/**
 * Match check response. Backend computes (score > 75) server-side and
 * returns ONLY the boolean — the raw score must never reach the browser.
 */
export interface JobMatchResponse {
  perfectMatch: boolean;
}

export interface JobApplicationRequest {
  jobId: number;
  // seafarerId intentionally omitted — resolve it from the session on the backend
}
