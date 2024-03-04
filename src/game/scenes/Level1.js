import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Level1 extends Scene {
    constructor() {
        super('Level1');
    }

    preload() {
        this.load.image('backgroundLv1', 'assets/level1/bg.png');
        this.load.image('platformLv1', 'assets/level1/platform.png');
        this.load.image('characterLv1', 'assets/level1/character.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0');

        this.add.image(512, 384, 'backgroundLv1').setAlpha(0.5);

        var platforms = this.physics.add.staticGroup();
        platforms.create(300, 700, 'platformLv1').refreshBody();
        platforms.create(800, 550, 'platformLv1').refreshBody();
        platforms.create(250, 400, 'platformLv1').refreshBody();

        this.player = this.physics.add.sprite(100, 600, 'characterLv1');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, platforms);

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