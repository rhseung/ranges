export type Comparable = number | bigint | Date;
export type ComparableWithInfinity = Comparable | Uppest | Lowest;

export class BoundType {
    private constructor(private type: 'open' | 'close') {}

    static OPEN = new BoundType('open');
    static CLOSED = new BoundType('close');

    /**
     * @returns a < b or a <= b
     */
    compare(a: ComparableWithInfinity, b: ComparableWithInfinity): boolean {
        if (a instanceof Lowest)
            return true;
        else if (a instanceof Uppest)
            return false;
        else if (b instanceof Lowest)
            return false;
        else if (b instanceof Uppest)
            return true;
        else
            return this.type === 'close' ? a <= b : a < b;
    }

    toBracket(): ['(', ')'] | ['[', ']'] {
        return this === BoundType.OPEN ? ['(', ')'] : ['[', ']'];
    }

    toInequality(): ['<', '>'] | ['<=', '>='] {
        return this === BoundType.OPEN ? ['<', '>'] : ['<=', '>='];
    }

    static parse(str: '(' | '[' | ']' | ')'): BoundType {
        if (str === '(' || str === ')')
            return BoundType.OPEN;
        else
            return BoundType.CLOSED;
    }
}

export class Uppest {
    private static instance: Uppest | null = null;

    constructor(private temp: number) {}

    static get INSTANCE(): Uppest {
        if (Uppest.instance === null) {
            Uppest.instance = new Uppest(0);
        }
        return Uppest.instance;
    }

    toString(): string {
        return '+∞';
    }
}

export class Lowest {
    private static instance: Lowest | null = null;

    constructor(private temp: number) {}

    static get INSTANCE(): Lowest {
        if (Lowest.instance === null) {
            Lowest.instance = new Lowest(0);
        }
        return Lowest.instance;
    }

    toString(): string {
        return '-∞';
    }
}
