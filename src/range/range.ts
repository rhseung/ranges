import { BoundType, Lowest, Uppest, Comparable } from "../util";
import { le } from "../util";

// TODO: range(0, 1, 0.1) -> [0, 1) step 0.1, toFixed로 부동 소수점 오류를 최대한

export class Range<T extends Comparable> {
    protected constructor(
        protected lower: T | Lowest,
        protected lowerBound: BoundType,
        protected upper: T | Uppest,
        protected upperBound: BoundType
    ) {}

    static new<T extends Comparable>(lowerBound: BoundType | '[' | '(', lower: T | Lowest, upper: T | Uppest, upperBound: ')' | ']' | BoundType): Range<T> {
        const lowerBoundType = lowerBound instanceof BoundType ? lowerBound : BoundType.parse(lowerBound);
        const upperBoundType = upperBound instanceof BoundType ? upperBound : BoundType.parse(upperBound);
        
        if (lower instanceof Lowest && lowerBoundType === BoundType.CLOSED)
            throw new RangeError(`Lowest(${Lowest.INSTANCE}) cannot be closed`);
        if (upper instanceof Uppest && upperBoundType === BoundType.CLOSED)
            throw new RangeError(`Uppest(${Uppest.INSTANCE}) cannot be closed`);
        
        const ret = new Range<T>(lower, lowerBoundType, upper, upperBoundType);
        return ret.isEmpty() ? Range.empty<T>() : ret;
    }

    /**
     * @returns (a, b)
     */
    static open<T extends Comparable>(lower: T | Lowest, upper: T | Uppest): Range<T> {
        return Range.new<T>('(', lower, upper, ')');
    }

    /**
     * @returns [a, b]
     */
    static closed<T extends Comparable>(lower: T, upper: T): Range<T> {
        return Range.new<T>('[', lower, upper, ']');
    }

    /**
     * @returns [a, b)
     */
    static closedOpen<T extends Comparable>(lower: T, upper: T | Uppest): Range<T> {
        return Range.new<T>('[', lower, upper, ')');
    }

    /**
     * @returns (a, b]
     */
    static openClosed<T extends Comparable>(lower: T | Lowest, upper: T): Range<T> {
        return Range.new<T>('(', lower, upper, ']');
    }

    /**
     * @returns (a, +∞) or [a, +∞]
     */
    static downTo<T extends Comparable>(boundType: BoundType | '[' | '(', lower: T | Lowest): Range<T> {
        return Range.new<T>(boundType, lower, Uppest.INSTANCE, BoundType.OPEN);
    }

    /**
     * @returns (a, +∞)
     */
    static greaterThan<T extends Comparable>(lower: T | Lowest): Range<T> {
        return Range.downTo<T>('(', lower);
    }

    /**
     * @returns [a, +∞)
     */
    static atLeast<T extends Comparable>(lower: T): Range<T> {
        return Range.downTo<T>('[', lower);
    }

    /**
     * @returns (-∞, b) or (-∞, b]
     */
    static upTo<T extends Comparable>(upper: T | Uppest, boundType: ')' | ']' | BoundType): Range<T> {
        return Range.new<T>(BoundType.OPEN, Lowest.INSTANCE, upper, boundType);
    }

    /**
     * @returns (-∞, b)
     */
    static lessThan<T extends Comparable>(upper: T | Uppest): Range<T> {
        return Range.upTo<T>(upper, ')');
    }

    /**
     * @returns (-∞, b]
     */
    static atMost<T extends Comparable>(upper: T): Range<T> {
        return Range.upTo<T>(upper, ']');
    }

    /**
     * @returns (-∞, +∞)
     */
    static all<T extends Comparable>(): Range<T> {
        return Range.open<T>(Lowest.INSTANCE, Uppest.INSTANCE);
    }

    /**
     * @returns ∅
     */
    static empty<T extends Comparable>(): EmptyRange<T> {
        return new EmptyRange<T>();
    }

    get lowerEndpoint(): T | Lowest {
        return this.lower;
    }

    get lowerBoundType(): BoundType {
        return this.lowerBound;
    }

    get upperEndpoint(): T | Uppest {
        return this.upper;
    }

    get upperBoundType(): BoundType {
        return this.upperBound;
    }

