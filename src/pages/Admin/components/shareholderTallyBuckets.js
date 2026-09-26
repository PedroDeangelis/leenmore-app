// Bucket keys shared by the server-side tally RPC
// (project_shareholder_result_tally) and the code that renders its output.
//
// These live in their own module so the pure calculation in
// getPercentageRateForShareholder.js does not have to import the data hooks --
// which would pull axios and the Supabase client into every consumer.
export const PROJECT_TALLY_BUCKET_EV = "__ev__";
export const PROJECT_TALLY_BUCKET_EPROXY = "__eproxy__";
export const PROJECT_TALLY_BUCKET_NULL = "__null__";
