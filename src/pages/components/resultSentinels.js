/**
 * Synthetic result sentinels.
 *
 * Normal results are addressed by their PHYSICAL INDEX into `project.results`
 * (see ./projectResults.js) and `submission.result` / `shareholder.result`
 * store that index as a string ("0", "9", "13").
 *
 * Two concepts have no row in `project.results` and are synthesized at read
 * time instead: electronic voting, and the e-proxy link. They need a stable key
 * that can never collide with an index, which is what these sentinels are.
 *
 * Historically these were keyed three different ways -- the raw string
 * "eproxy_link" on the submission page, the *translated* label in the results
 * panel, and a hardcoded Korean literal in RealTimeResults bridging the two.
 * That last comparison silently broke whenever the translation changed or the
 * locale was not Korean. Compare against these helpers instead of any literal.
 */

import transl from "./translate";

export const EPROXY_LINK_RESULT = "eproxy_link";
export const ELETRONIC_VOTE_RESULT = "eletronic_vote";

/**
 * True when a shareholder has completed the e-proxy flow. This is the single
 * definition of "has an e-proxy"; several call sites used to inline it.
 */
export const hasCompletedEproxy = (shareholder) =>
    !!shareholder?.api_recipient_contact &&
    !!shareholder?.api_recipient_completion_date;

/**
 * The result a submission-page row is shown and filtered under. Submissions of
 * a shareholder who completed an e-proxy are relabelled to the e-proxy sentinel
 * (the real result is kept on `original_result`). That label only applies
 * while "show only last submission per shareholder" is checked; otherwise the
 * row counts as the result it was actually submitted with, so the e-proxy
 * filter lists just the e-proxy rows themselves.
 */
export const getSubmissionDisplayResult = (
    submission,
    showOnlyTheLastSubmission,
) =>
    !showOnlyTheLastSubmission && submission?.original_result !== undefined
        ? submission.original_result
        : submission?.result;

/**
 * The display label for a sentinel. Kept as a function, not a constant, so it
 * re-reads the active locale rather than capturing it at module load.
 */
export const getEproxyLinkLabel = () => transl("eproxy link");
export const getEletronicVoteLabel = () => transl("eletronic vote");

/**
 * Whether a result value (or a display name) refers to the e-proxy concept.
 * Accepts the label as well as the sentinel because the results panel buckets
 * by translated label -- see getPercentageRateForShareholder.js.
 */
export const isEproxyLinkResult = (value) =>
    value === EPROXY_LINK_RESULT || value === getEproxyLinkLabel();

export const isEletronicVoteResult = (value) =>
    value === ELETRONIC_VOTE_RESULT || value === getEletronicVoteLabel();

/**
 * True for any value that is a synthetic sentinel rather than a physical index
 * into `project.results`. Guards every `projectResults[value]` lookup.
 */
export const isSyntheticResult = (value) =>
    isEproxyLinkResult(value) || isEletronicVoteResult(value);
