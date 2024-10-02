import { describe, test, expect } from 'vitest';
import { le, lt } from './operators';
import { Lowest, Uppest } from './typing';

describe('lt/le', () => {
    describe('lt', () => {
        test('lt(1, 2, 3)', () => {
            expect(lt(1, 2, 3)).toBe(true);
        });

        test('lt(1, 3, 2)', () => {
            expect(lt(1, 3, 2)).toBe(false);
        });

        test('lt(3, 2, 1)', () => {
            expect(lt(3, 2, 1)).toBe(false);
        });

        test('lt(1, 2, 2)', () => {
            expect(lt(1, 2, 2)).toBe(false);
        });

        test('lt(1, 2, +∞)', () => {
            expect(lt(1, 2, Uppest.INSTANCE)).toBe(true);
        });

        test('lt(-∞, 1, 2)', () => {
            expect(lt(Lowest.INSTANCE, 1, 2)).toBe(true);
        });

        test('lt(-∞, +∞)', () => {
            expect(lt(Lowest.INSTANCE, Uppest.INSTANCE)).toBe(true);
        });

        test('lt(+∞, -∞)', () => {
            expect(lt(Uppest.INSTANCE, Lowest.INSTANCE)).toBe(false);
        });

        test('lt(1, +∞, 3)', () => {
            expect(lt(1, Uppest.INSTANCE, 3)).toBe(false);
        });

        test('lt(-∞, -∞, 1, +∞)', () => {
            expect(lt(Lowest.INSTANCE, Lowest.INSTANCE, 1, Uppest.INSTANCE)).toBe(true);
        });

        test('lt(-∞, -∞, +∞, 1)', () => {
            expect(lt(Lowest.INSTANCE, Lowest.INSTANCE, Uppest.INSTANCE, 1)).toBe(false);
        });
    });

    describe('le', () => {
        test('le(1, 2, 3)', () => {
            expect(le(1, 2, 3)).toBe(true);
        });

        test('le(1, 3, 2)', () => {
            expect(le(1, 3, 2)).toBe(false);
        });

        test('le(3, 2, 1)', () => {
            expect(le(3, 2, 1)).toBe(false);
        });

        test('le(1, 2, 2)', () => {
            expect(le(1, 2, 2)).toBe(true);
        });

        test('le(1, 1, +∞)', () => {
            expect(le(1, 1, Uppest.INSTANCE)).toBe(true);
        });

        test('le(-∞, 1, 1)', () => {
            expect(le(Lowest.INSTANCE, 1, 1)).toBe(true);
        });

        test('le(-∞, +∞)', () => {
            expect(le(Lowest.INSTANCE, Uppest.INSTANCE)).toBe(true);
        });

        test('le(+∞, -∞)', () => {
            expect(le(Uppest.INSTANCE, Lowest.INSTANCE)).toBe(false);
        });

        test('le(1, +∞, 3)', () => {
            expect(le(1, Uppest.INSTANCE, 3)).toBe(false);
        });

        test('le(-∞, -∞, 1, +∞)', () => {
            expect(le(Lowest.INSTANCE, Lowest.INSTANCE, 1, Uppest.INSTANCE)).toBe(true);
        });

        test('le(-∞, -∞, +∞, 1)', () => {
            expect(le(Lowest.INSTANCE, Lowest.INSTANCE, Uppest.INSTANCE, 1)).toBe(false);
        });
    });
})