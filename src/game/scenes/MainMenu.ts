import { Scene, GameObjects } from 'phaser'

export class MainMenu extends Scene {
    background: GameObjects.Image
    logo: GameObjects.Image
    title: GameObjects.Text
    posY = 480

    constructor() {
        super('MainMenu')
    }

    create() {
        this.logo = this.add.image(600, 300, 'logo')

        this.title = this.add
            .text(600, 400, 'Main Menu', {
                fontFamily: 'Arial Black',
                fontSize: 38,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            })
        this.title.setOrigin(0.5)

        this.addMenuItem('Black Jack', () => {
            this.scene.start('BlackJackGame')
        })

        // this.input.once('pointerdown', () => {
        //     this.scene.start('Game')
        // })
    }

    private addMenuItem(text: string, cb: () => void) {
        const item = this.add
            .text(600, this.posY, text, {
                fontFamily: 'Arial Black',
                fontSize: 28,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            })
        item.setInteractive()
        item.setOrigin(0.5)

        item.once('pointerdown', cb)
    }
}
