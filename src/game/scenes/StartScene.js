import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class StartScene extends Scene
{
    constructor ()
    {
        super('StartScene');
    }

    preload() {
        this.load.image('backgroundStart', 'assets/startScene/bg.png');
    }

    create ()
    {
        this.add.image(512, 384, 'backgroundStart');

        let titleButton = this.add.text(320, 100, 'PEF Game', {
            fontFamily: 'Arial Black', fontSize: 70, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })

        let startButton = this.add.text(512, 550, 'START', {
            fontFamily: 'Arial Black', fontSize: 70, color: '#234cba',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.changeScene();
        })
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Level1');
    }
}
