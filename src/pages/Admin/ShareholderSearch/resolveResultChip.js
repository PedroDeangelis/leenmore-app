import {
    getEletronicVoteLabel,
    getEproxyLinkLabel,
    hasCompletedEproxy,
    isEproxyLinkResult,
} from "../../components/resultSentinels";

/**
 * Chip for a stored result value (`submission.result` / `shareholder.result`).
 * Same guards as SubmissionLoopItem: the e-proxy sentinel, a live index into
 * `project.results`, or nothing -- a stale index must not throw in JSON.parse.
 */
export const resolveResultChip = (result, projectResults) => {
    if (isEproxyLinkResult(result)) {
        return { name: getEproxyLinkLabel(), color: "green" };
    }

    const raw = result ? projectResults?.[result] : undefined;
    if (typeof raw === "undefined") return null;

    try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return parsed?.name ? { name: parsed.name, color: parsed.color } : null;
    } catch (error) {
        return null;
    }
};

/**
 * The status the project results panel counts a shareholder under: e-vote
 * first, then a completed e-proxy, then the stored result. Mirrors the
 * bucketing in getPercentageRateForShareholder.
 */
export const resolveEffectiveStatus = (shareholder) => {
    if (shareholder.eletronic_voting?.length) {
        return { name: getEletronicVoteLabel(), color: "b&w" };
    }

    if (hasCompletedEproxy(shareholder)) {
        return { name: getEproxyLinkLabel(), color: "green" };
    }

    return resolveResultChip(shareholder.result, shareholder.project_results);
};
