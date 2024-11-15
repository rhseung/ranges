import { describe, test, expect } from 'vitest';
import { Range, IntRange, FloatRange } from "./range";
import { BoundType, inf, ninf } from "../util";

describe('Range', () => {
    describe('Range constructor', () => {
        test('[1, 3]', () => {
            const ret = Range.closed(1, 3);
            expect(ret).toEqual(Range.new(BoundType.CLOSED, 1, 3, BoundType.CLOSED));
            expect(ret.toString()).toBe('[1, 3]');
        });

        test('(1, 3)', () => {
            const ret = Range.open(1, 3);
            expect(ret).toEqual(Range.new(BoundType.OPEN, 1, 3, BoundType.OPEN));
            expect(ret.toString()).toBe('(1, 3)');
        });

        test('[1, 3)', () => {
            const ret = Range.closedOpen(1, 3);
            expect(ret).toEqual(Range.new(BoundType.CLOSED, 1, 3, BoundType.OPEN));
            expect(ret.toString()).toBe('[1, 3)');
        });

        test('(1, 3]', () => {
            const ret = Range.openClosed(1, 3);
            expect(ret).toEqual(Range.new(BoundType.OPEN, 1, 3, BoundType.CLOSED));
            expect(ret.toString()).toBe('(1, 3]');
        });

        test('[0, +∞)', () => {
            const ret = Range.atLeast(0);
            expect(ret).toEqual(Range.new(BoundType.CLOSED, 0, inf, BoundType.OPEN));
            expect(ret.toString()).toBe('ℝ⁺');
        });

        test('(0, +∞)', () => {
            const ret = Range.greaterThan(0);
            expect(ret).toEqual(Range.new(BoundType.OPEN, 0, inf, BoundType.OPEN));
            expect(ret.toString()).toBe('ℝ⁺');
        });

        test('(-∞, 3]', () => {
            const ret = Range.atMost(3);
            expect(ret).toEqual(Range.new(BoundType.OPEN, ninf, 3, BoundType.CLOSED));
            expect(ret.toString()).toBe('(-∞, 3]');
        });

        test('(-∞, 0)', () => {
            const ret = Range.lessThan(0);
            expect(ret).toEqual(Range.new(BoundType.OPEN, ninf, 0, BoundType.OPEN));
            expect(ret.toString()).toBe('ℝ⁻');
        });

        test('(-∞, +∞)', () => {
            const ret = Range.all();
            expect(ret).toEqual(Range.new(BoundType.OPEN, ninf, inf, BoundType.OPEN));
            expect(ret.toString()).toBe('ℝ');
        });

        test('invalid [-∞, 3]', () => {
            expect(() => Range.new(BoundType.CLOSED, ninf, 3, BoundType.CLOSED)).toThrow(RangeError);
        });

        test('invalid (1, +∞]', () => {
            expect(() => Range.new(BoundType.OPEN, 1, inf, BoundType.CLOSED)).toThrow(RangeError);
        });

        test('[5, 5]', () => {
            const ret = Range.closed(5, 5);
            expect(ret).toEqual(Range.new(BoundType.CLOSED, 5, 5, BoundType.CLOSED));
            expect(ret.toString()).toBe('{5}');
        });

        test('(5, 5]', () => {
            const ret = Range.openClosed(5, 5);
            expect(ret.isEmpty()).toBe(true);
            expect(ret.toString()).toBe('∅');
        });
    });

    describe('Range isEmpty', () => {
        test('[3, 2]', () => {
            expect(Range.closed(3, 2).isEmpty()).toBe(true);
        });

        test('(3, 2]', () => {
            expect(Range.openClosed(3, 2).isEmpty()).toBe(true);
        });

        test('[3, 2)', () => {
            expect(Range.closedOpen(3, 2).isEmpty()).toBe(true);
        });

        test('(3, 2)', () => {
            expect(Range.open(3, 2).isEmpty()).toBe(true);
        });

        test('[3, 3]', () => {
            expect(Range.closed(3, 3).isEmpty()).toBe(false);
        });

        test('(3, 3]', () => {
            expect(Range.openClosed(3, 3).isEmpty()).toBe(true);
        });

        test('[3, 3)', () => {
            expect(Range.closedOpen(3, 3).isEmpty()).toBe(true);
        });

        test('(3, 3)', () => {
            expect(Range.open(3, 3).isEmpty()).toBe(true);
        });

        // 공집합 예제들
        test('[2, 1] = ∅', () => {
            expect(Range.closed(2, 1).isEmpty()).toBe(true);
        });

        test('(2, 1] = ∅', () => {
            expect(Range.openClosed(2, 1).isEmpty()).toBe(true);
        });

        test('[2, 1) = ∅', () => {
            expect(Range.closedOpen(2, 1).isEmpty()).toBe(true);
        });

        test('(2, 1) = ∅', () => {
            expect(Range.open(2, 1).isEmpty()).toBe(true);
        });

        test('(+∞, -∞) = ∅', () => {
            // @ts-ignore
            expect(Range.open(inf,ninf).isEmpty()).toBe(true);
        });
    });

    describe('Range includes', () => {
        test('범위 [1, 5]에 3 포함', () => {
            const range = Range.closed<number>(1, 5);
            expect(range.includes(3)).toBe(true);
        });

        test('범위 [1, 5]에 0 포함 안됨', () => {
            const range = Range.closed<number>(1, 5);
            expect(range.includes(0)).toBe(false);
        });

        test('범위 (1, 5)에 1 포함 안됨', () => {
            const range = Range.open(1, 5);
            expect(range.includes(1)).toBe(false);
        });

        test('범위 (1, 5)에 5 포함 안됨', () => {
            const range = Range.open(1, 5);
            expect(range.includes(5)).toBe(false);
        });

        test('범위 [1, 5)에 5 포함 안됨', () => {
            const range = Range.closedOpen(1, 5);
            expect(range.includes(5)).toBe(false);
        });

        test('범위 [1, 5)에 1 포함', () => {
            const range = Range.closedOpen(1, 5);
            expect(range.includes(1)).toBe(true);
        });

        test('범위 (1, 5]에 5 포함', () => {
            const range = Range.openClosed(1, 5);
            expect(range.includes(5)).toBe(true);
        });

        test('범위 (1, 5]에 1 포함 안됨', () => {
            const range = Range.openClosed(1, 5);
            expect(range.includes(1)).toBe(false);
        });

        test('범위 (-∞, 5)에 3 포함', () => {
            const range = Range.lessThan<number>(5);
            expect(range.includes(3)).toBe(true);
        });

        test('범위 (-∞, 5)에 5 포함 안됨', () => {
            const range = Range.lessThan(5);
            expect(range.includes(5)).toBe(false);
        });

        test('범위 [1, +∞)에 100 포함', () => {
            const range = Range.atLeast<number>(1);
            expect(range.includes(100)).toBe(true);
        });

        test('범위 [1, +∞)에 0 포함 안됨', () => {
            const range = Range.atLeast<number>(1);
            expect(range.includes(0)).toBe(false);
        });

        test('[1, 2] includes 1', () => {
            const range = Range.closed(1, 2);
            expect(range.includes(1)).toBe(true);
        });

        test('[1, 2] includes 2', () => {
            const range = Range.closed(1, 2);
            expect(range.includes(2)).toBe(true);
        });

        test('(1, 2) includes 1', () => {
            const range = Range.open(1, 2);
            expect(range.includes(1)).toBe(false);
        });

        test('(1, 2) includes 1.5', () => {
            const range = Range.open<number>(1, 2);
            expect(range.includes(1.5)).toBe(true);
        });

        test('[1, 2) includes 2', () => {
            const range = Range.closedOpen(1, 2);
            expect(range.includes(2)).toBe(false);
        });

        test('(1, 2] includes 2', () => {
            const range = Range.openClosed(1, 2);
            expect(range.includes(2)).toBe(true);
        });

        test('[1, +∞) includes 100', () => {
            const range = Range.atLeast<number>(1);
            expect(range.includes(100)).toBe(true);
        });

        test('(-∞, 2) includes -100', () => {
            const range = Range.lessThan<number>(2);
            expect(range.includes(-100)).toBe(true);
        });

        // 공집합 범위에 대한 포함 여부 테스트
        // ∅ includes 1
        test('∅ includes 1', () => {
            const range = Range.closed(2, 1); // Empty range
            expect(range.isEmpty()).toBe(true);
            expect(range.includes(1)).toBe(false);
        });

        // ∅ includes 2
        test('∅ includes 2', () => {
            const range = Range.closed(2, 1); // Empty range
            expect(range.isEmpty()).toBe(true);
            expect(range.includes(2)).toBe(false);
        });

        // ∅ includes any number
        test('∅ includes any number', () => {
            const range = Range.closed<number>(2, 1); // Empty range
            expect(range.isEmpty()).toBe(true);
            expect(range.includes(-100)).toBe(false);
            expect(range.includes(0)).toBe(false);
            expect(range.includes(100)).toBe(false);
        });
    });

    describe('Range encloses', () => {
        // [1,2] ⊇ [1,2]
        test('[1,2] ⊇ [1,2]', () => {
            const outer = Range.closed(1, 2);
            const inner = Range.closed(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // [1,2] ⊇ (1,2)
        test('[1,2] ⊇ (1,2)', () => {
            const outer = Range.closed(1, 2);
            const inner = Range.open(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // [1,2] ⊇ [1,2)
        test('[1,2] ⊇ [1,2)', () => {
            const outer = Range.closed(1, 2);
            const inner = Range.closedOpen(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // [1,2] ⊇ (1,2]
        test('[1,2] ⊇ (1,2]', () => {
            const outer = Range.closed(1, 2);
            const inner = Range.openClosed(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // [1,2) ⊇ [1,2)
        test('[1,2) ⊇ [1,2)', () => {
            const outer = Range.closedOpen(1, 2);
            const inner = Range.closedOpen(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // [1,2) ⊇ (1,2)
        test('[1,2) ⊇ (1,2)', () => {
            const outer = Range.closedOpen(1, 2);
            const inner = Range.open(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (1,2] ⊇ (1,2]
        test('(1,2] ⊇ (1,2]', () => {
            const outer = Range.openClosed(1, 2);
            const inner = Range.openClosed(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (1,2] ⊇ (1,2)
        test('(1,2] ⊇ (1,2)', () => {
            const outer = Range.openClosed(1, 2);
            const inner = Range.open(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (1,2) ⊇ (1,2)
        test('(1,2) ⊇ (1,2)', () => {
            const outer = Range.open(1, 2);
            const inner = Range.open(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // [1,+∞) ⊇ [1,2]
        test('[1,+∞) ⊇ [1,2]', () => {
            const outer = Range.atLeast<number>(1);
            const inner = Range.closed<number>(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // [1,+∞) ⊇ [1,+∞)
        test('[1,+∞) ⊇ [1,+∞)', () => {
            const outer = Range.atLeast(1);
            const inner = Range.atLeast(1);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (1,+∞) ⊇ (1,2]
        test('(1,+∞) ⊇ (1,2]', () => {
            const outer = Range.greaterThan<number>(1);
            const inner = Range.openClosed<number>(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (1,+∞) ⊇ (1,+∞)
        test('(1,+∞) ⊇ (1,+∞)', () => {
            const outer = Range.greaterThan(1);
            const inner = Range.greaterThan(1);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (-∞,2] ⊇ [1,2]
        test('(-∞,2] ⊇ [1,2]', () => {
            const outer = Range.atMost<number>(2);
            const inner = Range.closed<number>(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (-∞,2] ⊇ (-∞,2]'
        test('(-∞,2] ⊇ (-∞,2]', () => {
            const outer = Range.atMost(2);
            const inner = Range.atMost(2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (-∞,2) ⊇ (1,2)
        test('(-∞,2) ⊇ (1,2)', () => {
            const outer = Range.lessThan<number>(2);
            const inner = Range.open<number>(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (-∞,2) ⊇ (-∞,2)
        test('(-∞,2) ⊇ (-∞,2)', () => {
            const outer = Range.lessThan(2);
            const inner = Range.lessThan(2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (-∞,+∞) ⊇ [1,2]
        test('(-∞,+∞) ⊇ [1,2]', () => {
            const outer = Range.all();
            const inner = Range.closed(1, 2);
            expect(outer.encloses(inner)).toBe(true);
        });

        // (-∞,+∞) ⊇ (-∞,+∞)
        test('(-∞,+∞) ⊇ (-∞,+∞)', () => {
            const outer = Range.all();
            const inner = Range.all();
            expect(outer.encloses(inner)).toBe(true);
        });

        // 포함하지 않음 사례들
        // [1,2) ⊉ [1,2]
        test('[1,2) ⊉ [1,2]', () => {
            const outer = Range.closedOpen(1, 2);
            const inner = Range.closed(1, 2);
            expect(outer.encloses(inner)).toBe(false);
        });

        // (1,2] ⊉ [1,2]
        test('(1,2] ⊉ [1,2]', () => {
            const outer = Range.openClosed(1, 2);
            const inner = Range.closed(1, 2);
            expect(outer.encloses(inner)).toBe(false);
        });

        // (1,2) ⊉ [1,2]
        test('(1,2) ⊉ [1,2]', () => {
            const outer = Range.open(1, 2);
            const inner = Range.closed(1, 2);
            expect(outer.encloses(inner)).toBe(false);
        });

        // [1,2] ⊉ [1,+∞)
        test('[1,2] ⊉ [1,+∞)', () => {
            const outer = Range.closed(1, 2);
            const inner = Range.atLeast(1);
            expect(outer.encloses(inner)).toBe(false);
        });

        // (1,+∞) ⊉ [1,2]
        test('(1,+∞) ⊉ [1,2]', () => {
            const outer = Range.greaterThan<number>(1);
            const inner = Range.closed<number>(1, 2);
            expect(outer.encloses(inner)).toBe(false);
        });

        // (-∞,2) ⊉ [1,2]
        test('(-∞,2) ⊉ [1,2]', () => {
            const outer = Range.lessThan<number>(2);
            const inner = Range.closed<number>(1, 2);
            expect(outer.encloses(inner)).toBe(false);
        });

        test('∅ ⊇ [1,2]', () => {
            const outer = Range.closed(2, 1); // ∅
            const inner = Range.closed(1, 2);
            expect(outer.isEmpty()).toBe(true);
            expect(outer.encloses(inner)).toBe(false);
        });

        // [1,2] ⊇ ∅
        test('[1,2] ⊇ ∅', () => {
            const outer = Range.closed(1, 2);
            const inner = Range.closed(2, 1); // ∅
            expect(inner.isEmpty()).toBe(true);
            expect(outer.encloses(inner)).toBe(true);
        });

        // ∅ ⊇ ∅
        test('∅ ⊇ ∅', () => {
            const outer = Range.closed(2, 1); // ∅
            const inner = Range.closed(2, 1); // ∅
            expect(outer.isEmpty()).toBe(true);
            expect(inner.isEmpty()).toBe(true);
            expect(outer.encloses(inner)).toBe(true);
        });

        // ∅ ⊇ [2,3]
        test('∅ ⊇ [2,3]', () => {
            const outer = Range.closed(3, 2); // ∅
            const inner = Range.closed(2, 3);
            expect(outer.isEmpty()).toBe(true);
            expect(outer.encloses(inner)).toBe(false);
        });

        // ∅ ⊉ [1,2]
        test('∅ ⊉ [1,2]', () => {
            const outer = Range.closed(2, 1); // ∅
            const inner = Range.closed(1, 2);
            expect(outer.isEmpty()).toBe(true);
            expect(outer.encloses(inner)).toBe(false);
        });
    });

    describe('Range equals', () => {
        // [1,2] = [1,2]
        test('[1,2] = [1,2]', () => {
            const range1 = Range.closed(1, 2);
            const range2 = Range.closed(1, 2);
            expect(range1.equals(range2)).toBe(true);
        });

        // (1,2) = (1,2)
        test('(1,2) = (1,2)', () => {
            const range1 = Range.open(1, 2);
            const range2 = Range.open(1, 2);
            expect(range1.equals(range2)).toBe(true);
        });

        // [1,2) = [1,2)
        test('[1,2) = [1,2)', () => {
            const range1 = Range.closedOpen(1, 2);
            const range2 = Range.closedOpen(1, 2);
            expect(range1.equals(range2)).toBe(true);
        });

        // (1,2] = (1,2]
        test('(1,2] = (1,2]', () => {
            const range1 = Range.openClosed(1, 2);
            const range2 = Range.openClosed(1, 2);
            expect(range1.equals(range2)).toBe(true);
        });

        // ∅ = ∅
        test('∅ = ∅', () => {
            const range1 = Range.closed<number>(2, 1); // ∅
            const range2 = Range.closed<number>(3, 2); // ∅
            expect(range1.isEmpty()).toBe(true);
            expect(range2.isEmpty()).toBe(true);
            expect(range1.equals(range2)).toBe(true);
        });

        // [1,2] ≠ (1,2)
        test('[1,2] ≠ (1,2)', () => {
            const range1 = Range.closed(1, 2);
            const range2 = Range.open(1, 2);
            expect(range1.equals(range2)).toBe(false);
        });

        // [1,2] ≠ [1,3]
        test('[1,2] ≠ [1,3]', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.closed<number>(1, 3);
            expect(range1.equals(range2)).toBe(false);
        });

        // [1,2] ≠ [0,2]
        test('[1,2] ≠ [0,2]', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.closed<number>(0, 2);
            expect(range1.equals(range2)).toBe(false);
        });

        // [1,2) ≠ [1,2]
        test('[1,2) ≠ [1,2]', () => {
            const range1 = Range.closedOpen(1, 2);
            const range2 = Range.closed(1, 2);
            expect(range1.equals(range2)).toBe(false);
        });

        // ∅ ≠ [1,2]
        test('∅ ≠ [1,2]', () => {
            const emptyRange = Range.closed(2, 1); // ∅
            const nonEmptyRange = Range.closed(1, 2);
            expect(emptyRange.isEmpty()).toBe(true);
            expect(nonEmptyRange.isEmpty()).toBe(false);
            expect(emptyRange.equals(nonEmptyRange)).toBe(false);
        });

        // [1,2] ≠ ∅
        test('[1,2] ≠ ∅', () => {
            const nonEmptyRange = Range.closed(1, 2);
            const emptyRange = Range.closed(2, 1); // ∅
            expect(nonEmptyRange.isEmpty()).toBe(false);
            expect(emptyRange.isEmpty()).toBe(true);
            expect(nonEmptyRange.equals(emptyRange)).toBe(false);
        });

        // [1,+∞) ≠ (1,+∞)
        test('[1,+∞) ≠ (1,+∞)', () => {
            const range1 = Range.atLeast(1);
            const range2 = Range.greaterThan(1);
            expect(range1.equals(range2)).toBe(false);
        });

        // (-∞,2] ≠ (-∞,2)
        test('(-∞,2] ≠ (-∞,2)', () => {
            const range1 = Range.atMost(2);
            const range2 = Range.lessThan(2);
            expect(range1.equals(range2)).toBe(false);
        });

        // (-∞,+∞) = (-∞,+∞)
        test('(-∞,+∞) = (-∞,+∞)', () => {
            const range1 = Range.all();
            const range2 = Range.all();
            expect(range1.equals(range2)).toBe(true);
        });

        // ∅ = ∅ (무한대 경계를 가진 경우)
        test('∅ = ∅ (무한대 경계)', () => {
            const range1 = Range.empty<number>();
            const range2 = Range.empty<number>();
            expect(range1.isEmpty()).toBe(true);
            expect(range2.isEmpty()).toBe(true);
            expect(range1.equals(range2)).toBe(true);
        });

        // ∅ ≠ (-∞,+∞)
        test('∅ ≠ (-∞,+∞)', () => {
            const emptyRange = Range.empty<number>(); // ∅
            const nonEmptyRange = Range.all<number>();
            expect(emptyRange.isEmpty()).toBe(true);
            expect(nonEmptyRange.isEmpty()).toBe(false);
            expect(emptyRange.equals(nonEmptyRange)).toBe(false);
        });
    });

    describe('Range union', () => {
        // [1,3] ∪ [2,4] = [1,4]
        test('[1,3] ∪ [2,4] = [1,4]', () => {
            const range1 = Range.closed<number>(1, 3);
            const range2 = Range.closed<number>(2, 4);
            const expected = Range.closed<number>(1, 4);
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // (1,3) ∪ [3,5) = (1,5)
        test('(1,3) ∪ [3,5) = (1,5)', () => {
            const range1 = Range.open<number>(1, 3);
            const range2 = Range.closedOpen<number>(3, 5);
            const expected = Range.open<number>(1, 5);
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2] ∪ [2,3] = [1,3]
        test('[1,2] ∪ [2,3] = [1,3]', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.closed<number>(2, 3);
            const expected = Range.closed<number>(1, 3);
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // (1,2) ∪ (2,3) ⇒ RangeError
        test('(1,2) ∪ (2,3) ⇒ RangeError', () => {
            const range1 = Range.open<number>(1, 2);
            const range2 = Range.open<number>(2, 3);
            expect(() => range1.union(range2)).toThrow(RangeError);
        });

        // [1,2] ∪ [3,4] ⇒ RangeError
        test('[1,2] ∪ [3,4] ⇒ RangeError', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.closed<number>(3, 4);
            expect(() => range1.union(range2)).toThrow(RangeError);
        });

        // (1,2) ∪ (3,4) ⇒ RangeError
        test('(1,2) ∪ (3,4) ⇒ RangeError', () => {
            const range1 = Range.open<number>(1, 2);
            const range2 = Range.open<number>(3, 4);
            expect(() => range1.union(range2)).toThrow(RangeError);
        });

        // [1,5] ∪ ∅ = [1,5]
        test('[1,5] ∪ ∅ = [1,5]', () => {
            const range1 = Range.closed<number>(1, 5);
            const emptyRange = Range.closed<number>(2, 1); // ∅
            const result = range1.union(emptyRange);
            // console.log(result.equals(range1));
            
            expect(result.equals(range1)).toBe(true);
        });

        // ∅ ∪ [2,6] = [2,6]
        test('∅ ∪ [2,6] = [2,6]', () => {
            const emptyRange = Range.closed<number>(2, 1); // ∅
            const range2 = Range.closed<number>(2, 6);
            const result = emptyRange.union(range2);
            expect(result.equals(range2)).toBe(true);
        });

        // ∅ ∪ ∅ = ∅
        test('∅ ∪ ∅ = ∅', () => {
            const emptyRange1 = Range.closed<number>(2, 1); // ∅
            const emptyRange2 = Range.closed<number>(3, 2); // ∅
            const result = emptyRange1.union(emptyRange2);
            expect(result.isEmpty()).toBe(true);
        });

        // (-∞,2) ∪ (1,+∞) = (-∞,+∞)
        test('(-∞,2) ∪ (1,+∞) = (-∞,+∞)', () => {
            const range1 = Range.lessThan<number>(2);
            const range2 = Range.greaterThan<number>(1);
            const expected = Range.all<number>();
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2] ∪ [2,+∞) = [1,+∞)
        test('[1,2] ∪ [2,+∞) = [1,+∞)', () => {
            const range1 = Range.closed(1, 2);
            const range2 = Range.atLeast(2);
            const expected = Range.atLeast(1);
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2) ∪ [2,3] = [1,3]
        test('[1,2) ∪ [2,3] = [1,3]', () => {
            const range1 = Range.closedOpen<number>(1, 2);
            const range2 = Range.closed<number>(2, 3);
            const expected = Range.closed<number>(1, 3);
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1, 2] ∪ (2, 3) = [1, 3)
        test('[1, 2] ∪ (2, 3) = [1, 3)', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.open<number>(2, 3);
            const expected = Range.closedOpen<number>(1, 3);
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });
    });

    describe('Range intersection', () => {
        // [1,3] ∩ [2,4] = [2,3]
        test('[1,3] ∩ [2,4] = [2,3]', () => {
            const range1 = Range.closed<number>(1, 3);
            const range2 = Range.closed<number>(2, 4);
            const expected = Range.closed<number>(2, 3);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // (1,3) ∩ [2,4) = [2,3)
        test('(1,3) ∩ [2,4) = [2,3)', () => {
            const range1 = Range.open<number>(1, 3);
            const range2 = Range.closedOpen<number>(2, 4);
            const expected = Range.closedOpen<number>(2, 3);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2] ∩ [3,4] = ∅
        test('[1,2] ∩ [3,4] = ∅', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.closed<number>(3, 4);
            const result = range1.intersection(range2);
            expect(result.isEmpty()).toBe(true);
        });

        // (1,2) ∩ (2,3) = ∅
        test('(1,2) ∩ (2,3) = ∅', () => {
            const range1 = Range.open<number>(1, 2);
            const range2 = Range.open<number>(2, 3);
            const result = range1.intersection(range2);
            expect(result.isEmpty()).toBe(true);
        });

        // [1,2] ∩ [2,3] = {2}
        test('[1,2] ∩ [2,3] = {2}', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.closed<number>(2, 3);
            const expected = Range.closed<number>(2, 2);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2) ∩ [2,3) = ∅
        test('[1,2) ∩ [2,3) = ∅', () => {
            const range1 = Range.closedOpen<number>(1, 2);
            const range2 = Range.closedOpen<number>(2, 3);
            const result = range1.intersection(range2);
            expect(result.isEmpty()).toBe(true);
        });

        // (-∞,2) ∩ (1,+∞) = (1,2)
        test('(-∞,2) ∩ (1,+∞) = (1,2)', () => {
            const range1 = Range.lessThan<number>(2);
            const range2 = Range.greaterThan<number>(1);
            const expected = Range.open<number>(1, 2);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // (-∞,2] ∩ [2,+∞) = {2}
        test('(-∞,2] ∩ [2,+∞) = {2}', () => {
            const range1 = Range.atMost(2);
            const range2 = Range.atLeast(2);
            const expected = Range.closed(2, 2);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,5] ∩ ∅ = ∅
        test('[1,5] ∩ ∅ = ∅', () => {
            const range1 = Range.closed<number>(1, 5);
            const emptyRange = Range.closed<number>(2, 1); // ∅
            const result = range1.intersection(emptyRange);
            expect(result.isEmpty()).toBe(true);
        });

        // ∅ ∩ [2,6] = ∅
        test('∅ ∩ [2,6] = ∅', () => {
            const emptyRange = Range.closed<number>(3, 2); // ∅
            const range2 = Range.closed<number>(2, 6);
            const result = emptyRange.intersection(range2);
            expect(result.isEmpty()).toBe(true);
        });

        // ∅ ∩ ∅ = ∅
        test('∅ ∩ ∅ = ∅', () => {
            const emptyRange1 = Range.closed<number>(2, 1); // ∅
            const emptyRange2 = Range.closed<number>(3, 2); // ∅
            const result = emptyRange1.intersection(emptyRange2);
            expect(result.isEmpty()).toBe(true);
        });

        // (-∞,+∞) ∩ [1,2] = [1,2]
        test('(-∞,+∞) ∩ [1,2] = [1,2]', () => {
            const range1 = Range.all();
            const range2 = Range.closed(1, 2);
            const expected = Range.closed(1, 2);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // (-∞,0) ∩ (0,+∞) = ∅
        test('(-∞,0) ∩ (0,+∞) = ∅', () => {
            const range1 = Range.lessThan(0);
            const range2 = Range.greaterThan(0);
            const result = range1.intersection(range2);
            expect(result.isEmpty()).toBe(true);
        });

        // (-∞,0] ∩ [0,+∞) = {0}
        test('(-∞,0] ∩ [0,+∞) = {0}', () => {
            const range1 = Range.atMost(0);
            const range2 = Range.atLeast(0);
            const expected = Range.closed(0, 0);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2] ∩ [1,2] = [1,2]
        test('[1,2] ∩ [1,2] = [1,2]', () => {
            const range1 = Range.closed(1, 2);
            const range2 = Range.closed(1, 2);
            const expected = Range.closed(1, 2);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,5] ∩ [2,3] = [2,3]
        test('[1,5] ∩ [2,3] = [2,3]', () => {
            const range1 = Range.closed<number>(1, 5);
            const range2 = Range.closed<number>(2, 3);
            const expected = Range.closed<number>(2, 3);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // (1,2] ∩ [2,3] = {2}
        test('(1,2] ∩ [2,3] = {2}', () => {
            const range1 = Range.openClosed<number>(1, 2);
            const range2 = Range.closed<number>(2, 3);
            const expected = Range.closed<number>(2, 2);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2) ∩ (2,3] = ∅
        test('[1,2) ∩ (2,3] = ∅', () => {
            const range1 = Range.closedOpen<number>(1, 2);
            const range2 = Range.openClosed<number>(2, 3);
            const result = range1.intersection(range2);
            expect(result.isEmpty()).toBe(true);
        });
    });

    describe('Range disjoint', () => {
        // [1,3] ∩ [2,4] ≠ ∅ (겹침) ⇒ disjoint = false
        test('[1,3] ∩ [2,4] ≠ ∅ ⇒ disjoint = false', () => {
            const range1 = Range.closed<number>(1, 3);
            const range2 = Range.closed<number>(2, 4);
            expect(range1.isdisjoint(range2)).toBe(false);
        });

        // [1,2] ∩ [2,3] ≠ ∅ (인접) ⇒ disjoint = false
        test('[1,2] ∩ [2,3] ≠ ∅ ⇒ disjoint = false', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.closed<number>(2, 3);
            expect(range1.isdisjoint(range2)).toBe(false);
        });

        // (1,2) ∩ (2,3) = ∅ ⇒ disjoint = true
        test('(1,2) ∩ (2,3) = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.open<number>(1, 2);
            const range2 = Range.open<number>(2, 3);
            expect(range1.isdisjoint(range2)).toBe(true);
        });

        // [1,2) ∩ [2,3) = ∅ ⇒ disjoint = true
        test('[1,2) ∩ [2,3) = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.closedOpen<number>(1, 2);
            const range2 = Range.closedOpen<number>(2, 3);
            expect(range1.isdisjoint(range2)).toBe(true);
        });

        // [1,2] ∩ [3,4] = ∅ ⇒ disjoint = true
        test('[1,2] ∩ [3,4] = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.closed<number>(3, 4);
            expect(range1.isdisjoint(range2)).toBe(true);
        });

        // (-∞,2) ∩ (2,+∞) = ∅ ⇒ disjoint = true
        test('(-∞,2) ∩ (2,+∞) = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.lessThan(2);
            const range2 = Range.greaterThan(2);
            expect(range1.isdisjoint(range2)).toBe(true);
        });

        // (-∞,2] ∩ [2,+∞) = {2} ⇒ disjoint = false
        test('(-∞,2] ∩ [2,+∞) ≠ ∅ ⇒ disjoint = false', () => {
            const range1 = Range.atMost(2);
            const range2 = Range.atLeast(2);
            expect(range1.isdisjoint(range2)).toBe(false);
        });

        // 공집합과의 경우
        // [1,3] ∩ ∅ = ∅ ⇒ disjoint = true
        test('[1,3] ∩ ∅ = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.closed<number>(1, 3);
            const emptyRange = Range.closed<number>(2, 1); // ∅
            expect(range1.isdisjoint(emptyRange)).toBe(true);
        });

        // ∅ ∩ [2,4] = ∅ ⇒ disjoint = true
        test('∅ ∩ [2,4] = ∅ ⇒ disjoint = true', () => {
            const emptyRange = Range.closed<number>(3, 2); // ∅
            const range2 = Range.closed<number>(2, 4);
            expect(emptyRange.isdisjoint(range2)).toBe(true);
        });

        // ∅ ∩ ∅ = ∅ ⇒ disjoint = true
        test('∅ ∩ ∅ = ∅ ⇒ disjoint = true', () => {
            const emptyRange1 = Range.closed<number>(2, 1); // ∅
            const emptyRange2 = Range.closed<number>(3, 2); // ∅
            expect(emptyRange1.isdisjoint(emptyRange2)).toBe(true);
        });

        // 전체 범위와의 경우
        // (-∞,+∞) ∩ [1,2] ≠ ∅ ⇒ disjoint = false
        test('(-∞,+∞) ∩ [1,2] ≠ ∅ ⇒ disjoint = false', () => {
            const range1 = Range.all();
            const range2 = Range.closed(1, 2);
            expect(range1.isdisjoint(range2)).toBe(false);
        });

        // (-∞,0) ∩ (0,+∞) = ∅ ⇒ disjoint = true
        test('(-∞,0) ∩ (0,+∞) = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.lessThan(0);
            const range2 = Range.greaterThan(0);
            expect(range1.isdisjoint(range2)).toBe(true);
        });

        // 동일한 범위
        // [1,2] ∩ [1,2] ≠ ∅ ⇒ disjoint = false
        test('[1,2] ∩ [1,2] ≠ ∅ ⇒ disjoint = false', () => {
            const range1 = Range.closed(1, 2);
            const range2 = Range.closed(1, 2);
            expect(range1.isdisjoint(range2)).toBe(false);
        });

        // 포함 관계
        // [1,5] ∩ [2,3] ≠ ∅ ⇒ disjoint = false
        test('[1,5] ∩ [2,3] ≠ ∅ ⇒ disjoint = false', () => {
            const range1 = Range.closed<number>(1, 5);
            const range2 = Range.closed<number>(2, 3);
            expect(range1.isdisjoint(range2)).toBe(false);
        });

        // 경계점이 겹치는 경우
        // [1,2] ∩ (2,3] = ∅ ⇒ disjoint = true
        test('[1,2] ∩ (2,3] = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.closed<number>(1, 2);
            const range2 = Range.openClosed<number>(2, 3);
            expect(range1.isdisjoint(range2)).toBe(true);
        });

        // [1,2) ∩ (2,3] = ∅ ⇒ disjoint = true
        test('[1,2) ∩ (2,3] = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.closedOpen<number>(1, 2);
            const range2 = Range.openClosed<number>(2, 3);
            expect(range1.isdisjoint(range2)).toBe(true);
        });

        // (1,2] ∩ [2,3] ≠ ∅ ⇒ disjoint = false
        test('(1,2] ∩ [2,3] ≠ ∅ ⇒ disjoint = false', () => {
            const range1 = Range.openClosed<number>(1, 2);
            const range2 = Range.closed<number>(2, 3);
            expect(range1.isdisjoint(range2)).toBe(false);
        });

        // [1,2) ∩ [2,3] = ∅ ⇒ disjoint = true
        test('[1,2) ∩ [2,3] = ∅ ⇒ disjoint = true', () => {
            const range1 = Range.closedOpen<number>(1, 2);
            const range2 = Range.closed<number>(2, 3);
            expect(range1.isdisjoint(range2)).toBe(true);
        });
    });

    describe('Range toIntRange', () => {
        // (4.5, 7.3) -> [5, 7]
        test('(4.5, 7.3) -> [5, 7]', () => {
            const range = Range.open(4.5, 7.3);
            const simplified = range.toIntRange();
            const expected = IntRange.closed(5n, 7n);

            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('[5..7]');
        });

        // (4, 7.3) -> (4, 7]
        test('(4, 7.3) -> (4, 7]', () => {
            const range = Range.open(4, 7.3);
            const simplified = range.toIntRange();
            const expected = IntRange.new(BoundType.OPEN, 4n, 7n, BoundType.CLOSED);

            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('(4..7]');
        });

        // (4.5, 7) -> [5, 7)
        test('(4.5, 7) -> [5, 7)', () => {
            const range = Range.open(4.5, 7);
            const simplified = range.toIntRange();
            const expected = IntRange.new(BoundType.CLOSED, 5n, 7n, BoundType.OPEN);

            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('[5..7)');
        });

        // (4, 7) -> (4, 7)
        test('(4, 7) -> (4, 7)', () => {
            const range = Range.open(4, 7);
            const simplified = range.toIntRange();
            const expected = IntRange.new(BoundType.OPEN, 4n, 7n, BoundType.OPEN);

            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('(4..7)');
        });

        // Empty range: [5, 3] -> ∅
        test('[5, 3] -> ∅', () => {
            const range = Range.closed(5, 3);
            const simplified = range.toIntRange();
            expect(simplified.isEmpty()).toBe(true);
            expect(simplified.toString()).toBe('∅');
        });

        // Infinite range: (-∞, +∞) -> (-∞, +∞)
        test('(-∞, +∞) -> (-∞, +∞)', () => {
            const range = Range.all<number>();
            const simplified = range.toIntRange();
            const expected = IntRange.all();
            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('ℤ');
        });

        // Range with infinite upper bound: [5, +∞) -> [5, +∞)
        test('[5, +∞) -> [5, +∞)', () => {
            const range = Range.atLeast(5);
            const simplified = range.toIntRange();
            const expected = IntRange.atLeast(5n);
            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('[5..+∞)');
        });

        // Range with infinite lower bound: (-∞, 5) -> (-∞, 5)
        test('(-∞, 5) -> (-∞, 5)', () => {
            const range = Range.lessThan(5);
            const simplified = range.toIntRange();
            const expected = IntRange.lessThan(5n);
            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('(-∞..5)');
        });

        // Range with infinite upper bound and decimal lower bound: (4.5, +∞) -> [5, +∞)
        test('(4.5, +∞) -> [5, +∞)', () => {
            const range = Range.greaterThan(4.5);
            const simplified = range.toIntRange();
            const expected = IntRange.atLeast(5n);        
            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('[5..+∞)');
        });

        // Range with infinite lower bound and decimal upper bound: (-∞, 7.3) -> (-∞, 7]
        test('(-∞, 7.3) -> (-∞, 7]', () => {
            const range = Range.lessThan(7.3);
            const simplified = range.toIntRange();
            const expected = IntRange.atMost(7n);
            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('(-∞..7]');
        });

        // Empty range with infinite bounds: (+∞, -∞) -> ∅
        test('(+∞, -∞) -> ∅', () => {
            const range = Range.empty<number>();
            const simplified = range.toIntRange();
            expect(simplified.isEmpty()).toBe(true);
            expect(simplified.toString()).toBe('∅');
        });

        // Single point range: [5,5] -> [5,5]
        test('[5,5] -> [5,5]', () => {
            const range = Range.closed(5, 5);
            const simplified = range.toIntRange();
            const expected = IntRange.closed(5n, 5n);
            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('{5}');
        });

        // Range with decimal bounds resulting in empty range after toIntRange: (5.5, 5.9) -> ∅
        test('(5.5, 5.9) -> ∅', () => {
            const range = Range.open(5.5, 5.9);
            const simplified = range.toIntRange();
            expect(simplified.isEmpty()).toBe(true);
            expect(simplified.toString()).toBe('∅');
        });

        // Range with both infinite bounds and decimal values: (-∞, 7.3) -> (-∞, 7]
        test('(-∞, 7.3) -> (-∞, 7]', () => {
            const range = Range.lessThan(7.3);
            const simplified = range.toIntRange();
            const expected = IntRange.atMost(7n);
            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('(-∞..7]');
        });
    });

    describe('Range size', () => {
        test('Empty range has size 0', () => {
            const range = Range.closed(2, 1); // Empty range
            expect(range.isEmpty()).toBe(true);
            expect(range.size).toBe(0);
        });

        test('Range with lower === upper has size 0', () => {
            const range = Range.closed(5, 5);
            expect(range.size).toBe(0);
        });

        test('Infinite range (-∞, ∞) has size Infinity', () => {
            const range = Range.all<number>();
            expect(range.size).toBe(Infinity);
        });

        test('Range with infinite lower bound has size Infinity', () => {
            const range = Range.lessThan(10);
            expect(range.size).toBe(Infinity);
        });

        test('Range with infinite upper bound has size Infinity', () => {
            const range = Range.atLeast(5);
            expect(range.size).toBe(Infinity);
        });

        test('Finite range [1, 5] has size 4', () => {
            const range = Range.closed(1, 5);
            expect(range.size).toBe(4);
        });

        test('Open range (1, 5) has size 4', () => {
            const range = Range.open(1, 5);
            expect(range.size).toBe(4);
        });

        test('Range with numbers', () => {
            const range = Range.closed(1.5, 3.5);
            expect(range.size).toBe(2);
        });

        test('Range with bigints', () => {
            const range = Range.closed(BigInt(1), BigInt(5));
            expect(range.size).toBe(4n);
        });

        test('Range with Dates', () => {
            const date1 = new Date('2020-01-01');
            const date2 = new Date('2020-01-05');
            const range = Range.closed(date1, date2);
            expect(range.size).toBe(date2.getTime() - date1.getTime());
        });

        test('Range with unsupported type throws TypeError', () => {
            const range = Range.closed({} as any, {} as any);
            expect(() => range.size).toThrow(TypeError);
        });
    });

    describe('Range toString', () => {
        test('Empty range', () => {
            const range = Range.closed(2, 1); // Empty range
            expect(range.toString()).toBe('∅');
        });

        test('Infinite range (-∞, ∞)', () => {
            const range = Range.all<number>();
            expect(range.toString()).toBe('ℝ');
        });

        test('Range [0, ∞)', () => {
            const range = Range.atLeast(0);
            expect(range.toString()).toBe('ℝ⁺');
        });

        test('Range (0, ∞)', () => {
            const range = Range.greaterThan(0);
            expect(range.toString()).toBe('ℝ⁺');
        });

        test('Range (-∞, 0]', () => {
            const range = Range.atMost(0);
            expect(range.toString()).toBe('ℝ⁻');
        });

        test('Range (-∞, 0)', () => {
            const range = Range.lessThan(0);
            expect(range.toString()).toBe('ℝ⁻');
        });

        test('Range where lower === upper', () => {
            const range = Range.closed(5, 5);
            expect(range.toString()).toBe('{5}');
        });

        test('Finite range [1, 5]', () => {
            const range = Range.closed(1, 5);
            expect(range.toString()).toBe('[1, 5]');
        });

        test('Open range (1, 5)', () => {
            const range = Range.open(1, 5);
            expect(range.toString()).toBe('(1, 5)');
        });

        test('Mixed bounds range [1, 5)', () => {
            const range = Range.closedOpen(1, 5);
            expect(range.toString()).toBe('[1, 5)');
        });

        test('Range with infinite lower bound (-∞, 5]', () => {
            const range = Range.atMost(5);
            expect(range.toString()).toBe('(-∞, 5]');
        });

        test('Range with infinite upper bound [5, ∞)', () => {
            const range = Range.atLeast(5);
            expect(range.toString()).toBe('[5, +∞)');
        });

        // TODO: 문자열도 지원할 만 한가? charCodeAt
        // test('Range with custom types', () => {
        //     const range = Range.closed('a', 'z');
        //     expect(range.toString()).toBe('[a, z]');
        // });
    });
});

describe('IntRange', () => {   
    describe('IntRange constructor', () => {
        test('[1, 3]', () => {
            const ret = IntRange.closed(1n, 3n);
            const expected = IntRange.new(BoundType.CLOSED, 1n, 3n, BoundType.CLOSED);
            expect(ret).toEqual(expected);
            expect(ret.toString()).toBe('[1..3]');
        });

        test('(1, 3)', () => {
            const ret = IntRange.open(1n, 3n);
            expect(ret).toEqual(IntRange.new(BoundType.OPEN, 1n, 3n, BoundType.OPEN));
            expect(ret.toString()).toBe('{2}');
        });

        test('[1, 3)', () => {
            const ret = IntRange.closedOpen(1n, 3n);
            expect(ret).toEqual(IntRange.new(BoundType.CLOSED, 1n, 3n, BoundType.OPEN));
            expect(ret.toString()).toBe('[1..3)');
        });

        test('(1, 3]', () => {
            const ret = IntRange.openClosed(1n, 3n);
            expect(ret).toEqual(IntRange.new(BoundType.OPEN, 1n, 3n, BoundType.CLOSED));
            expect(ret.toString()).toBe('(1..3]');
        });

        test('[1, +∞)', () => {
            const ret = IntRange.atLeast(1n);
            const expected = IntRange.new(BoundType.CLOSED, 1n, inf, BoundType.OPEN);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℤ⁺');
        });

        test('(0, +∞)', () => {
            const ret = IntRange.greaterThan(0n);
            const expected = IntRange.new(BoundType.OPEN, 0n, inf, BoundType.OPEN);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℤ⁺');
        });

        test('(1, +∞)', () => {
            const ret = IntRange.greaterThan(1n);
            const expected = IntRange.new(BoundType.OPEN, 1n, inf, BoundType.OPEN);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('(1..+∞)');
        });

        test('(-∞, 3]', () => {
            const ret = IntRange.atMost(3n);
            const expected = IntRange.new(BoundType.OPEN, ninf, 3n, BoundType.CLOSED, -1n);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('(-∞..3]');
        });

        test('(-∞, 0)', () => {
            const ret = IntRange.lessThan(0n);
            const expected = IntRange.new(BoundType.OPEN, ninf, 0n, BoundType.OPEN, -1n);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℤ⁻');
        });

        test('(-∞, -1]', () => {
            const ret = IntRange.atMost(-1n);
            const expected = IntRange.new(BoundType.OPEN, ninf, -1n, BoundType.CLOSED, -1n);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℤ⁻');
        });

        test('(-∞, 3)', () => {
            const ret = IntRange.lessThan(3n);
            const expected = IntRange.new(BoundType.OPEN, ninf, 3n, BoundType.OPEN, -1n);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('(-∞..3)');
        });

        test('(-∞, +∞)', () => {
            const ret = IntRange.all();
            const expected = IntRange.all();
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℤ');
        });

        test('invalid [-∞, 3]', () => {
            expect(() => IntRange.new(BoundType.CLOSED, ninf, 3n, BoundType.CLOSED)).toThrow(RangeError);
        });

        test('invalid (1, +∞]', () => {
            expect(() => IntRange.new(BoundType.OPEN, 1n, inf, BoundType.CLOSED)).toThrow(RangeError);
        });
    });

    describe('IntRange isEmpty', () => {
        test('[3, 2]', () => {
            expect(IntRange.closed(3n, 2n).isEmpty()).toBe(true);
        });

        test('(3, 2]', () => {
            expect(IntRange.openClosed(3n, 2n).isEmpty()).toBe(true);
        });

        test('[3, 2)', () => {
            expect(IntRange.closedOpen(3n, 2n).isEmpty()).toBe(true);
        });

        test('(3, 2)', () => {
            expect(IntRange.open(3n, 2n).isEmpty()).toBe(true);
        });

        test('[3, 3]', () => {
            expect(IntRange.closed(3n, 3n).isEmpty()).toBe(false);
        });

        test('(3, 3]', () => {
            expect(IntRange.openClosed(3n, 3n).isEmpty()).toBe(true);
        });

        test('[3, 3)', () => {
            expect(IntRange.closedOpen(3n, 3n).isEmpty()).toBe(true);
        });

        test('(3, 3)', () => {
            expect(IntRange.open(3n, 3n).isEmpty()).toBe(true);
        });

        // 공집합 예제들
        test('[2, 1] = ∅', () => {
            expect(IntRange.closed(2n, 1n).isEmpty()).toBe(true);
        });

        test('(2, 1] = ∅', () => {
            expect(IntRange.openClosed(2n, 1n).isEmpty()).toBe(true);
        });

        test('[2, 1) = ∅', () => {
            expect(IntRange.closedOpen(2n, 1n).isEmpty()).toBe(true);
        });

        test('(2, 1) = ∅', () => {
            expect(IntRange.open(2n, 1n).isEmpty()).toBe(true);
        });

        test('(+∞, -∞) = ∅', () => {
            expect(Range.empty<number>().isEmpty()).toBe(true);
        });
    });

    describe('IntRange includes', () => {
        test('범위 [1, 5]에 3 포함', () => {
            const range = IntRange.closed(1n, 5n);
            expect(range.includes(3n)).toBe(true);
        });

        test('범위 [1, 5]에 0 포함 안됨', () => {
            const range = IntRange.closed(1n, 5n);
            expect(range.includes(0n)).toBe(false);
        });

        test('범위 (1, 5)에 1 포함 안됨', () => {
            const range = IntRange.open(1n, 5n);
            expect(range.includes(1n)).toBe(false);
        });

        test('범위 (1, 5)에 5 포함 안됨', () => {
            const range = IntRange.open(1n, 5n);
            expect(range.includes(5n)).toBe(false);
        });

        test('범위 [1, 5)에 5 포함 안됨', () => {
            const range = IntRange.closedOpen(1n, 5n);
            expect(range.includes(5n)).toBe(false);
        });

        test('범위 [1, 5)에 1 포함', () => {
            const range = IntRange.closedOpen(1n, 5n);
            expect(range.includes(1n)).toBe(true);
        });

        test('범위 (1, 5]에 5 포함', () => {
            const range = IntRange.openClosed(1n, 5n);
            expect(range.includes(5n)).toBe(true);
        });

        test('범위 (1, 5]에 1 포함 안됨', () => {
            const range = IntRange.openClosed(1n, 5n);
            expect(range.includes(1n)).toBe(false);
        });

        test('범위 (-∞, 5)에 3 포함', () => {
            const range = IntRange.lessThan(5n);
            expect(range.includes(3n)).toBe(true);
        });

        test('범위 (-∞, 5)에 5 포함 안됨', () => {
            const range = IntRange.lessThan(5n);
            expect(range.includes(5n)).toBe(false);
        });

        test('범위 [1, +∞)에 100 포함', () => {
            const range = IntRange.atLeast(1n);
            expect(range.includes(100n)).toBe(true);
        });

        test('범위 [1, +∞)에 0 포함 안됨', () => {
            const range = IntRange.atLeast(1n);
            expect(range.includes(0n)).toBe(false);
        });

        // 공집합 범위에 대한 포함 여부 테스트
        test('∅ includes 1', () => {
            const range = IntRange.closed(2n, 1n); // Empty range
            expect(range.isEmpty()).toBe(true);
            expect(range.includes(1n)).toBe(false);
        });

        test('∅ includes any number', () => {
            const range = IntRange.closed(2n, 1n); // Empty range
            expect(range.isEmpty()).toBe(true);
            expect(range.includes(0n)).toBe(false);
            expect(range.includes(100n)).toBe(false);
        });
    });

    describe('IntRange encloses', () => {
        // [1,2] ⊇ [1,2]
        test('[1,2] ⊇ [1,2]', () => {
            const outer = IntRange.closed(1n, 2n);
            const inner = IntRange.closed(1n, 2n);
            expect(outer.encloses(inner)).toBe(true);
        });

        test('(1,2] ⊉ [1,2]', () => {
            const outer = IntRange.openClosed(1n, 2n);
            const inner = IntRange.closed(1n, 2n);
            expect(outer.encloses(inner)).toBe(false);
        });
    });

    describe('IntRange union', () => {
        // [1,3] ∪ [2,4] = [1,4]
        test('[1,3] ∪ [2,4] = [1,4]', () => {
            const range1 = IntRange.closed(1n, 3n);
            const range2 = IntRange.closed(2n, 4n);
            const expected = IntRange.closed(1n, 4n);
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2] ∪ [2,3] = [1,3]
        test('[1,2] ∪ [2,3] = [1,3]', () => {
            const range1 = IntRange.closed(1n, 2n);
            const range2 = IntRange.closed(2n, 3n);
            const expected = IntRange.closed(1n, 3n);
            const result = range1.union(range2);
            expect(result.equals(expected)).toBe(true);
        });
    });

    describe('IntRange intersection', () => {
        // [1,3] ∩ [2,4] = [2,3]
        test('[1,3] ∩ [2,4] = [2,3]', () => {
            const range1 = IntRange.closed(1n, 3n);
            const range2 = IntRange.closed(2n, 4n);
            const expected = IntRange.closed(2n, 3n);
            const result = range1.intersection(range2);
            expect(result.equals(expected)).toBe(true);
        });

        // [1,2] ∩ [3,4] = ∅
        test('[1,2] ∩ [3,4] = ∅', () => {
            const range1 = IntRange.closed(1n, 2n);
            const range2 = IntRange.closed(3n, 4n);
            const result = range1.intersection(range2);
            expect(result.isEmpty()).toBe(true);
        });
    });

    describe('IntRange disjoint', () => {
        // [1,2] ∩ [3,4] = ∅ ⇒ disjoint = true
        test('[1,2] ∩ [3,4] = ∅ ⇒ disjoint = true', () => {
            const range1 = IntRange.closed(1n, 2n);
            const range2 = IntRange.closed(3n, 4n);
            expect(range1.isdisjoint(range2)).toBe(true);
        });
    });

    describe('IntRange toIntRange', () => {
        // [1, 2] should remain [1, 2]
        test('[1,2] -> [1,2]', () => {
            const range = IntRange.closed(1n, 2n);
            const simplified = range.toIntRange();
            const expected = IntRange.closed(1n, 2n);

            expect(simplified.equals(expected)).toBe(true);
            expect(simplified.toString()).toBe('[1..2]');
        });

        // Empty range: [5, 3] -> ∅
        test('[5, 3] -> ∅', () => {
            const range = IntRange.closed(5n, 3n);
            const simplified = range.toIntRange();
            expect(simplified.isEmpty()).toBe(true);
            expect(simplified.toString()).toBe('∅');
        });
    });

    describe('IntRange size', () => {
        test('Infinite range (-∞, ∞)', () => {
            const range = IntRange.all();
            expect(range.size).toBe(Infinity);
        });

        test('Infinite range [1, ∞)', () => {
            const range = IntRange.atLeast(1n);
            expect(range.size).toBe(Infinity);
        });

        test('Infinite range (-∞, -1]', () => {
            const range = IntRange.atMost(-1n);
            expect(range.size).toBe(Infinity);
        });

        test('Empty range', () => {
            const range = IntRange.closed(2n, 1n);
            expect(range.isEmpty()).toBe(true);
            expect(range.size).toBe(0n);
        });

        test('Finite range [1, 5]', () => {
            const range = IntRange.closed(1n, 5n);
            expect(range.size).toBe(5n);
        });

        // test for more finite ranges mix (, [, ], )
        test('Finite range (1, 5]', () => {
            const range = IntRange.openClosed(1n, 5n);
            expect(range.size).toBe(4n);
        });

        test('Finite range [1, 5)', () => {
            const range = IntRange.closedOpen(1n, 5n);
            expect(range.size).toBe(4n);
        });

        test('Finite range (1, 5)', () => {
            const range = IntRange.open(1n, 5n);
            expect(range.size).toBe(3n);
        });

        test('Finite range [1, 5], step 2', () => {
            const range = IntRange.closed(1n, 5n).steps(2n);
            expect(range.size).toBe(3n);
        });

        test('Finite range [1, 26], step 5', () => {
            const range = IntRange.closed(1n, 26n).steps(5n);
            expect(range.size).toBe(6n);
        });

        test('Finite range (1, 20], step 5', () => {
            const range = IntRange.openClosed(1n, 20n).steps(5n);
            expect(range.size).toBe(4n);
        });

        test('Finite range [1, 21), step 5', () => {
            const range = IntRange.closedOpen(1n, 21n).steps(5n);
            expect(range.size).toBe(4n);
        });

        test('Finite range (1, 18), step 5', () => {
            // 2 7 12 17
            const range = IntRange.open(1n, 18n).steps(5n);
            expect(range.size).toBe(4n);
        });

        test('Finite range (1, 17), step 5', () => {
            // 2 7 12 17(x)
            const range = IntRange.open(1n, 17n).steps(5n);
            expect(range.size).toBe(3n);
        });

        // test for negative steps
        test('Finite range [1, 5], step -2', () => {
            const range = IntRange.closed(1n, 5n).steps(-2n);
            expect(range.size).toBe(3n);
        });

        test('Finite range [1, 26], step -5', () => {
            const range = IntRange.closed(1n, 26n).steps(-5n);
            expect(range.size).toBe(6n);
        });

        test('Finite range (0, 20], step -5', () => {
            // 20 15 10 5
            const range = IntRange.openClosed(1n, 20n).steps(-5n);
            expect(range.size).toBe(4n);
        });

        test('Finite range [0, 20], step -5', () => {
            // 20 15 10 5 0
            const range = IntRange.closed(0n, 20n).steps(-5n);
            expect(range.size).toBe(5n);
        });

        test('Finite range [0, 20), step -5', () => {
            // 19 14 9 4
            const range = IntRange.closedOpen(0n, 20n).steps(-5n);
            expect(range.size).toBe(4n);
        });

        test('Range where step > 0 !== lowerIsStart', () => {
            const range = IntRange.new('[', 1n, 5n, ']', -1n, true);
            expect(range.size).toBe(0n);
        });

        test('Range where start > end with positive step', () => {
            const range = IntRange.closed(5n, 1n).steps(1n);
            expect(range.size).toBe(0n);
        });

        test('Range where start < end with negative step', () => {
            const range = IntRange.closed(1n, 5n).steps(-1n);
            expect(range.size).toBe(5n);
        });
    });

    describe('IntRange toString', () => {
        test('Empty range', () => {
            const range = IntRange.closed(2n, 1n);
            expect(range.toString()).toBe('∅');
        });

        test('Infinite range (-∞, ∞)', () => {
            const range = IntRange.all();
            expect(range.toString()).toBe('ℤ');
        });

        test('Infinite positive range ℤ⁺', () => {
            const range = IntRange.atLeast(1n);
            expect(range.toString()).toBe('ℤ⁺');
        });

        test('Infinite negative range ℤ⁻', () => {
            const range = IntRange.atMost(-1n);
            expect(range.toString()).toBe('ℤ⁻');
        });

        test('Range with size 1', () => {
            const range = IntRange.closed(5n, 5n);
            expect(range.toString()).toBe('{5}');
        });

        test('Finite range [1, 5]', () => {
            const range = IntRange.closed(1n, 5n);
            expect(range.toString()).toBe('[1..5]');
        });

        test('Range with step 2', () => {
            const range = IntRange.closed(1n, 5n).steps(2n);
            expect(range.toString()).toBe('[1..5] step 2');
        });

        test('Infinite range with step 2', () => {
            const range = IntRange.atLeast(1n).steps(2n);
            expect(range.toString()).toBe('2ℤ⁺');
        });

        test('Negative infinite range with step -2', () => {
            const range = IntRange.atMost(-1n).steps(-2n);
            expect(range.toString()).toBe('2ℤ⁻');
        });
    });

    describe('IntRange toClosedRange', () => {
        test('Finite closed range remains the same', () => {
            const range = IntRange.closed(1n, 5n);
            const closedRange = range.toClosedRange();
            expect(closedRange.equals(range)).toBe(true);
        });

        test('Finite open range converts to closed range', () => {
            const range = IntRange.open(1n, 5n);
            const closedRange = range.toClosedRange();
            const expected = IntRange.closed(2n, 4n);
            expect(closedRange.equals(expected)).toBe(true);
        });

        test('Range with infinite upper bound', () => {
            const range = IntRange.atLeast(1n);
            const closedRange = range.toClosedRange();
            const expected = IntRange.atLeast(1n);
            expect(closedRange.equals(expected)).toBe(true);
        });

        test('Range with infinite lower bound', () => {
            const range = IntRange.atMost(5n);
            const closedRange = range.toClosedRange();
            const expected = IntRange.atMost(5n);
            expect(closedRange.equals(expected)).toBe(true);
        });

        test('Empty range remains empty', () => {
            const range = IntRange.closed(5n, 3n); // Empty
            const closedRange = range.toClosedRange();
            expect(closedRange.isEmpty()).toBe(true);
        });

        test('Open range with single element', () => {
            const range = IntRange.open(4n, 6n);
            const closedRange = range.toClosedRange();
            const expected = IntRange.closed(5n, 5n);
            expect(closedRange.equals(expected)).toBe(true);
        });
    });

    describe('IntRange iterator', () => {
        test('IntRange generator', () => {
            const range = IntRange.closed(1n, 3n);
            const expected = [1n, 2n, 3n];
            const result: bigint[] = [];

            const it = range[Symbol.iterator]();
            let next;
            while ((next = it.next()).done === false) {
                result.push(next.value);
            }

            expect(result).toEqual(expected);
        });

        test('IntRange spread', () => {
            const range = IntRange.closed(1n, 3n);
            const expected = [1n, 2n, 3n];
            const result = [...range];
            expect(result).toEqual(expected);
        });

        test('IntRange Array.from', () => {
            const range = IntRange.closed(1n, 3n);
            const expected = [1n, 2n, 3n];
            const result = Array.from(range);
            expect(result).toEqual(expected);
        });

        test('IntRange for-of', () => {
            const range = IntRange.closed(1n, 3n);
            const expected = [1n, 2n, 3n];
            const result: bigint[] = [];
            for (const item of range) {
                result.push(item);
            }
            expect(result).toEqual(expected);
        });

        // limit to 100
        test('IntRange infinite generator', () => {
            const range = IntRange.atLeast(1n);
            const expected = Array.from({ length: 100 }, (_, i) => BigInt(i + 1));
            const result: bigint[] = [];
            for (const item of range) {
                result.push(item);
                if (result.length >= 100) {
                    break;
                }
            }
            expect(result).toEqual(expected);
        });

        // [1, 3] -> [1, 2, 3]
        // (1, 3) -> [2]
        // (1, 3] -> [2, 3]
        // [1, 3) -> [1, 2]
        test('[1, 3] -> [1, 2, 3]', () => {
            const range = IntRange.closed(1n, 3n);
            const expected = [1n, 2n, 3n];
            const result = [...range];
            expect(result).toEqual(expected);
        });

        test('(1, 3) -> [2]', () => {
            const range = IntRange.open(1n, 3n);
            const expected = [2n];
            const result = [...range];
            expect(result).toEqual(expected);
        });

        test('(1, 3] -> [2, 3]', () => {
            const range = IntRange.openClosed(1n, 3n);
            const expected = [2n, 3n];
            const result = [...range];
            expect(result).toEqual(expected);
        });

        test('[1, 3) -> [1, 2]', () => {
            const range = IntRange.closedOpen(1n, 3n);
            const expected = [1n, 2n];
            const result = [...range];
            expect(result).toEqual(expected);
        });

        // step by 2
        test('[1, 5] step by 2', () => {
            const range = IntRange.closed(1n, 5n).steps(2n);
            const expected = [1n, 3n, 5n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(3n);
        });

        // step by 3
        test('[1, 5] step by 3', () => {
            const range = IntRange.closed(1n, 5n).steps(3n);
            const expected = [1n, 4n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(2n);
        });

        // step by 4
        test('[1, 5] step by 4', () => {
            const range = IntRange.closed(1n, 5n).steps(4n);
            const expected = [1n, 5n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(2n);
        });

        // step by 5
        test('[1, 5] step by 5', () => {
            const range = IntRange.closed(1n, 5n).steps(5n);
            const expected = [1n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(1n);
        });

        // step by -1
        test('[1, 5] step by -1', () => {
            const range = IntRange.closed(1n, 5n).steps(-1n);
            console.log(range);

            const expected = [5n, 4n, 3n, 2n, 1n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(5n);
        });

        // step by -2
        test('[1, 5] step by -2', () => {
            const range = IntRange.closed(1n, 5n).steps(-2n);
            const expected = [5n, 3n, 1n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(3n);
        });

        // step by -3
        test('[1, 5] step by -3', () => {
            const range = IntRange.closed(1n, 5n).steps(-3n);
            const expected = [5n, 2n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(2n);
        });

        // step by -4
        test('[1, 5] step by -4', () => {
            const range = IntRange.closed(1n, 5n).steps(-4n);
            const expected = [5n, 1n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(2n);
        });

        // step by -5
        test('[1, 5] step by -5', () => {
            const range = IntRange.closed(1n, 5n).steps(-5n);
            const expected = [5n];
            const result = [...range];
            expect(result).toEqual(expected);
            expect(range.size).toBe(1n);
        });

        test('[3,7] with step 1', () => {
            const range = IntRange.closed(3n, 7n).steps(1n);
            expect([...range]).toEqual([3n, 4n, 5n, 6n, 7n]);
        });

        test('(3,7] with step 1', () => {
            const range = IntRange.openClosed(3n, 7n).steps(1n);
            expect([...range]).toEqual([4n, 5n, 6n, 7n]);
        });

        test('[3,7) with step 1', () => {
            const range = IntRange.closedOpen(3n, 7n).steps(1n);
            expect([...range]).toEqual([3n, 4n, 5n, 6n]);
        });

        test('(3,7) with step 1', () => {
            const range = IntRange.open(3n, 7n).steps(1n);
            expect([...range]).toEqual([4n, 5n, 6n]);
        });

        test('(2, 10] with step -2', () => {
            const range = IntRange.openClosed(2n, 10n).steps(-2n);
            expect([...range]).toEqual([10n, 8n, 6n, 4n]);
        });

        test('Empty range', () => {
            const range = IntRange.closed(5n, 3n);
            expect(range.isEmpty()).toBe(true);
            expect([...range]).toEqual([]);
        });

        test('Infinite upper bound with step 1 (limit to first 5 values)', () => {
            const range = IntRange.atLeast(0n).steps(1n);
            const iterator = range[Symbol.iterator]();
            const values: bigint[] = [];
            for (let i = 0; i < 5; i++) {
                values.push(iterator.next().value as bigint);
            }
            expect(values).toEqual([0n, 1n, 2n, 3n, 4n]);
        });

        test('Infinite lower bound with step -1 (limit to first 5 values)', () => {
            const range = IntRange.atMost(0n).steps(-1n);
            const iterator = range[Symbol.iterator]();
            const values: bigint[] = [];
            for (let i = 0; i < 5; i++) {
                values.push(iterator.next().value as bigint);
            }
            expect(values).toEqual([0n, -1n, -2n, -3n, -4n]);
        });

        test('Step cannot be zero', () => {
            const range = IntRange.closed(1n, 5n);
            expect(() => range.steps(0n)).toThrow(RangeError);
        });
        
        test('Cannot iterate (n, ∞) with negative step', () => {
            const range = IntRange.greaterThan(1n).steps(-1n);
            const result = [...range];
            expect(result).toEqual([]);
        });

        test('Cannot iterate (-∞, n) with positive step', () => {
            const range = IntRange.lessThan(5n).steps(1n);
            const result = [...range];
            expect(result).toEqual([]);
        });

        test('Cannot start from Lowest(-∞)', () => {
            const range = IntRange.lessThan(5n).steps(1n);
            expect(range.size).toBe(Infinity);
            expect([...range]).toEqual([]);
        });

        test('Cannot start from Uppest(+∞)', () => {
            const range = IntRange.greaterThan(5n).steps(-1n);
            expect(range.size).toBe(Infinity);
            expect([...range]).toEqual([]);
        });
    });
})

describe('FloatRange', () => {
    describe('FloatRange constructor', () => {
        test('[1.2, 3.3]', () => {
            const ret = FloatRange.closed(1.2, 3.3);
            const expected = FloatRange.new(BoundType.CLOSED, 1.2, 3.3, BoundType.CLOSED);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('[1.2, 3.3]');
        });

        test('(1.2, 3.3)', () => {
            const ret = FloatRange.open(1.2, 3.3);
            const expected = FloatRange.new(BoundType.OPEN, 1.2, 3.3, BoundType.OPEN);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('(1.2, 3.3)');
        });

        test('[1.2, 3.3)', () => {
            const ret = FloatRange.closedOpen(1.2, 3.3);
            const expected = FloatRange.new(BoundType.CLOSED, 1.2, 3.3, BoundType.OPEN);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('[1.2, 3.3)');
        });

        test('(1.2, 3.3]', () => {
            const ret = FloatRange.openClosed(1.2, 3.3);
            const expected = FloatRange.new(BoundType.OPEN, 1.2, 3.3, BoundType.CLOSED);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('(1.2, 3.3]');
        });

        test('[1.2, +∞)', () => {
            const ret = FloatRange.atLeast(1.2);
            const expected = FloatRange.new(BoundType.CLOSED, 1.2, Infinity, BoundType.CLOSED);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('[1.2, +∞)');
        });

        test('[0, +∞)', () => {
            const ret = FloatRange.atLeast(0);
            const expected = FloatRange.new(BoundType.CLOSED, 0, Infinity, BoundType.CLOSED);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℝ⁺');
        });

        test('(0, +∞)', () => {
            const ret = FloatRange.greaterThan(0);
            const expected = FloatRange.new(BoundType.OPEN, 0, Infinity, BoundType.CLOSED);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℝ⁺');
        });

        test('(-∞, 3.3]', () => {
            const ret = FloatRange.atMost(3.3);
            const expected = FloatRange.new(BoundType.CLOSED, -Infinity, 3.3, BoundType.CLOSED);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('(−∞, 3.3]');
        });

        test('(-∞, 0]', () => {
            const ret = FloatRange.atMost(0);
            const expected = FloatRange.new(BoundType.CLOSED, -Infinity, 0, BoundType.CLOSED);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℝ⁻');
        });

        test('(-∞, 0)', () => {
            const ret = FloatRange.lessThan(0);
            const expected = FloatRange.new(BoundType.CLOSED, -Infinity, 0, BoundType.OPEN);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℝ⁻');
        });

        test('(-∞, +∞)', () => {
            const ret = FloatRange.all();
            const expected = FloatRange.new(BoundType.OPEN, -Infinity, Infinity, BoundType.OPEN);
            expect(ret.equals(expected)).toBe(true);
            expect(ret.toString()).toBe('ℝ');
        });

        test('invalid [-∞, 3.3]', () => {
            expect(() => FloatRange.closed(-Infinity, 3.3)).toThrow(RangeError);
        });

        test('invalid (1.2, ∞]', () => {
            expect(() => FloatRange.open(1.2, Infinity)).toThrow(RangeError);
        });
    });
});

describe('IntRange vs Range', () => {
    // IntRange는 (4, 5)도 공집합이고 (4, 4)도 공집합이며, (4, 5]부터 공집합이 아님
    test('(4, 5) for Z == ∅', () => {
        const range = IntRange.open(4n, 5n);
        console.log(range.size);    

        expect(range.isEmpty()).toBe(true);
        expect(range.size).toBe(0n);
        expect(range.toString()).toBe('∅');
    });

    test('(4, 4) for Z == ∅', () => {
        const range = IntRange.open(4n, 4n);
        expect(range.isEmpty()).toBe(true);
        expect(range.size).toBe(0n);
        expect(range.toString()).toBe('∅');
    });

    test('(4, 5] for Z != ∅', () => {
        const range = IntRange.openClosed(4n, 5n);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(1n);  // 정수 구간이므로 집합은 {5}이고 크기는 1
        expect(range.toString()).toBe('{5}');
        expect(range.toClosedRange().toString()).toBe('{5}');
    });

    test('[4, 5] for Z != ∅', () => {
        const range = IntRange.closed(4n, 5n);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(2n);  // 집합은 {4, 5}이고 크기는 2
        expect(range.toString()).toBe('[4..5]');
    });

    test('[4, 4] for Z != ∅', () => {
        const range = IntRange.closed(4n, 4n);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(1n);  // 정수 구간에서 [4, 4]는 {4}이므로 크기는 1
        expect(range.toString()).toBe('{4}');
    });

    // 실수 구간 테스트: 실수로 (4, 5)는 공집합이 아님
    test('(4, 5) for R != ∅', () => {
        const range = Range.open(4, 5);
        expect(range.isEmpty()).toBe(false); // 실수 구간은 공집합이 아님
        expect(range.size).toBe(1);  // 크기는 1 (5 - 4)
        expect(range.toString()).toBe('(4, 5)');
    });

    // (4, 5], [4, 5), [4, 5]
    test('(4, 5] for R != ∅', () => {
        const range = Range.openClosed(4, 5);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(1);  // 크기는 1 (5 - 4)
        expect(range.toString()).toBe('(4, 5]');
    });

    test('[4, 5) for R != ∅', () => {
        const range = Range.closedOpen(4, 5);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(1);  // 크기는 1 (5 - 4)
        expect(range.toString()).toBe('[4, 5)');
    });

    test('[4, 5] for R != ∅', () => {
        const range = Range.closed(4, 5);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(1);  // 크기는 1 (5 - 4)
        expect(range.toString()).toBe('[4, 5]');
    });

    test('[4, 6) size in Z', () => {
        const range = IntRange.closedOpen(4n, 6n);
        expect(range.size).toBe(2n);  // 정수 집합 {4, 5}이므로 크기는 2
        expect(range.toString()).toBe('[4..6)');
    });

    test('[4, 6) size in R', () => {
        const range = Range.closedOpen(4, 6);
        expect(range.size).toBe(2);  // 실수 집합에서 크기는 6 - 4 = 2
        expect(range.toString()).toBe('[4, 6)');
    });

    // (5.5, 6.5) is empty in IntRange due to rounding
    test('(5.5, 6.5) for Z == {6}', () => {
        const range = Range.open(5.5, 6.5).toIntRange();
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(1n);  // 정수 집합 {6}이므로 크기는 1
        expect(range.toString()).toBe('{6}');
    });

    // [1, +∞) 크기 무한대
    test('[1, +∞) size is infinite in IntRange', () => {
        const range = IntRange.atLeast(1n);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(Infinity);  // 무한대 구간이므로 크기는 무한대
        expect(range.toString()).toBe('ℤ⁺');
    });

    // [1, 10] 크기
    test('[1, 10] size in Z', () => {
        const range = IntRange.closed(1n, 10n);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(10n);  // 정수 집합 {1, 2, ..., 10}이므로 크기는 10
        expect(range.toString()).toBe('[1..10]');
    });

    // 실수 범위의 [1, 10] 크기
    test('[1, 10] size in R', () => {
        const range = Range.closed(1, 10);
        expect(range.isEmpty()).toBe(false);
        expect(range.size).toBe(9);  // 실수 구간에서는 크기는 10 - 1 = 9
        expect(range.toString()).toBe('[1, 10]');
    });
});