    /**
     * @returns |this|
     */
    get size(): number | bigint {
        if (this.isEmpty())
            return 0;
        else if (this.lower === this.upper)
            return 0;
        else if (this.lower instanceof Lowest || this.upper instanceof Uppest)
            return Infinity;
        else if (this.lower instanceof Date || typeof this.lower === 'number')
            return (this.upper as number) - (this.lower as number);
        else if (typeof this.lower === 'bigint')
            return (this.upper as bigint) - (this.lower as bigint);
        else
            throw new TypeError(`Unsupported type: ${typeof this.lower}`);
    }

    copy(): Range<T> {
        return Range.new<T>(this.lowerBound, this.lower, this.upper, this.upperBound);
    }

    toString(): string {
        if (this.isEmpty())
            return '∅';
        else if (this.isLowerInfinite() && this.isUpperInfinite())
            return 'ℝ';
        else if (this.lower === 0 && this.isUpperInfinite())
            return 'ℝ⁺';
        else if (this.isLowerInfinite() && this.upper === 0)
            return 'ℝ⁻';
        else if (this.lowerBound === BoundType.CLOSED && this.lower === this.upper && this.upperBound === BoundType.CLOSED)
            return `{${this.lower}}`;
        else
            return `${this.lowerBound.toBracket()[0]}${this.lower}, ${this.upper}${this.upperBound.toBracket()[1]}`;
    }

    toIntRange(): IntRange {
        if (this.isEmpty())
            return IntRange.empty();

        const isInteger = (value: Comparable): value is bigint =>
            typeof value === 'bigint' ? true :
            value instanceof Date ? true :
            Number.isInteger(value);

        const toNumber = (value: Exclude<Comparable, bigint>): number =>
            value instanceof Date ? value.getTime() : value;

        const lowerToBigInt = (value: Comparable): bigint =>
            typeof value === 'bigint' ? value : BigInt(Math.ceil(toNumber(value)));

        const upperToBigInt = (value: Comparable): bigint =>
            typeof value === 'bigint' ? value : BigInt(Math.floor(toNumber(value)));

        if (!this.isLowerFinite() && !this.isUpperFinite())
            return IntRange.all();
        else if (!this.isLowerFinite() && this.isUpperFinite())
            return IntRange.upTo(upperToBigInt(this.upper), isInteger(this.upper) ? this.upperBound : BoundType.CLOSED);
        else if (this.isLowerFinite() && !this.isUpperFinite())
            return IntRange.downTo(isInteger(this.lower) ? this.lowerBound : BoundType.CLOSED, lowerToBigInt(this.lower));
        else
            return IntRange.new(isInteger(this.lower) ? this.lowerBound : BoundType.CLOSED, lowerToBigInt(this.lower), upperToBigInt(this.upper), isInteger(this.upper) ? this.upperBound : BoundType.CLOSED);
    }

    toFloatRange(): FloatRange {
        if (this.isEmpty())
            return FloatRange.empty();

        const isFloat = (value: Comparable): value is number =>
            typeof value === 'number';

        const toNumber = (value: Exclude<Comparable, number>): number =>
            value instanceof Date ? value.getTime() : Number(value);

        const lowerToFloat = (value: Comparable): number =>
            typeof value === 'number' ? value : toNumber(value);

        const upperToFloat = (value: Comparable): number =>
            typeof value === 'number' ? value : toNumber(value);

        if (!this.isLowerFinite() && !this.isUpperFinite())
            return FloatRange.all();
        else if (!this.isLowerFinite() && this.isUpperFinite())
            return FloatRange.upTo(upperToFloat(this.upper), isFloat(this.upper) ? this.upperBound : BoundType.CLOSED);
        else if (this.isLowerFinite() && !this.isUpperFinite())
            return FloatRange.downTo(isFloat(this.lower) ? this.lowerBound : BoundType.CLOSED, lowerToFloat(this.lower));
        else
            return FloatRange.new(isFloat(this.lower) ? this.lowerBound : BoundType.CLOSED, lowerToFloat(this.lower), upperToFloat(this.upper), isFloat(this.upper) ? this.upperBound : BoundType.CLOSED);
    }

    isLowerFinite(): this is { lower: T } {
        return !(this.lower instanceof Lowest);
    }

    isLowerInfinite(): this is { lower: Lowest } {
        return this.lower instanceof Lowest;
    }

    isUpperFinite(): this is { upper: T } {
        return !(this.upper instanceof Uppest);
    }

