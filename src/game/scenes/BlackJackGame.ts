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

    constructor() {
        super('BlackJackGame')
    }

    create() {
        this.logic = new BlackJackLogic()
        this.logic.startGame()

        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x2d5016)

        // Создаем текстовые элементы
        this.dealerText = this.add.text(600, 200, '', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5)

        this.dealerValueText = this.add.text(600, 240, '', {
            fontSize: '20px',
            color: '#ffff00'
        }).setOrigin(0.5)

        this.playerText = this.add.text(600, 320, '', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5)

        this.playerValueText = this.add.text(600, 360, '', {
            fontSize: '20px',
            color: '#ffff00'
        }).setOrigin(0.5)

        this.resultText = this.add.text(600, 420, '', {
            fontSize: '32px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5)

        // Кнопки
        this.hitButton = this.add.text(500, 500, 'Hit', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#0066cc',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })

        this.standButton = this.add.text(700, 500, 'Stand', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#cc6600',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })

        this.newGameButton = this.add.text(600, 560, 'New Game', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#009900',
            padding: { x: 15, y: 8 }
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
    }

    private updateTexts() {
        this.dealerText.text = `Dealer: ${this.logic.displayDealerHand()}`
        this.playerText.text = `Player: ${this.logic.displayPlayerHand()}`

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
    }
}
