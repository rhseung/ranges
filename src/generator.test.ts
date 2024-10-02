import { describe, test, expect } from 'vitest';
import { range } from './generator';

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
});