    isUpperInfinite(): this is { upper: Uppest } {
        return this.upper instanceof Uppest;
    }

    isInfinite(): boolean {
        return this.isUpperInfinite() || this.isLowerInfinite();
    }

    /**
     * @returns this == ∅
     */
    isEmpty(): boolean {
        if (this instanceof EmptyRange)
            return true;
        if (!this.lowerBound.compare(this.lower, this.upper))
            return true;
        if (!this.upperBound.compare(this.lower, this.upper))
            return true;

        return false;
    }

    /**
     * @returns this != ∅
     */
    isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    /**
     * @returns value ∈ this 
     */
    includes(value: T): boolean {
        if (this.isEmpty())
            return false;

        return this.lowerBound.compare(this.lower, value) && this.upperBound.compare(value, this.upper);
    }

    /**
     * @returns [...values] ∈ this 
     */
    includesAll(values: T[]): boolean {
        if (this.isEmpty())
            return false;

        return values.every(value => this.includes(value));
    }

    /**
     * @returns this ⊇ other
     */
    encloses(other: Range<T>): boolean {
        if (this.isEmpty())
            return other.isEmpty();
        else if (other.isEmpty())
            return true;

        const lowerComparison = this.lower === other.lower
            ? (this.lowerBound === BoundType.CLOSED) || (other.lowerBound === BoundType.OPEN) 
            : BoundType.OPEN.compare(this.lower, other.lower);

        const upperComparison = this.upper === other.upper
            ? (this.upperBound === BoundType.CLOSED) || (other.upperBound === BoundType.OPEN) 
            : BoundType.OPEN.compare(other.upper, this.upper);

        return lowerComparison && upperComparison;
    }

    /**
     * @returns this ⊂ other
     */
    lt(other: Range<T>): boolean {
        return other.encloses(this) && !this.equals(other);
    }

    /**
     * @returns this ⊆ other
     */
    le(other: Range<T>): boolean {
        return other.encloses(this);
    }

    /**
     * @returns this ⊃ other
     */
    gt(other: Range<T>): boolean {
        return this.encloses(other) && !this.equals(other);
    }

    /**
     * @returns this ⊇ other
     */
    ge(other: Range<T>): boolean {
        return this.encloses(other);
    }

    /**
     * @returns this == other
     */
    equals(other: Range<T>): boolean {
        if (this.isEmpty() && other.isEmpty())
            return true;
        else if (this.isEmpty() || other.isEmpty())
            return false;
        else
            return this.lower === other.lower && this.upper === other.upper && this.lowerBound === other.lowerBound && this.upperBound === other.upperBound;
    }

    /**
     * @returns this ⊆ other
     */
    isSubset(other: Range<T>): boolean {
        return this.le(other);
    }

    /**
     * @returns this ⊇ other
     */
    isSuperset(other: Range<T>): boolean {
        return this.ge(other);
    }

    /**
     * @returns this ∪ other
     */
    union(other: Range<T>): Range<T> {
        if (this.isEmpty())
            return other.copy();
        else if (other.isEmpty())
            return this.copy();

        const thisEnclosesOther = this.encloses(other);
        const otherEnclosesThis = other.encloses(this);

        if (thisEnclosesOther)
            return this.copy();
        else if (otherEnclosesThis)
            return other.copy();
        else if (le(this.lower, other.lower, this.upper, other.upper)) {
            if (other.lower === this.upper && other.lowerBound === BoundType.OPEN && this.upperBound === BoundType.OPEN)
                throw new RangeError(`Cannot union ${this} and ${other}`);
            else
                return new Range(this.lower, this.lowerBound, other.upper, other.upperBound);
        }
        else if (le(other.lower, this.lower, other.upper, this.upper)) {
            if (this.lower === other.upper && this.lowerBound === BoundType.OPEN && other.upperBound === BoundType.OPEN)
                throw new RangeError(`Cannot union ${this} and ${other}`);
            else
                return new Range(other.lower, other.lowerBound, this.upper, this.upperBound);
        }
        else
            throw new RangeError(`Cannot union ${this} and ${other}`);
    }

