/**
 * Helpers for reading and writing `project.results`.
 *
 * INVARIANT — read this before changing anything here or in the callers:
 *
 * `project.results` is a Postgres text[] whose elements are JSON *strings*.
 * A result's identity is its PHYSICAL INDEX in that array. `submission.result`
 * and `shareholder.result` store that index as a string ("0", "9", "13"), and
 * every read site resolves a result with `projectResults[submission.result]`.
 *
 * Therefore the array must NEVER be reordered, spliced, or renumbered. Doing so
 * silently repoints historical submissions at the wrong result.
 *
 * `order` is display-sort metadata ONLY. It is not an identity and must never be
 * used to address an element.
 */

/**
 * Parse project.results into objects that carry their immutable physical index.
 * Legacy projects have no `order` key; it is backfilled from the physical index.
 */
export const parseProjectResults = (results) =>
    (results ?? []).map((raw, physicalIndex) => {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : { ...raw };

        return {
            ...parsed,
            physicalIndex,
            order: parsed?.order ?? physicalIndex,
        };
    });

/**
 * Display-sorted copy. Never mutates the input.
 * Duplicate/missing `order` values break by physicalIndex so that already
 * corrupted projects still render in a stable, deterministic sequence.
 */
export const sortResultsForDisplay = (parsed) =>
    [...parsed].sort(
        (a, b) => a.order - b.order || a.physicalIndex - b.physicalIndex,
    );

/**
 * Serialize ONE result to its canonical string form.
 *
 * `serializeProjectResults` is defined in terms of this so the whole-list and
 * single-row write paths can never drift in key order or boolean coercion. That
 * matters: ResultsTableLoopItem skips its write when the freshly serialized row
 * equals the stored one, and any divergence would make that comparison never
 * match -- reopening the render loop it exists to close.
 */
export const serializeProjectResult = (result, index) =>
    JSON.stringify({
        name: result.name,
        color: result.color,
        contactRequired: !!result.contactRequired,
        attachmentRequired: !!result.attachmentRequired,
        order: result.order ?? index,
    });

/**
 * Serialize back to text[]. The caller must pass the list in PHYSICAL order.
 * Keys are written explicitly so `order` can never be dropped by
 * JSON.stringify seeing `undefined`.
 */
export const serializeProjectResults = (parsed) =>
    parsed.map((result, index) => serializeProjectResult(result, index));

const normalizeName = (name) => (name ?? "").trim().toLowerCase();

/**
 * Find a result sharing `name` with the one at `exceptPhysicalIndex`.
 * Names are the drag-and-drop matching key and appear in exports, so they must
 * stay unique within a project.
 */
export const findDuplicateName = (parsed, name, exceptPhysicalIndex) => {
    const key = normalizeName(name);
    if (!key) return null;

    return (
        parsed.find(
            (result) =>
                result.physicalIndex !== exceptPhysicalIndex &&
                normalizeName(result.name) === key,
        ) ?? null
    );
};

/**
 * Validate a whole results list before saving. Returns an error string, or ""
 * when the list is safe to persist.
 */
export const validateProjectResults = (results, transl = (s) => s) => {
    const parsed = parseProjectResults(results);
    const seen = new Set();

    for (const result of parsed) {
        const key = normalizeName(result.name);
        if (!key) return transl("Every result needs a name.");
        if (seen.has(key)) {
            return `${transl("Duplicate result name")}: ${result.name}`;
        }
        seen.add(key);
    }

    return "";
};
