import { describe, test, expect } from 'vitest';
import { range } from './helper';
import { inf, ninf } from '../util';

describe('range', () => {
    // range(1, 5, 2)
    // range(5, 1, 2)
    // range(1, 5, -2)

    test('range(5) -> [0, 5)', () => {
        const r = range(5n);
        expect([...r]).toEqual([0n, 1n, 2n, 3n, 4n]);
    });

    test('range(1, 5)', () => {
        const r = range(1n, 5n);
        expect([...r]).toEqual([1n, 2n, 3n, 4n]);
    });

    test('range(1, 5, 2)', () => {
        const r = range(1n, 5n, 2n);
        expect([...r]).toEqual([1n, 3n]);
    });

    test('range(5, 1, -1)', () => {
        const r = range(5n, 1n, -1n);
        expect([...r]).toEqual([5n, 4n, 3n, 2n]);
    });

    test('range(5, 1, -2)', () => {
        const r = range(5n, 1n, -2n);
        expect([...r]).toEqual([5n, 3n]);
    });

    test('range(1, 5, -2)', () => {
        const r = range(1n, 5n, -2n);
        console.log([...r]);
        
        expect(r.isEmpty()).toBe(true);
        expect([...r]).toEqual([]);
    });

    test('range(inf)', () => {
        const r = range(inf);
        const result: bigint[] = [];
        for (const i of r) {
            result.push(i);
            if (result.length === 10) break;
        }
        expect(r.isInfinite()).toBe(true);
        expect(result).toEqual([0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n]);
    });

    test('range(-inf)', () => {
        const r = range(ninf);
        const result: bigint[] = [];
        for (const i of r) {
            result.push(i);
            if (result.length === 10) break;
        }
        expect(r.isInfinite()).toBe(true);
        expect(result).toEqual([]);
    });

    test('range(0, -inf, -1)', () => {
        const r = range(0n, ninf, -1n);
        const result: bigint[] = [];
        for (const i of r) {
            result.push(i);
            if (result.length === 10) break;
        }
        expect(r.isInfinite()).toBe(true);
        expect(result).toEqual([0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n, -9n]);
    });

    test('range(5, "-oo", -1)', () => {
        const r = range(5n, '-oo', -1n);
        const result: bigint[] = [];
        for (const i of r) {
            result.push(i);
            if (result.length === 10) break;
        }
        expect(r.isInfinite()).toBe(true);
        expect(result).toEqual([5n, 4n, 3n, 2n, 1n, 0n, -1n, -2n, -3n, -4n]);
    });
});