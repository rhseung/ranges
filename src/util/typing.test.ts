import { describe, test, expect } from 'vitest';
import { Lowest, Uppest } from './typing';

describe('Singleton', () => {
    test('Uppest', () => {
        expect(Uppest.INSTANCE).toBe(Uppest.INSTANCE);
    });

    test('Lowest', () => {
        expect(Lowest.INSTANCE).toBe(Lowest.INSTANCE);
    });
});