    /**
     * @returns this ∩ other
     */
    intersection(other: Range<T>): Range<T> {
        if (this.isEmpty() || other.isEmpty())
            return Range.empty<T>();

        const thisEnclosesOther = this.encloses(other);
        const otherEnclosesThis = other.encloses(this);

        if (thisEnclosesOther)
            return other.copy();
        else if (otherEnclosesThis)
            return this.copy();
        else if (le(this.lower, other.lower, this.upper, other.upper))
            return new Range(other.lower, other.lowerBound, this.upper, this.upperBound);
        else if (le(other.lower, this.lower, other.upper, this.upper))
            return new Range(this.lower, this.lowerBound, other.upper, other.upperBound);
        else if (this.upper < other.lower)
            return Range.empty<T>();
        else    // other.upper < this.lower
            return Range.empty<T>();
    }

    /**
     * @returns this ∩ other == ∅
     */
    isdisjoint(other: Range<T>): boolean {
        return this.intersection(other).isEmpty();
    }
}

class EmptyRange<T extends Comparable> extends Range<T> {
    constructor() {
        // @ts-ignore
        super(0, BoundType.OPEN, 0, BoundType.OPEN);
    }

    override get size(): number | bigint {
        return 0;
    }

    copy(): EmptyRange<T> {
        return new EmptyRange<T>();
    }

    toString(): string {
        return '∅';
    }

    isEmpty(): boolean {
        return true;
    }
}

// @ts-ignore
export class IntRange extends Range<bigint> {
    protected constructor(
        lower: bigint | Lowest,
        lowerBound: BoundType,
        upper: bigint | Uppest,
        upperBound: BoundType,
        protected step: bigint,
        private lowerIsStart: boolean
    ) {
        super(lower, lowerBound, upper, upperBound);
    }

    /**
     * @param lowerIsStart `range` 함수를 사용할 때 `range(5, 1, -2)`와 같이 low=1, upper=5지만 start=5, end=1인 경우를 기억하여 처리하기 위해 추가. step의 부호를 보고 추론할 수 있느냐는 질문에는 의도적으로 공집합을 만드려고 `range(5, 1, 2)` 처럼 쓰는 경우 step>0이지만 low > upper이므로 공집합이 되어야 함. 이런건 자동 추론이 안되어서 추가함. 즉, step과 lowerIsStart이 다르면 무조건 공집합.
     */
    static override new(lowerBound: BoundType | '[' | '(', lower: bigint | Lowest, upper: bigint | Uppest, upperBound: ')' | ']' | BoundType, step: bigint = 1n, lowerIsStart?: boolean): IntRange {
        const lowerBoundType = lowerBound instanceof BoundType ? lowerBound : BoundType.parse(lowerBound);
        const upperBoundType = upperBound instanceof BoundType ? upperBound : BoundType.parse(upperBound);
        
        if (lower instanceof Lowest && lowerBoundType === BoundType.CLOSED)
            throw new RangeError(`Lowest(${Lowest.INSTANCE}) cannot be closed`);
        if (upper instanceof Uppest && upperBoundType === BoundType.CLOSED)
            throw new RangeError(`Uppest(${Uppest.INSTANCE}) cannot be closed`);

        if (step === 0n)
            throw new RangeError('Step cannot be zero');

        // lowerIsStart를 명시하지 않으면 step으로 자동 추론
        lowerIsStart = lowerIsStart ?? step > 0n;
        
        const ret = new IntRange(lower, lowerBoundType, upper, upperBoundType, step, lowerIsStart);
        return ret.isEmpty() ? IntRange.empty() : ret;
    }

    static override open(lower: bigint | Lowest, upper: bigint | Uppest, step: bigint = 1n, lowerIsStart?: boolean): IntRange {
        return IntRange.new('(', lower, upper, ')', step, lowerIsStart);
    }

    static override closed(lower: bigint, upper: bigint, step: bigint = 1n, lowerIsStart?: boolean): IntRange {
        return IntRange.new('[', lower, upper, ']', step, lowerIsStart);
    }

    static override closedOpen(lower: bigint, upper: bigint | Uppest, step: bigint = 1n, lowerIsStart?: boolean): IntRange {
        return IntRange.new('[', lower, upper, ')', step, lowerIsStart);
    }

    static override openClosed(lower: bigint | Lowest, upper: bigint, step: bigint = 1n, lowerIsStart?: boolean): IntRange {
        return IntRange.new('(', lower, upper, ']', step, lowerIsStart);
    }

