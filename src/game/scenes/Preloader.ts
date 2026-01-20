import { Scene } from 'phaser'

const IMAGE_WIDTH = 1300
const IMAGE_HEIGHT = 600

const CARD_WIDTH = IMAGE_WIDTH / 13
const CARD_HEIGHT = IMAGE_HEIGHT / 4

function generateAtlasJSON() {
    const ranks: Rank[] = [
        'A',
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
    ]
    const suits: Unit[] = ['♠', '♥', '♦', '♣']

    const frames = []
    for (const suit of suits) {
        for (const rank of ranks) {
            frames.push({
                filename: `${rank}${suit}`,
                frame: {
                    x: ranks.indexOf(rank) * CARD_WIDTH,
                    y: suits.indexOf(suit) * CARD_HEIGHT,
                    w: CARD_WIDTH,
                    h: CARD_HEIGHT,
                },
                rotated: false,
                trimmed: false,
                spriteSourceSize: {
                    x: 0,
                    y: 0,
                    w: CARD_WIDTH,
                    h: CARD_HEIGHT,
                },
                sourceSize: {
                    w: CARD_WIDTH,
                    h: CARD_HEIGHT,
                },
                pivot: {
                    x: 0.5,
                    y: 0.5,
                },
            })
        }
    }

    return {
        frames,
        meta: {
            version: '1.0',
            image: 'desk-of-cards.png',
            format: 'RGBA8888',
            size: {
                w: IMAGE_WIDTH,
                h: IMAGE_HEIGHT,
            },
            scale: '1',
            smartupdate:
                '$TexturePacker:SmartUpdate:5e8f90752cfd57d3adfb39bcd3eef1b6:87d98cec6fa616080f731b87726d6a1e:b55588eba103b49b35a0a59665ed84fd$',
        },
    }
}

export class Preloader extends Scene {
    constructor() {
        super('Preloader')
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background')

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress
        })
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets')

        this.load.image('logo', 'logo.png')
        // this.load.image('cards', 'desk-of-cards.png')

        const atlasJSON = generateAtlasJSON()
        console.log(atlasJSON)

        this.load.atlas('cards', 'desk-of-cards.png', atlasJSON)
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.pageAlignHorizontally = true;
        // this.scale.pageAlignVertically = true;
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('BlackJackGame')
    }
}
