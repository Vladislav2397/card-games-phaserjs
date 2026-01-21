export type Rank =
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | 'J'
    | 'Q'
    | 'K'
    | 'A'
export type Unit = '♠' | '♥' | '♦' | '♣'

export class Card {
    rank: string
    unit: string
    side: 'front' | 'back'

    constructor(rank: Rank, unit: Unit) {
        this.rank = rank
        this.unit = unit
        this.side = 'front'
    }

    turn(side?: 'front' | 'back') {
        if (side) {
            this.side = side
            return
        }

        this.side = this.side === 'front' ? 'back' : 'front'
    }

    display() {
        if (this.side === 'back') {
            return '**'
        }

        return `${this.rank}${this.unit}`
    }
}