    static override downTo(boundType: BoundType | '[' | '(', lower: bigint | Lowest, step: bigint = 1n, lowerIsStart: boolean = true): IntRange {
        return IntRange.new(boundType, lower, Uppest.INSTANCE, ')', step, lowerIsStart);
    }

    static override greaterThan(lower: bigint | Lowest, step: bigint = 1n, lowerIsStart: boolean = true): IntRange {
        return IntRange.downTo('(', lower, step, lowerIsStart);
    }

    static override atLeast(lower: bigint, step: bigint = 1n, lowerIsStart: boolean = true): IntRange {
        return IntRange.downTo('[', lower, step, lowerIsStart);
    }

    static override upTo(upper: bigint | Uppest, boundType: ')' | ']' | BoundType, step: bigint = -1n, lowerIsStart: boolean = false): IntRange {
        return IntRange.new('(', Lowest.INSTANCE, upper, boundType, step, lowerIsStart);
    }

    static override lessThan(upper: bigint | Uppest, step: bigint = -1n, lowerIsStart: boolean = false): IntRange {
        return IntRange.upTo(upper, ')', step, lowerIsStart);
    }

    static override atMost(upper: bigint, step: bigint = -1n, lowerIsStart: boolean = false): IntRange {
        return IntRange.upTo(upper, ']', step, lowerIsStart);
    }

    static override all(): IntRange {
        return IntRange.open(Lowest.INSTANCE, Uppest.INSTANCE);
    }

    static override empty(): EmptyIntRange {
        return new EmptyIntRange();
    }

    override get size(): number | bigint {
        if (this.lower instanceof Lowest || this.upper instanceof Uppest)
            return Infinity;
        else if (this.step > 0 !== this.lowerIsStart)
            return 0n;
        else {
            // return this.upper - this.lower + 1n
            //     - (this.lowerBound === BoundType.OPEN ? 1n : 0n)
            //     - (this.upperBound === BoundType.OPEN ? 1n : 0n);
            // 위에 있는 것은 step이 1일 때의 상황임

            const lower = this.lowerBound === BoundType.CLOSED ? this.lower : this.lower + 1n;
            const upper = this.upperBound === BoundType.CLOSED ? this.upper : this.upper - 1n;

            const start = this.lowerIsStart ? lower : upper;
            const end = this.lowerIsStart ? upper : lower;

            const abs = (x: bigint) => x < 0n ? -x : x;

            if (this.step > 0 && start > end)
                return 0n;
            else if (this.step < 0 && start < end)
                return 0n;
            else
                return abs(end - start) / abs(this.step) + 1n;
        }
    }

    override copy(): IntRange {
        return IntRange.new(this.lowerBound, this.lower, this.upper, this.upperBound, this.step);
    }

    override toString(): string {
        const size = this.size;
        const abs = (x: bigint) => x < 0n ? -x : x;

        if (size === 0n)
            return '∅';
        else if (this.isLowerInfinite() && this.isUpperInfinite())
            return `${abs(this.step) === 1n ? '' : abs(this.step)}ℤ`;
        else if (this.lower === (this.lowerBound === BoundType.CLOSED ? 1n : 0n) && this.isUpperInfinite())
            return `${abs(this.step) === 1n ? '' : abs(this.step)}ℤ⁺`;
        else if (this.isLowerInfinite() && this.upper === (this.upperBound === BoundType.CLOSED ? -1n : 0n))
            return `${abs(this.step) === 1n ? '' : abs(this.step)}ℤ⁻`;
        else if (size === 1n)
            return `{${this.lowerBound === BoundType.CLOSED ? this.lower : (this.lower as bigint) + 1n}}`;
        else    // Ref: https://en.wikipedia.org/wiki/Interval_(mathematics)#Integer_intervals
            return `${this.lowerBound.toBracket()[0]}${this.lower}..${this.upper}${this.upperBound.toBracket()[1]}` + (abs(this.step) === 1n ? '' : ` step ${this.step}`);
    }

    override toIntRange(): IntRange {
        return this.copy();
    }

