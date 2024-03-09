import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveLogo, setCanMoveLogo] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            scene.changeScene();
        }
    }

    const moveSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene && scene.scene.key === 'MainMenu') {
            // Get the update logo position
            scene.moveLogo(({ x, y }) => {

                setLogoPosition({ x, y });

            });
        }
    }

    const addSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            // Add more stars
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            const star = scene.add.sprite(x, y, 'star');

            //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
            //  You could, of course, do this from within the Phaser Scene code, but this is just an example
            //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: -1
            });
        }
    }

    const stopCurrentScene = () => {
        if (phaserRef.current && phaserRef.current.game) {
            var currentSceneKey = getCurrentSceneKey(phaserRef.current.game);
            phaserRef.current.game.scene.stop(currentSceneKey);
        }
    };

    const resetGame = () => {
        if (phaserRef.current && phaserRef.current.game) {
            stopCurrentScene();
            phaserRef.current.game.scene.start('StartScene');
        }
    }

    const setLevel = (levelNo) => {
        if (phaserRef.current && phaserRef.current.game) {
            stopCurrentScene();
            phaserRef.current.game.scene.start('Level' + levelNo);
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        setCanMoveLogo(scene.scene.key !== 'MainMenu');
    }

    const getCurrentSceneKey = (game) => {
        let currentSceneKey = null;
        const scenes = game.scene.scenes;
        for (let scene of scenes) {
            if (scene.sys.isActive()) {
                currentSceneKey = scene.sys.settings.key;
                break;
            }
        }
        return currentSceneKey;
    }


    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button className='button' onClick={resetGame}>Reset game</button>
                </div>
                <div>
                    <button className='button' onClick={() => setLevel(1)}>Level 1</button>
                </div>
                <div>
                    <button className='button' onClick={() => setLevel(2)}>Level 2</button>
                </div>
            </div>
        </div>
    )
}

export default App
