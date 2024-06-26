import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Level1A extends Scene {
    constructor() {
        super('Level1A');
    }

    preload() {
        this.load.image('backgroundLv2', 'assets/level2/bg.png');
        this.load.image('platformLv2', 'assets/level2/platform.png');
        this.load.image('characterLv2', 'assets/level2/character.png');
        this.load.image('enemyLv2', 'assets/level2/enemy.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('enemy', 'assets/level2/enemy_spritesheet.png', { frameWidth: 324, frameHeight: 452 });
    }

    create() {
        //scene name
        this.add.text(10, this.cameras.main.height - 30, 'Scene: Level1A', { fontSize: '20px', fill: '#FFFF00' });

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

        this.CreateEnemy1(platforms);

        this.cameras.main.startFollow(this.player, true);

        EventBus.emit('current-scene-ready', this);
    }

    handlePlayerEnemyCollision(player, enemy) {
        this.scene.start('GameOver');
    }

    changeScene() {
        this.scene.start('Lobby');
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

    CreateEnemy1(platforms) {
        this.enemy = this.physics.add.sprite(220, 200, 'enemy').setScale(0.25);
        this.enemy.setBounce(0.2);
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
            x: '+=180', // move the enemy 200 pixels to the right
            ease: 'Linear', // 'Linear' is the default easing function
            duration: 800, // 2000ms = 2s
            yoyo: true, // make the tween reverse direction automatically
            repeat: -1, // repeat the tween indefinitely
        });
    }
}