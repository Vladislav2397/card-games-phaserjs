import { Card } from "./Card"

export class Hand {
    private cards: Card[] = []

    constructor(cards: Card[]) {
        this.cards = cards
    }

    public add(cards: Card[]) {
        this.cards.push(...cards)
    }

    public remove(cards: Card[]) {
        this.cards = this.cards.filter(c => !cards.includes(c))
    }

    public hide() {
        this.cards.map(c => c.turn('back'))
    }
    public show() {
        this.cards.map(c => c.turn('front'))
    }

    public displayCards() {
        return this.cards.map(c => c.display()).join(' ')
    }

    public getValue(): number {
        let value = 0
        let aces = 0

        for (const card of this.cards) {
            if (card.side === 'back') {
                continue
            }

            const rank = card.rank
            if (rank === 'A') {
                aces++
                value += 11
            } else if (['J', 'Q', 'K'].includes(rank)) {
                value += 10
            } else {
                value += parseInt(rank, 10)
            }
        }

        // Корректируем значение тузов, если перебор
        while (value > 21 && aces > 0) {
            value -= 10
            aces--
        }

        return value
    }

    public getCards(): Card[] {
        return [...this.cards]
    }
}
