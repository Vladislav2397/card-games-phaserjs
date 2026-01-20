import { Scene } from 'phaser'
import { BlackJackLogic } from '../black-jack/BlackJackLogic'
import { Card } from '../black-jack/Card'

export class BlackJackGame extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    msg_text: Phaser.GameObjects.Text
    logic: BlackJackLogic
    dealerText: Phaser.GameObjects.Text
    playerText: Phaser.GameObjects.Text
    dealerValueText: Phaser.GameObjects.Text
    playerValueText: Phaser.GameObjects.Text
    resultText: Phaser.GameObjects.Text
    hitButton: Phaser.GameObjects.Text
    standButton: Phaser.GameObjects.Text
    newGameButton: Phaser.GameObjects.Text
    playerCardSprites: Phaser.GameObjects.Sprite[] = []
    dealerCardSprites: Phaser.GameObjects.Sprite[] = []
    dealerCardBackElements: Phaser.GameObjects.GameObject[] = []
    playerCardBackElements: Phaser.GameObjects.GameObject[] = []

    constructor() {
        super('BlackJackGame')
    }

    create() {
        this.logic = new BlackJackLogic()
        this.logic.startGame()

        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x2d5016)

        const WIDTH = this.camera.width
        const HEIGHT = this.camera.height

        console.log({ WIDTH, HEIGHT })

        // Текстовые элементы будут созданы в renderHand
        this.dealerText = null as any
        this.dealerValueText = null as any
        this.playerText = null as any
        this.playerValueText = null as any

        this.resultText = this.add
            .text(WIDTH / 2, HEIGHT - 200, '', {
                fontSize: WIDTH > 600 ? '32px' : '24px',
                color: '#00ff00',
                fontStyle: 'bold',
            })
            .setOrigin(0.5)

        // Кнопки
        this.hitButton = this.add
            .text(100, HEIGHT - 50, 'Hit', {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#0066cc',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0, 1)
            .setInteractive({ useHandCursor: true })

        this.standButton = this.add
            .text(WIDTH - 100, HEIGHT - 50, 'Stand', {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#cc6600',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(1, 1)
            .setInteractive({ useHandCursor: true })

        this.newGameButton = this.add
            .text(WIDTH / 2, HEIGHT - 130, 'New Game', {
                fontSize: '20px',
                color: '#ffffff',
                backgroundColor: '#009900',
                padding: { x: 15, y: 8 },
            })
            .setOrigin(0.5, 1)
            .setInteractive({ useHandCursor: true })
            .setVisible(false)

        // Обработчики событий
        this.hitButton.on('pointerdown', () => {
            if (!this.logic.isGameOver()) {
                this.logic.hit()
                this.updateCardSprites()
                this.updateTexts()
                this.updateButtons()
            }
        })

        this.hitButton.on('pointerover', () => {
            if (!this.logic.isGameOver()) {
                this.hitButton.setScale(1.1)
            }
        })

        this.hitButton.on('pointerout', () => {
            this.hitButton.setScale(1)
        })

        this.standButton.on('pointerdown', () => {
            if (!this.logic.isGameOver()) {
                this.logic.stand()
                this.updateCardSprites()
                this.updateTexts()
                this.updateButtons()
            }
        })

        this.standButton.on('pointerover', () => {
            if (!this.logic.isGameOver()) {
                this.standButton.setScale(1.1)
            }
        })

        this.standButton.on('pointerout', () => {
            this.standButton.setScale(1)
        })

        this.newGameButton.on('pointerdown', () => {
            this.startNewGame()
        })

        this.newGameButton.on('pointerover', () => {
            this.newGameButton.setScale(1.1)
        })

        this.newGameButton.on('pointerout', () => {
            this.newGameButton.setScale(1)
        })

        // Первоначальное обновление
        this.updateCardSprites()
        this.updateTexts()
        this.updateButtons()
    }

    private updateTexts() {
        const dealerValue = this.logic.getDealerValue()
        const playerValue = this.logic.getPlayerValue()

        if (this.dealerValueText) {
            this.dealerValueText.text = `Очки: ${dealerValue}`
            // Подсветка перебора
            if (dealerValue > 21) {
                this.dealerValueText.setColor('#ff0000')
            } else {
                this.dealerValueText.setColor('#ffff00')
            }
        }

        if (this.playerValueText) {
            this.playerValueText.text = `Очки: ${playerValue}`
            // Подсветка перебора
            if (playerValue > 21) {
                this.playerValueText.setColor('#ff0000')
            } else {
                this.playerValueText.setColor('#ffff00')
            }
        }

        const resultMessage = this.logic.getResultMessage()
        this.resultText.text = resultMessage
    }

    private updateButtons() {
        const isGameOver = this.logic.isGameOver()

        if (isGameOver) {
            this.hitButton.setAlpha(0.5)
            this.hitButton.disableInteractive()
            this.standButton.setAlpha(0.5)
            this.standButton.disableInteractive()
            this.newGameButton.setVisible(true)
        } else {
            this.hitButton.setAlpha(1)
            this.hitButton.setInteractive({ useHandCursor: true })
            this.standButton.setAlpha(1)
            this.standButton.setInteractive({ useHandCursor: true })
            this.newGameButton.setVisible(false)
        }
    }

    private startNewGame() {
        this.logic.startGame()
        this.updateCardSprites()
        this.updateTexts()
        this.updateButtons()
    }

    private updateCardSprites() {
        // Удаляем старые спрайты и тексты
        this.playerCardSprites.forEach(sprite => sprite.destroy())
        this.dealerCardSprites.forEach(sprite => sprite.destroy())
        this.dealerCardBackElements.forEach(element => element.destroy())
        this.playerCardBackElements.forEach(element => element.destroy())
        if (this.dealerText) this.dealerText.destroy()
        if (this.dealerValueText) this.dealerValueText.destroy()
        if (this.playerText) this.playerText.destroy()
        if (this.playerValueText) this.playerValueText.destroy()

        this.playerCardSprites = []
        this.dealerCardSprites = []
        this.dealerCardBackElements = []
        this.playerCardBackElements = []

        // Отображаем руки
        this.renderHand('Дилер', this.logic.getDealerCards(), 150, true)
        this.renderHand('Игрок', this.logic.getPlayerCards(), 280, false)
    }

    private renderHand(
        name: string,
        cards: Card[],
        yPosition: number,
        isDealer: boolean,
    ) {
        const CARD_SPRITE_WIDTH = 100
        const CARD_SPRITE_HEIGHT = 150
        const CARD_SCALE = 0.8
        const CARD_SPACING = 50
        const NAME_START_X = 30
        const CARDS_START_X = 180

        // Создаем текстовые элементы для названия и очков
        let nameText: Phaser.GameObjects.Text
        let valueText: Phaser.GameObjects.Text

        if (isDealer) {
            nameText = this.add
                .text(NAME_START_X, yPosition - 15, name, {
                    fontSize: '24px',
                    color: '#ffffff',
                })
                .setOrigin(0, 0.5)

            const dealerValue = this.logic.getDealerValue()
            valueText = this.add
                .text(NAME_START_X, yPosition + 15, `Очки: ${dealerValue}`, {
                    fontSize: '20px',
                    color: '#ffff00',
                })
                .setOrigin(0, 0.5)

            this.dealerText = nameText
            this.dealerValueText = valueText
        } else {
            nameText = this.add
                .text(NAME_START_X, yPosition - 15, name, {
                    fontSize: '24px',
                    color: '#ffffff',
                })
                .setOrigin(0, 0.5)

            const playerValue = this.logic.getPlayerValue()
            valueText = this.add
                .text(NAME_START_X, yPosition + 15, `Очки: ${playerValue}`, {
                    fontSize: '20px',
                    color: '#ffff00',
                })
                .setOrigin(0, 0.5)

            this.playerText = nameText
            this.playerValueText = valueText
        }

        // Отображаем карты
        cards.forEach((card, index) => {
            const x = CARDS_START_X + index * CARD_SPACING
            const y = yPosition

            if (card.side === 'back') {
                // Для закрытой карты создаем прямоугольник-заглушку
                const rect = this.add
                    .rectangle(
                        x,
                        y,
                        CARD_SPRITE_WIDTH - 2,
                        CARD_SPRITE_HEIGHT - 2,
                        0x1a1a1a,
                    )
                    .setScale(CARD_SCALE)
                rect.setStrokeStyle(2, 0xffffff)
                // Добавляем текст "?"
                const backText = this.add
                    .text(x, y, '?', {
                        fontSize: '32px',
                        color: '#ffffff',
                        fontStyle: 'bold',
                    })
                    .setOrigin(0.5)

                if (isDealer) {
                    this.dealerCardBackElements.push(rect, backText)
                } else {
                    // Игрок не должен иметь закрытых карт, но на всякий случай
                    this.playerCardBackElements.push(rect, backText)
                }
            } else {
                const frameName = `${card.rank}${card.unit}`
                const sprite = this.add.sprite(x, y, 'cards', frameName)
                sprite.setScale(CARD_SCALE)

                if (isDealer) {
                    this.dealerCardSprites.push(sprite)
                } else {
                    this.playerCardSprites.push(sprite)
                }
            }
        })
    }
}
