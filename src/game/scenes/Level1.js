import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Level1 extends Scene 
{
    constructor ()
    {
        super('Level1');
    }

    preload () {
        this.load.image('backgroundLv1', 'assets/level1/bg.png');
    }

    create () {
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0');

        this.load.image
        this.add.image(512, 384, 'backgroundLv1').setAlpha(0.5);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}