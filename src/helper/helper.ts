import { IntRange } from "../range";
import { le } from "../util/operator";
import { Lowest, Uppest, inf, ninf } from "../util/typing";

type PositiveInfinity = Uppest | '+inf' | '+oo' | '+∞' | 'inf' | 'oo' | '∞';
type NegativeInfinity = Lowest | '-inf' | '-oo' | '-∞';

/**
 * @returns [a, b), which is common in programming languages.
 */
export function range(end: bigint | PositiveInfinity | NegativeInfinity): IntRange;
export function range(start: bigint, end: bigint | PositiveInfinity | NegativeInfinity): IntRange;
export function range(start: bigint, end: bigint | PositiveInfinity | NegativeInfinity, step: bigint): IntRange;

// TODO: range("[3, 5)")

export function range(
    startOrEnd: bigint | PositiveInfinity | NegativeInfinity,
    end?: bigint | PositiveInfinity | NegativeInfinity,
    step: bigint = 1n
): IntRange {
    let _startOrEnd: bigint | Uppest | Lowest;
    let _end: bigint | Uppest | Lowest | undefined = undefined;
    
    if (startOrEnd === '+inf' || startOrEnd === '+oo' || startOrEnd === '+∞' || startOrEnd === 'inf' || startOrEnd === 'oo' || startOrEnd === '∞')
        _startOrEnd = inf;
    else if (startOrEnd === '-inf' || startOrEnd === '-oo' || startOrEnd === '-∞')
        _startOrEnd = ninf;
    else
        _startOrEnd = startOrEnd;

    if (end !== undefined) {
        if (end === '+inf' || end === '+oo' || end === '+∞' || end === 'inf' || end === 'oo' || end === '∞')
            _end = inf;
        else if (end === '-inf' || end === '-oo' || end === '-∞')
            _end = ninf;
        else
            _end = end;
    }
    
    let start: bigint;

    if (_end === undefined) {
        start = 0n;
        _end = _startOrEnd as bigint;
    } else {
        start = _startOrEnd as bigint;
    }

    if (le(start, _end))
        return IntRange.closedOpen(start, _end as bigint | Uppest, step, true);
    else
        return IntRange.openClosed(_end as bigint | Lowest, start, step, false);
}

