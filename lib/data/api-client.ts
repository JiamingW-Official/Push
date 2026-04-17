// Push Platform — Client-side API helpers
// Merchant mock methods appended below; real endpoints toggle via `NEXT_PUBLIC_USE_MOCK`.

import {
  MOCK_APPLICATIONS,
  filterApplications,
  type MockApplication,
  type ApplicantFilters,
  type ApplicationStatus,
} from "./mock-applications";

// ---------------------------------------------------------------------------
// Merchant mock client
// ---------------------------------------------------------------------------

let _applications = [...MOCK_APPLICATIONS];

export const merchantMock = {
  /** Fetch filtered + paginated applicants */
  getApplicants(filters: ApplicantFilters = {}): {
    data: MockApplication[];
    total: number;
  } {
    return filterApplications(_applications, filters);
  },

  /** Update single application decision */
  decideApplication(
    id: string,
    decision: "accept" | "decline" | "shortlist",
  ): MockApplication | null {
    const statusMap: Record<typeof decision, ApplicationStatus> = {
      accept: "accepted",
      decline: "declined",
      shortlist: "shortlisted",
    };
    const idx = _applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    _applications[idx] = { ..._applications[idx], status: statusMap[decision] };
    return _applications[idx];
  },

  /** Batch update decisions */
  batchDecide(
    ids: string[],
    decision: "accept" | "decline" | "shortlist",
  ): MockApplication[] {
    return ids
      .map((id) => this.decideApplication(id, decision))
      .filter((a): a is MockApplication => a !== null);
  },
};
