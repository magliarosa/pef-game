import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Level1A } from './scenes/Level1A';
import { StartScene } from './scenes/StartScene';
import { Lobby } from './scenes/Lobby';
import { Level1B } from './scenes/Level1B';
import { Level2A } from './scenes/Level2A';
import { Level2B } from './scenes/Level2B';

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
        Lobby,
        Level1A,
        Level1B,
        Level2A,
        Level2B
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
