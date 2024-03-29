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
    }

    create() {
        console.log('start level1');
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
        this.star = this.physics.add.sprite(150, 330, 'star');
        this.star.body.setAllowGravity(false);

        this.physics.add.overlap(this.player, this.star, () => {
            this.star.disableBody(true, true);
            this.changeScene();
            console.log('star');
        }, null, this);

        this.CreateEnemy1(platforms);

        EventBus.emit('current-scene-ready', this);
    }

    CreateEnemy1(platforms) {
        this.enemy = this.physics.add.sprite(300, 330, 'enemy').setScale(0.25);
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

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-900);
        }
    }
}