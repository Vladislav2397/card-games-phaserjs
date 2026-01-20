import { Scene } from 'phaser'
import { BlackJackLogic } from '../black-jack/BlackJackLogic'

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

    constructor() {
        super('BlackJackGame')
    }

    create() {
        this.logic = new BlackJackLogic()
        this.logic.startGame()

        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x2d5016)

        // Создаем текстовые элементы
        this.dealerText = this.add
            .text(600, 100, 'Дилер', {
                fontSize: '24px',
                color: '#ffffff',
            })
            .setOrigin(0.5)

        this.dealerValueText = this.add
            .text(600, 140, '', {
                fontSize: '20px',
                color: '#ffff00',
            })
            .setOrigin(0.5)

        this.playerText = this.add
            .text(600, 280, 'Игрок', {
                fontSize: '24px',
                color: '#ffffff',
            })
            .setOrigin(0.5)

        this.playerValueText = this.add
            .text(600, 320, '', {
                fontSize: '20px',
                color: '#ffff00',
            })
            .setOrigin(0.5)

        this.resultText = this.add
            .text(600, 420, '', {
                fontSize: '32px',
                color: '#00ff00',
                fontStyle: 'bold',
            })
            .setOrigin(0.5)

        // Кнопки
        this.hitButton = this.add
            .text(500, 500, 'Hit', {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#0066cc',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        this.standButton = this.add
            .text(700, 500, 'Stand', {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#cc6600',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        this.newGameButton = this.add
            .text(600, 560, 'New Game', {
                fontSize: '20px',
                color: '#ffffff',
                backgroundColor: '#009900',
                padding: { x: 15, y: 8 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setVisible(false)

        // Обработчики событий
        this.hitButton.on('pointerdown', () => {
            if (!this.logic.isGameOver()) {
                this.logic.hit()
                this.updateTexts()
                this.updateButtons()
                this.updateCardSprites()
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
                this.updateTexts()
                this.updateButtons()
                this.updateCardSprites()
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
        this.updateTexts()
        this.updateButtons()
        this.updateCardSprites()
    }

    private updateTexts() {
        const dealerValue = this.logic.getDealerValue()
        const playerValue = this.logic.getPlayerValue()

        this.dealerValueText.text = `Очки: ${dealerValue}`
        this.playerValueText.text = `Очки: ${playerValue}`

        const resultMessage = this.logic.getResultMessage()
        this.resultText.text = resultMessage

        // Подсветка перебора
        if (dealerValue > 21) {
            this.dealerValueText.setColor('#ff0000')
        } else {
            this.dealerValueText.setColor('#ffff00')
        }

        if (playerValue > 21) {
            this.playerValueText.setColor('#ff0000')
        } else {
            this.playerValueText.setColor('#ffff00')
        }
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
        this.updateTexts()
        this.updateButtons()
        this.updateCardSprites()
    }

    private updateCardSprites() {
        // Удаляем старые спрайты
        this.playerCardSprites.forEach(sprite => sprite.destroy())
        this.dealerCardSprites.forEach(sprite => sprite.destroy())
        this.dealerCardBackElements.forEach(element => element.destroy())
        this.playerCardSprites = []
        this.dealerCardSprites = []
        this.dealerCardBackElements = []

        const CARD_SPRITE_WIDTH = 61
        const CARD_SPRITE_HEIGHT = 81
        const CARD_SCALE = 0.8
        const CARD_SPACING = 70
        const DEALER_START_X = 200
        const DEALER_START_Y = 180
        const PLAYER_START_X = 200
        const PLAYER_START_Y = 360

        // Отображаем карты дилера
        const dealerCards = this.logic.getDealerCards()
        dealerCards.forEach((card, index) => {
            const x = DEALER_START_X + index * CARD_SPACING
            const y = DEALER_START_Y

            if (card.side === 'back') {
                // Для закрытой карты создаем прямоугольник-заглушку
                const rect = this.add.rectangle(
                    x,
                    y,
                    CARD_SPRITE_WIDTH * CARD_SCALE,
                    CARD_SPRITE_HEIGHT * CARD_SCALE,
                    0x1a1a1a,
                )
                rect.setStrokeStyle(2, 0xffffff)
                // Добавляем текст "?"
                const backText = this.add
                    .text(x, y, '?', {
                        fontSize: '32px',
                        color: '#ffffff',
                        fontStyle: 'bold',
                    })
                    .setOrigin(0.5)

                this.dealerCardBackElements.push(rect, backText)
            } else {
                const frameName = `${card.rank}${card.unit}`
                const sprite = this.add.sprite(x, y, 'cards', frameName)
                sprite.setScale(CARD_SCALE)
                this.dealerCardSprites.push(sprite)
            }
        })

        // Отображаем карты игрока
        const playerCards = this.logic.getPlayerCards()
        playerCards.forEach((card, index) => {
            const x = PLAYER_START_X + index * CARD_SPACING
            const y = PLAYER_START_Y

            const frameName = `${card.rank}${card.unit}`
            const sprite = this.add.sprite(x, y, 'cards', frameName)
            sprite.setScale(CARD_SCALE)
            this.playerCardSprites.push(sprite)
        })
    }
}