    toClosedRange(): IntRange {
        if (this.isEmpty())
            return IntRange.empty();
        else if (this.isLowerInfinite() && this.isUpperInfinite())
            return IntRange.all();
        else if (this.isLowerInfinite() && this.isUpperFinite())
            return IntRange.atMost(this.upper - (this.upperBound === BoundType.CLOSED ? 0n : 1n), this.step, this.lowerIsStart);
        else if (this.isLowerFinite() && this.isUpperInfinite())
            return IntRange.atLeast(this.lower + (this.lowerBound === BoundType.CLOSED ? 0n : 1n), this.step, this.lowerIsStart);
        else if (this.isLowerFinite() && this.isUpperFinite())
            return IntRange.closed(
                this.lower + (this.lowerBound === BoundType.CLOSED ? 0n : 1n),
                this.upper - (this.upperBound === BoundType.CLOSED ? 0n : 1n)
            , this.step, this.lowerIsStart);
        else    // impossible, but TypeScript doesn't know
            throw new RangeError('Cannot convert to closed range');
    }
    
    override isEmpty(): boolean {
        const size = this.size;
        return size === Infinity ? false : size <= 0n;
    }

    override equals(other: Range<bigint> | IntRange): boolean {
        if (other instanceof IntRange) {
            const a = this.toClosedRange();
            const b = other.toClosedRange();

            return a.lower === b.lower && a.upper === b.upper && a.lowerBound === b.lowerBound && a.upperBound === b.upperBound && a.step === b.step;
        }
        else
            return super.equals(other);
    }

    steps(step: bigint, lowerIsStart?: boolean): IntRange {
        // 일부러 this.lowerIsStart 안 쓰는 거임. 이유는 step이 바뀌면 lowerIsStart도 바뀔 수 있기 때문
        // ex. IntRange.closed(1n, 5n).steps(-1n); 에서 closed()에 의해 lowerIsStart=true인데 steps(-1n)에 의해 lowerIsStart=false가 되어야 함
        // 애초에 lowerIsStart가 필요한 경우는 range 함수 쓸 때만 필요함
        return IntRange.new(this.lowerBound, this.lower, this.upper, this.upperBound, step, lowerIsStart);
    }

    *[Symbol.iterator](): Generator<bigint, undefined, void> {
        if (this.isEmpty())
            return;

        if (!(this.lower instanceof Lowest) && this.upper instanceof Uppest && this.step < 0n) {
            // throw new RangeError('Cannot iterate (n, +∞) with a negative step');
            return;
        }
        if (this.lower instanceof Lowest && !(this.upper instanceof Uppest) && this.step > 0n) {
            // throw new RangeError('Cannot iterate (-∞, n) with a positive step');
            return;
        }
        if (this.lower instanceof Lowest && this.lowerIsStart === true) {
            // throw new RangeError('Cannot start from Lowest(-∞)');
            return;
        }
        if (this.upper instanceof Uppest && this.lowerIsStart === false) {
            // throw new RangeError('Cannot start from Uppest(+∞)');
            return;
        }

        const low = this.isLowerFinite() ? this.lowerBound === BoundType.CLOSED ? this.lower : this.lower + 1n : Lowest.INSTANCE;
        const up = this.isUpperFinite() ? this.upperBound === BoundType.CLOSED ? this.upper : this.upper - 1n : Uppest.INSTANCE;

        const tmp = this.lowerIsStart ? low : up;   // typescript typeguard 때문에 이렇게 함
        if (tmp instanceof Lowest || tmp instanceof Uppest)
            throw new RangeError('Cannot start from Lowest(-∞) or Uppest(+∞)');

        const start: bigint = tmp;
        const end: bigint | Lowest | Uppest = this.lowerIsStart ? up : low;

        // if (low instanceof Lowest && up instanceof Uppest)
        //     throw new RangeError('Cannot iterate over an infinite range');
        // else if (low instanceof Lowest && !(up instanceof Uppest)) {
        //     start = up;
        //     end = low;
        // }
        // else if (up instanceof Uppest && !(low instanceof Lowest)) {
        //     start = low;
        //     end = up;
        // }
        // else if (!(low instanceof Lowest) && !(up instanceof Uppest)) {
        //     // 어차피 low < up 아니면 공집합이 되기 때문에 표면상 아래와 같지 결국 start = low, end = up이 됨
        //     start = this.step > 0 ? low : up;
        //     end = this.step > 0 ? up : low;
        // }
        // else {
        //     // impossible, but TypeScript doesn't know
        //     return;
        // }

        for (let i = start; this.step > 0 ? le(i, end) : le(end, i); i += this.step) {
            yield i;
        }
    }
}

// TODO: toOpenedRange
// TODO: changeBoundType - auto transform

