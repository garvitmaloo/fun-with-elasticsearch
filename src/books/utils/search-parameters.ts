import type { BookDetails } from "../types";

interface SearchParameters {
    isExactMatch?: boolean;
    fields?: keyof BookDetails[];
    searchTerms?: string[];
    searchKey?: keyof BookDetails;
    searchValue?: unknown;
    range?: {
        upperBound: unknown
        lowerBound: unknown
    };
}

export type {
    SearchParameters
}