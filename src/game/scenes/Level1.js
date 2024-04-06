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
        this.load.image('enemyLv1', 'assets/level1/enemy.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('enemy', 'assets/level1/enemy_spritesheet.png', { frameWidth: 324, frameHeight: 452 });
        this.load.audio('audio_1a', 'assets/level1/1A.wav');
        this.load.audio('audio_1b', 'assets/level1/1B.wav');
    }

    create() {
        this.sound1a = this.sound.add('audio_1a');
        this.sound1a.play({ loop: true });

        this.sound1b = this.sound.add('audio_1b');
        this.sound1b.play({ loop: true });

        console.log('start level1');
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0');

        this.add.image(512, 384, 'backgroundLv1').setAlpha(0.5);

        var platforms = this.physics.add.staticGroup();
        platforms.create(500, 700, 'platformLv1')
            .setScale(2, 1)
            .refreshBody();
        platforms.create(250, 400, 'platformLv1').refreshBody();

        this.player = this.physics.add.sprite(this.sys.game.config.width / 2, 600, 'characterLv1');
        // this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player, true);

        this.physics.add.collider(this.player, platforms);
        this.star = this.physics.add.sprite(150, 330, 'star');
        this.star.body.setAllowGravity(false);

        this.physics.add.overlap(this.player, this.star, () => {
            this.star.disableBody(true, true);
            this.changeScene();
            console.log('star');
        }, null, this);

        this.CreateEnemy1(platforms);

        //door1a
        this.door1a = this.physics.add.sprite(150, 600, 'star');
        this.physics.add.collider(this.door1a, platforms);
        //door1b
        this.door1b = this.physics.add.sprite(850, 600, 'star');
        this.physics.add.collider(this.door1b, platforms);



        EventBus.emit('current-scene-ready', this);
    }

    CreateEnemy1(platforms) {
        this.enemy = this.physics.add.sprite(300, 330, 'enemy').setScale(0.25);
        this.enemy.setBounce(0);
        this.enemy.setCollideWorldBounds(true);
        this.enemy.anims.create({
            key: 'enemy',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 23 }),
            frameRate: 24,
            repeat: -1
        });
        this.enemy.anims.play('enemy', true);
        this.physics.add.collider(this.player, this.enemy, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.enemy, platforms);

        this.tweens.add({
            targets: this.enemy,
            x: '+=80', // move the enemy 200 pixels to the right
            ease: 'Linear', // 'Linear' is the default easing function
            duration: 1000, // 2000ms = 2s
            yoyo: true, // make the tween reverse direction automatically
            repeat: -1,
        });
    }

    handlePlayerEnemyCollision(player, enemy) {
        this.scene.start('GameOver');
    }

    changeScene() {
        this.scene.start('Level2');
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
        // this.adjustDoorVolume(this.door1b);
    }

    adjustDoorVolume(door, sound) {
        var distance = Math.abs(this.player.x - door.x);
        var maxDistance = 300;
        var adjustedDistance = maxDistance - distance;
        var volume = Math.max(0, adjustedDistance / maxDistance);
        sound.setVolume(volume / 2);
    }
}