class EmptyIntRange extends IntRange {
    constructor() {
        // @ts-ignore
        super(0n, BoundType.OPEN, 0n, BoundType.OPEN);
    }

    override get size(): number | bigint {
        return 0n;
    }

    copy(): EmptyIntRange {
        return new EmptyIntRange();
    }

    toString(): string {
        return '∅';
    }

    isEmpty(): boolean {
        return true;
    }
}

// TODO: FloatRange 구현
// TODO: DateRange 구현
// TODO: StringRange 구현

// @ts-ignore
export class FloatRange extends Range<number> {
    protected constructor(
        lower: number | Lowest,
        lowerBound: BoundType,
        upper: number | Uppest,
        upperBound: BoundType,
        protected step: number,
        private lowerIsStart: boolean
    ) {
        super(lower, lowerBound, upper, upperBound);
    }
    
    static override new(lowerBound: BoundType | "[" | "(", lower: number | Lowest, upper: number | Uppest, upperBound: ")" | "]" | BoundType, step: number = 1, lowerIsStart?: boolean): FloatRange {
        const lowerBoundType = lowerBound instanceof BoundType ? lowerBound : BoundType.parse(lowerBound);
        const upperBoundType = upperBound instanceof BoundType ? upperBound : BoundType.parse(upperBound);

        if (lower instanceof Lowest && lowerBoundType === BoundType.CLOSED)
            throw new RangeError(`Lowest(${Lowest.INSTANCE}) cannot be closed`);
        if (upper instanceof Uppest && upperBoundType === BoundType.CLOSED)
            throw new RangeError(`Uppest(${Uppest.INSTANCE}) cannot be closed`);

        if (step === 0)
            throw new RangeError('Step cannot be zero');

        lowerIsStart = lowerIsStart ?? step > 0;

        // start를 open에서 할 수 없음
        // FIXME: 근데 아래 조건은 루프를 돌 때는 문제가 되지만, 그냥 구간 객체로서만 사용할 때는 문제가 되지 않음
        if (lowerIsStart && lowerBoundType === BoundType.OPEN)
            throw new RangeError('Cannot start from open bound');
        else if (!lowerIsStart && upperBoundType === BoundType.OPEN)
            throw new RangeError('Cannot start from open bound');

        const ret = new FloatRange(lower, lowerBoundType, upper, upperBoundType, step, lowerIsStart);
        return ret.isEmpty() ? FloatRange.empty() : ret;
    }

    static override open(lower: number | Lowest, upper: number | Uppest, step: number = 1, lowerIsStart?: boolean): FloatRange {
        return FloatRange.new('(', lower, upper, ')', step, lowerIsStart);
    }

    static override closed(lower: number, upper: number, step: number = 1, lowerIsStart?: boolean): FloatRange {
        return FloatRange.new('[', lower, upper, ']', step, lowerIsStart);
    }

    static override closedOpen(lower: number, upper: number | Uppest, step: number = 1, lowerIsStart?: boolean): FloatRange {
        return FloatRange.new('[', lower, upper, ')', step, lowerIsStart);
    }

    static override openClosed(lower: number | Lowest, upper: number, step: number = 1, lowerIsStart?: boolean): FloatRange {
        return FloatRange.new('(', lower, upper, ']', step, lowerIsStart);
    }

    static override downTo(boundType: BoundType | '[' | '(', lower: number | Lowest, step: number = 1, lowerIsStart: boolean = true): FloatRange {
        return FloatRange.new(boundType, lower, Uppest.INSTANCE, ')', step, lowerIsStart);
    }

    static override greaterThan(lower: number | Lowest, step: number = 1, lowerIsStart: boolean = true): FloatRange {
        return FloatRange.downTo('(', lower, step, lowerIsStart);
    }

    static override atLeast(lower: number, step: number = 1, lowerIsStart: boolean = true): FloatRange {
        return FloatRange.downTo('[', lower, step, lowerIsStart);
    }

    static override upTo(upper: number | Uppest, boundType: ')' | ']' | BoundType, step: number = -1, lowerIsStart: boolean = false): FloatRange {
        return FloatRange.new('(', Lowest.INSTANCE, upper, boundType, step, lowerIsStart);
    }

    static override lessThan(upper: number | Uppest, step: number = -1, lowerIsStart: boolean = false): FloatRange {
        return FloatRange.upTo(upper, ')', step, lowerIsStart);
    }

