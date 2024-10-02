import { le } from "./operators";
import { IntRange } from "./range";
import { Lowest, Uppest } from "./typing";

/**
 * @returns [a, b), which is common in programming languages.
 */
export function range(end: bigint | Uppest | Lowest);
export function range(start: bigint, end: bigint | Uppest | Lowest);
export function range(start: bigint, end: bigint | Uppest | Lowest, step: bigint);

// TODO: range("[3, 5)")
// TODO: range(5, '-inf', -1), range(5, '-oo', -1) 등 사용자 친화적인 인터페이스

export function range(startOrEnd: bigint | Uppest | Lowest, end?: bigint | Uppest | Lowest, step: bigint = 1n) {
    let start: bigint;

    if (end === undefined) {
        start = 0n;
        end = startOrEnd as bigint;
    } else {
        start = startOrEnd as bigint;
    }

    if (le(start, end))
        return IntRange.closedOpen(start, end as bigint | Uppest, step, true);
    else
        return IntRange.openClosed(end as bigint | Lowest, start, step, false);
}

