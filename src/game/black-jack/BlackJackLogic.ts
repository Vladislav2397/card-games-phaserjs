import { Desk } from "./Desk"
import { Hand } from "./Hand"

export type GameState = 'playing' | 'playerWon' | 'dealerWon' | 'tie' | 'playerBust' | 'dealerBust'

export class BlackJackLogic {
    private desk: Desk
    private playerHand: Hand
    private dealerHand: Hand
    private turn: 'player' | 'dealer' = 'player'
    private gameState: GameState = 'playing'

    constructor() {
        this.desk = new Desk()
        this.playerHand = new Hand([])
        this.dealerHand = new Hand([])
    }

    public startGame() {
        this.desk = new Desk()
        this.playerHand = new Hand([])
        this.dealerHand = new Hand([])
        this.turn = 'player'
        this.gameState = 'playing'

        this.desk.shuffle()

        this.playerHand.add(this.desk.pick('top', 2))
        this.dealerHand.add(this.desk.pick('top', 2))

        // Скрываем первую карту дилера
        const dealerCards = this.dealerHand.getCards()
        if (dealerCards.length > 0) {
            dealerCards[0].turn('back')
        }

        // Проверяем блэкджек при старте
        // Временно показываем карты дилера для проверки
        const dealerCardsForCheck = this.dealerHand.getCards()
        const firstCardWasHidden = dealerCardsForCheck.length > 0 && dealerCardsForCheck[0].side === 'back'

        if (firstCardWasHidden) {
            dealerCardsForCheck[0].turn('front')
        }

        const playerHasBlackJack = this.isBlackJack(this.playerHand)
        const dealerHasBlackJack = this.isBlackJack(this.dealerHand)

        if (firstCardWasHidden) {
            dealerCardsForCheck[0].turn('back')
        }

        if (playerHasBlackJack || dealerHasBlackJack) {
            this.dealerHand.show()
            if (playerHasBlackJack && dealerHasBlackJack) {
                this.gameState = 'tie'
            } else if (playerHasBlackJack) {
                this.gameState = 'playerWon'
            } else {
                this.gameState = 'dealerWon'
            }
        }
    }

    public displayPlayerHand() {
        return this.playerHand.displayCards()
    }

    public displayDealerHand() {
        return this.dealerHand.displayCards()
    }

    public displayTurn() {
        return this.turn
    }

    public getPlayerValue(): number {
        return this.playerHand.getValue()
    }

    public getDealerValue(): number {
        return this.dealerHand.getValue()
    }

    public getGameState(): GameState {
        return this.gameState
    }

    public isGameOver(): boolean {
        return this.gameState !== 'playing'
    }

    private isBlackJack(hand: Hand): boolean {
        const cards = hand.getCards()
        if (cards.length !== 2) return false

        const values = cards.map(c => c.rank)
        const hasAce = values.includes('A')
        const hasTen = ['10', 'J', 'Q', 'K'].some(rank => values.includes(rank))

        return hasAce && hasTen
    }

    private isBust(hand: Hand): boolean {
        return hand.getValue() > 21
    }

    public hit() {
        if (this.gameState !== 'playing' || this.turn !== 'player') {
            return
        }

        this.playerHand.add(this.desk.pick('top', 1))

        if (this.isBust(this.playerHand)) {
            this.gameState = 'playerBust'
            this.dealerHand.show()
        } else if (this.getPlayerValue() === 21) {
            // Автоматически переходим к дилеру при 21
            this.stand()
        }
    }

    public stand() {
        if (this.gameState !== 'playing' || this.turn !== 'player') {
            return
        }

        this.turn = 'dealer'
        this.dealerHand.show()
        this.playDealerTurn()
    }

    private playDealerTurn() {
        // Дилер берет карты до 17 или больше
        while (this.dealerHand.getValue() < 17 && this.gameState === 'playing') {
            this.dealerHand.add(this.desk.pick('top', 1))

            if (this.isBust(this.dealerHand)) {
                this.gameState = 'dealerBust'
                return
            }
        }

        // Определяем победителя
        if (this.gameState === 'playing') {
            this.determineWinner()
        }
    }

    private determineWinner() {
        const playerValue = this.playerHand.getValue()
        const dealerValue = this.dealerHand.getValue()

        if (playerValue > dealerValue) {
            this.gameState = 'playerWon'
        } else if (dealerValue > playerValue) {
            this.gameState = 'dealerWon'
        } else {
            this.gameState = 'tie'
        }
    }

    public getResultMessage(): string {
        switch (this.gameState) {
            case 'playerWon':
                return 'Вы выиграли!'
            case 'dealerWon':
                return 'Дилер выиграл!'
            case 'tie':
                return 'Ничья!'
            case 'playerBust':
                return 'Перебор! Дилер выиграл!'
            case 'dealerBust':
                return 'Дилер перебрал! Вы выиграли!'
            default:
                return ''
        }
    }
}
