import { IntRange } from "../range";
import { le } from "../util";
import { Lowest, Uppest, inf, ninf } from "../util";

type PositiveInfinity = Uppest | '+inf' | '+oo' | '+∞' | 'inf' | 'oo' | '∞';
type NegativeInfinity = Lowest | '-inf' | '-oo' | '-∞';

/**
 * @returns [a, b), which is common in programming languages.
 */
export function range(end: number | bigint | PositiveInfinity | NegativeInfinity): IntRange;
export function range(start: number | bigint, end: number | bigint | PositiveInfinity | NegativeInfinity): IntRange;
export function range(start: number | bigint, end: number | bigint | PositiveInfinity | NegativeInfinity, step: number | bigint): IntRange;

export function range(
    startOrEnd: number | bigint | PositiveInfinity | NegativeInfinity,
    end?: number | bigint | PositiveInfinity | NegativeInfinity,
    step: number | bigint = 1n
): IntRange {
    if (typeof startOrEnd === 'number' && Number.isInteger(startOrEnd))
        startOrEnd = BigInt(startOrEnd);
    if (typeof end === 'number' && Number.isInteger(end))
        end = BigInt(end);
    if (typeof step === 'number' && Number.isInteger(step))
        step = BigInt(step);

    // TODO: floatRange 구현

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

