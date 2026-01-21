import { Card, Rank as CardRank, Unit as CardUnit } from './Card'

const ranks: CardRank[] = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
]
const units: CardUnit[] = ['♠', '♥', '♦', '♣']

export class Desk {
    private cards: Card[] = []

    constructor() {
        this.initialize()
    }

    public initialize() {
        this.cards = this.createCards()
    }

    private createCards() {
        const cards: Card[] = []

        for (const rank of ranks) {
            for (const unit of units) {
                cards.push(new Card(rank, unit))
            }
        }

        return cards
    }

    public shuffle() {
        this.cards = shuffle(this.cards)
    }

    public pick(from: 'top' | 'bottom', count = 1) {
        if (from === 'top') {
            return this.cards.splice(0, count)
        }

        return this.cards.splice(-count)
    }
}

function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5)
}
