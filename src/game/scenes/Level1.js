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
        this.load.image('platformLv1', 'assets/level1/platform.png');
    }

    create () {
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0');

        this.add.image(512, 384, 'backgroundLv1').setAlpha(0.5);
        
        var platforms = this.physics.add.staticGroup();
        platforms.create(300, 700, 'platformLv1').setScale(0.13).refreshBody();
        


        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}