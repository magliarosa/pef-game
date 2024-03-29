import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Level1 } from './scenes/Level1';
import { Level2 } from './scenes/Level2';
import { StartScene } from './scenes/StartScene';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver,
        StartScene,
        Level1,
        Level2
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1800 },
            debug: false
        }
    }
};

const StartGame = (parent) => {

    return new Phaser.Game({...config, parent: parent});

}

export default StartGame;
