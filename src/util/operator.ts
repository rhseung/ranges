import { ComparableWithInfinity, Lowest, Uppest } from "./typing";

/**
 * @returns a < b
 */
function _lt(a: ComparableWithInfinity, b: ComparableWithInfinity): boolean {
    if (a instanceof Lowest)
        return true;
    else if (a instanceof Uppest)
        return false;
    else if (b instanceof Lowest)
        return false;
    else if (b instanceof Uppest)
        return true;
    else
        return a < b;
}

/**
 * @returns a <= b
 */
function _le(a: ComparableWithInfinity, b: ComparableWithInfinity): boolean {
    if (a instanceof Lowest)
        return true;
    else if (a instanceof Uppest)
        return false;
    else if (b instanceof Lowest)
        return false;
    else if (b instanceof Uppest)
        return true;
    else
        return a <= b;
}

/**
 * @returns a === b
 */
function _eq(a: any, b: any): boolean {
    return a === b;
}

/**
 * @returns a < b < c < ... < z
 */
export function lt(...values: ComparableWithInfinity[]): boolean {
    let ret: boolean = true;
    
    for (let i = 0; i < values.length - 1; i++) {
        ret = ret && _lt(values[i], values[i + 1]);
        if (!ret)
            break;
    }

    return ret;
}

/**
 * @returns a <= b <= c <= ... <= z
 */
export function le(...values: ComparableWithInfinity[]): boolean {
    let ret: boolean = true;
    
    for (let i = 0; i < values.length - 1; i++) {
        ret = ret && _le(values[i], values[i + 1]);
        if (!ret)
            break;
    }

    return ret;
}

/**
 * @returns a === b === c === ... === z
 */
export function eq(...values: any[]): boolean {
    let ret: boolean = true;
    
    for (let i = 0; i < values.length - 1; i++) {
        ret = ret && _eq(values[i], values[i + 1]);
        if (!ret)
            break;
    }

    return ret;
}