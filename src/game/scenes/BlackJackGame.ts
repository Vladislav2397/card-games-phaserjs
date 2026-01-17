import { Scene } from 'phaser'

export class BlackJackGame extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    msg_text: Phaser.GameObjects.Text

    constructor() {
        super('BlackJackGame')
    }

    create() {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x00ff00)

        this.msg_text = this.add.text(
            600,
            384,
            'Black Jack',
            {
                fontFamily: 'Arial Black',
                fontSize: 38,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            },
        )
        this.msg_text.setOrigin(0.5)

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver')
        })
    }
}