    static override atMost(upper: number, step: number = -1, lowerIsStart: boolean = false): FloatRange {
        return FloatRange.upTo(upper, ']', step, lowerIsStart);
    }

    static override all(): FloatRange {
        return FloatRange.open(Lowest.INSTANCE, Uppest.INSTANCE);
    }

    static override empty(): EmptyFloatRange {
        return new EmptyFloatRange();
    }

    override get size(): number {
        if (this.lower instanceof Lowest || this.upper instanceof Uppest)
            return Infinity;
        else if (this.step > 0 !== this.lowerIsStart)
            return 0;
        else {
            // return this.upper - this.lower + 1n
            //     - (this.lowerBound === BoundType.OPEN ? 1n : 0n)
            //     - (this.upperBound === BoundType.OPEN ? 1n : 0n);
            // 위에 있는 것은 step이 1일 때의 상황임

            const lower = this.lowerBound === BoundType.CLOSED ? this.lower : this.lower + 1;
            const upper = this.upperBound === BoundType.CLOSED ? this.upper : this.upper - 1;

            const start = this.lowerIsStart ? lower : upper;
            const end = this.lowerIsStart ? upper : lower;

            if (this.lowerIsStart && this.lowerBoundType === BoundType.OPEN)
                throw new RangeError('Cannot start from open bound');
            else if (!this.lowerIsStart && this.upperBoundType === BoundType.OPEN)
                throw new RangeError('Cannot start from open bound');

            if (this.step > 0 && start > end)
                return 0;
            else if (this.step < 0 && start < end)
                return 0;
            else
                return Math.floor(Math.abs(end - start) / Math.abs(this.step)) + 1;
        }
    }

    override copy(): FloatRange {
        return FloatRange.new(this.lowerBound, this.lower, this.upper, this.upperBound, this.step);
    }

    override toFloatRange(): FloatRange {
        return this.copy();
    }

    override isEmpty(): boolean {
        const size = this.size;
        return size === Infinity ? false : size <= 0;
    }

    override equals(other: Range<number> | FloatRange): boolean {
        if (other instanceof FloatRange)
            return this.lower === other.lower && this.upper === other.upper && this.lowerBound === other.lowerBound && this.upperBound === other.upperBound && this.step === other.step;
        else
            return super.equals(other);
    }

    steps(step: number, lowerIsStart?: boolean): FloatRange {
        return FloatRange.new(this.lowerBound, this.lower, this.upper, this.upperBound, step, lowerIsStart);
    }

    *[Symbol.iterator](): Generator<number, undefined, void> {
        if (this.isEmpty())
            return;

        if (!(this.lower instanceof Lowest) && this.upper instanceof Uppest && this.step < 0)
            return;
        if (this.lower instanceof Lowest && !(this.upper instanceof Uppest) && this.step > 0)
            return;
        if (this.lower instanceof Lowest && this.lowerIsStart === true)
            return;
        if (this.upper instanceof Uppest && this.lowerIsStart === false)
            return;

        const low = this.lower;
        const up = this.upper;

        const tmp = this.lowerIsStart ? low : up;
        if (tmp instanceof Lowest || tmp instanceof Uppest)
            throw new RangeError('Cannot start from Lowest(-∞) or Uppest(+∞)');
        
        const start: number = tmp;
        const end: number | Lowest | Uppest = this.lowerIsStart ? up : low;

        // open에서 시작할 수 없음
        if (this.lowerBound === BoundType.OPEN && start === this.lower)
            throw new RangeError('Cannot start from open bound');
        else if (this.upperBound === BoundType.OPEN && start === this.upper)
            throw new RangeError('Cannot start from open bound');

        const getPrecision = (value: number): number => String(value).split('.')[1]?.length ?? 0;
        const precision = Math.max(getPrecision(start), getPrecision(this.step));

        for (let i = start; this.step > 0 ? le(i, end) : le(end, i); i = Number((i + this.step).toFixed(precision))) {
            yield i;
        }
    }
}

class EmptyFloatRange extends FloatRange {
    constructor() {
        // @ts-ignore
        super(0, BoundType.OPEN, 0, BoundType.OPEN);
    }

    override get size(): number {
        return 0;
    }

    copy(): EmptyFloatRange {
        return new EmptyFloatRange();
    }

    toString(): string {
        return '∅';
    }

    isEmpty(): boolean {
        return true;
    }
}