const sortObjectAcvivityData = (_data, sortFilter) => {
    if (sortFilter?.sortBy === "worker") {
        if (sortFilter?.sortDirection === "asc") {
            return Object.fromEntries(
                Object.entries(_data).sort(([, a], [, b]) =>
                    a.worker.localeCompare(b.worker)
                )
            );
        } else {
            return Object.fromEntries(
                Object.entries(_data).sort(([, a], [, b]) =>
                    b.worker.localeCompare(a.worker)
                )
            );
        }
    } else if (sortFilter?.sortBy === "total reports") {
        if (sortFilter?.sortDirection === "asc") {
            return Object.fromEntries(
                Object.entries(_data).sort(
                    ([, a], [, b]) => a.totalReports - b.totalReports
                )
            );
        } else {
            return Object.fromEntries(
                Object.entries(_data).sort(
                    ([, a], [, b]) => b.totalReports - a.totalReports
                )
            );
        }
    } else if (sortFilter?.sortBy === "total shares contacted") {
        if (sortFilter?.sortDirection === "asc") {
            return Object.fromEntries(
                Object.entries(_data).sort(
                    ([, a], [, b]) =>
                        a.totalSharesContacted - b.totalSharesContacted
                )
            );
        } else {
            return Object.fromEntries(
                Object.entries(_data).sort(
                    ([, a], [, b]) =>
                        b.totalSharesContacted - a.totalSharesContacted
                )
            );
        }
    } else if (sortFilter?.sortBy === "proxy shareholders") {
        if (sortFilter?.sortDirection === "asc") {
            return Object.fromEntries(
                Object.entries(_data).sort(
                    ([, a], [, b]) => a.proxyShareholders - b.proxyShareholders
                )
            );
        } else {
            return Object.fromEntries(
                Object.entries(_data).sort(
                    ([, a], [, b]) => b.proxyShareholders - a.proxyShareholders
                )
            );
        }
    } else if (sortFilter?.sortBy === "owned shares by proxy") {
        if (sortFilter?.sortDirection === "asc") {
            return Object.fromEntries(
                Object.entries(_data).sort(
                    ([, a], [, b]) =>
                        a.ownedSharesByProxy - b.ownedSharesByProxy
                )
            );
        } else {
            return Object.fromEntries(
                Object.entries(_data).sort(
                    ([, a], [, b]) =>
                        b.ownedSharesByProxy - a.ownedSharesByProxy
                )
            );
        }
    } else {
        return _data;
    }
};

export default sortObjectAcvivityData;
