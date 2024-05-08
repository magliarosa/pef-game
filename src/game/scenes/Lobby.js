import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Lobby extends Scene {
    constructor() {
        super('Lobby');
    }

    preload() {
        this.load.image('backgroundLv1', 'assets/level1/bg.png');
        this.load.image('platformLobby', 'assets/level1/platform.png');
        this.load.image('characterLv1', 'assets/level1/character.png');
        this.load.image('star', 'assets/star.png');
        this.load.audio('audio_1a', 'assets/level1/1A.wav');
        this.load.audio('audio_1b', 'assets/level1/1B.wav');
    }

    create() {
        //scene name
        this.add.text(10, this.cameras.main.height - 30, 'Scene: Lobby', { fontSize: '20px', fill: '#FFFF00' });
        this.sound1a = this.sound.add('audio_1a');
        this.sound1a.play({ loop: true });

        this.sound1b = this.sound.add('audio_1b');
        this.sound1b.play({ loop: true });

        console.log('start lobby');
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0');

        this.add.image(512, 384, 'backgroundLv1').setAlpha(0.5);

        var platforms = this.physics.add.staticGroup();
        platforms.create(500, 700, 'platformLobby')
            .setScale(2, 1)
            .refreshBody();
        platforms.create(250, 450, 'platformLobby')
            .setScale(0.8, 1)
            .refreshBody();

        platforms.create(750, 450, 'platformLobby')
            .setScale(0.8, 1)
            .refreshBody();

        this.player = this.physics.add.sprite(this.sys.game.config.width / 2, 600, 'characterLv1');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player, true);

        this.physics.add.collider(this.player, platforms);


        //door1a
        this.door1a = this.physics.add.sprite(150, 600, 'star');
        this.physics.add.collider(this.door1a, platforms);
        this.physics.add.overlap(this.player, this.door1a, () => {
            this.star.disableBody(true, true);
            this.changeScene('Level1A');
            console.log('star');
        }, null, this);

        //door1b
        this.door1b = this.physics.add.sprite(850, 600, 'star');
        this.physics.add.collider(this.door1b, platforms);
        this.physics.add.overlap(this.player, this.door1b, () => {
            this.star.disableBody(true, true);
            this.changeScene('Level1B');
            console.log('star');
        }, null, this);

        //door2a
        this.star = this.physics.add.sprite(150, 400, 'star');
        this.star.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.star, () => {
            this.star.disableBody(true, true);
            this.changeScene('Level2A');
            console.log('star');
        }, null, this);

        //door2b
        this.star = this.physics.add.sprite(850, 400, 'star');
        this.star.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.star, () => {
            this.star.disableBody(true, true);
            this.changeScene('Level2B');
            console.log('star');
        }, null, this);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene(levelName) {
        this.sound.stopAll();
        this.scene.start(levelName);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.jumps < 1 && this.player.canJump) {
            this.player.setVelocityY(-900);
            this.player.jumps++;
            this.player.canJump = false;
        } else if (this.cursors.up.isUp && this.player.body.velocity.y < 0 && this.player.jumps > 0) {
            this.player.setVelocityY(0);
        }

        if (this.cursors.up.isUp) {
            this.player.canJump = true;
        }

        if (this.player.body.touching.down && !this.player.landing) {
            this.player.landing = true;
            setTimeout(() => {
                this.player.jumps = 0;
                this.player.landing = false;
            }, 200); // delay in milliseconds
        }

        this.adjustDoorVolume(this.door1a, this.sound1a);
        this.adjustDoorVolume(this.door1b, this.sound1b);
    }

    adjustDoorVolume(door, sound) {
        var distance = Math.abs(this.player.x - door.x);
        var maxDistance = 300;
        var adjustedDistance = maxDistance - distance;
        var volume = Math.max(0, adjustedDistance / maxDistance);
        sound.setVolume(volume / 2);
    }
}