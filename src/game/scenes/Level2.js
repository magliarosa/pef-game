import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Level2 extends Scene {
    constructor() {
        super('Level2');
    }

    preload() {
        this.load.image('backgroundLv2', 'assets/level2/bg.png');
        this.load.image('platformLv2', 'assets/level2/platform.png');
        this.load.image('characterLv2', 'assets/level2/character.png');
        this.load.image('star', 'assets/star.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0');

        this.add.image(512, 384, 'backgroundLv2').setAlpha(0.5);

        var platforms = this.physics.add.staticGroup();
        platforms.create(750, 140, 'platformLv2').refreshBody();
        platforms.create(250, 300, 'platformLv2').refreshBody();
        platforms.create(250, 700, 'platformLv2').refreshBody();
        platforms.create(800, 500, 'platformLv2').refreshBody();
        
        
        this.player = this.physics.add.sprite(100, 600, 'characterLv2');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.physics.add.collider(this.player, platforms);
        this.star = this.physics.add.sprite(900, 80, 'star');
        this.star.body.setAllowGravity(false);
        
        this.physics.add.overlap(this.player, this.star, () => {
            this.star.disableBody(true, true);
            this.changeScene();
            console.log('star');
        }, null, this);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('GameOver');
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-900);
        }
    }
}