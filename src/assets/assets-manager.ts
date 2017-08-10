import { Action, Action01 } from '../common/util';

import '../../data/images/Iori-Select.png';
import '../../data/images/Kyo-Select.png';
import '../../data/images/Leona-Select.png';
import '../../data/images/May-Select.png';

import '../../data/images/backgrounds/menu.png';
import '../../data/images/backgrounds/Player-Select.jpg';
import '../../data/images/backgrounds/controls.jpg';
import '../../data/images/backgrounds/splash.png';


import '../../data/spritesheets/Anoel-0.png';
import '../../data/spritesheets/Anoel-1.png';
import '../../data/spritesheets/Anoel.json';

import '../../data/spritesheets/Iam-0.png';
import '../../data/spritesheets/Iam-1.png';
import '../../data/spritesheets/Iam.json';

import '../../data/spritesheets/Iroi-0.png';
import '../../data/spritesheets/Iroi-1.png';
import '../../data/spritesheets/Iroi.json';

import '../../data/spritesheets/oyk-0.png';
import '../../data/spritesheets/oyk-1.png';
import '../../data/spritesheets/oyk-2.png';
import '../../data/spritesheets/oyk.json';

import '../../data/sounds/Bg_01.mp3';
import '../../data/sounds/Iori_40-1.mp3';
import '../../data/sounds/common/Choose_Sound_Effect.mp3';
import '../../data/sounds/common/Coin_Effect.mp3';
import '../../data/sounds/common/Selecting_Sound_Effect.mp3';
import '../../data/sounds/common/new_challenger.mp3';

import '../../data/sounds/common/nine.mp3'
import '../../data/sounds/common/eight.mp3'
import '../../data/sounds/common/seven.mp3'
import '../../data/sounds/common/six.mp3'
import '../../data/sounds/common/five.mp3'
import '../../data/sounds/common/four.mp3'
import '../../data/sounds/common/three.mp3'
import '../../data/sounds/common/two.mp3'
import '../../data/sounds/common/one.mp3'


export enum GameAssets {
	Menu = 'Game-Menu',
	PlayerSelect = 'Player-Select',
	Controls = 'Controls',
	Splash = 'Splash'
}

export enum PlayerSelect {
	May = 'May-Select',
	Kyo = 'Kyo-Select',
	Leona = 'Leona-Select',
	Yory = 'Yory-Select'
}

export enum PlayerFight {
	May = 'May-Fight',
	Kyo = 'Kyo-Fight',
	Leona = 'Leona-Fight',
	Yory = 'Yory-Fight'
}

export enum Sounds {
	Choose = 'choose',
	Select = 'select',
	Coin = 'coin'
}

export class AssetsManager {

	private Queue: createjs.LoadQueue;

	constructor(onComplete: Action, onProgress: Action01<number>, onError: Action01<any>) {
		console.log(PlayerFight.Kyo);
		this.Queue = new createjs.LoadQueue(true);
		this.Queue.installPlugin(createjs.Sound);

		this.Queue.on("complete", onComplete);
		this.Queue.on("progress", onProgress);
		this.Queue.on("error", onError);

		this.Queue.loadManifest(this.Manifest());
	}

	private Manifest(): any {
		return {
			manifest: [
				{ "id": PlayerSelect.Yory, "src": "/data/images/Iori-Select.png" },
				{ "id": PlayerSelect.Leona, "src": "/data/images/Leona-Select.png" },
				{ "id": PlayerSelect.May, "src": "/data/images/May-Select.png" },
				{ "id": PlayerSelect.Kyo, "src": "/data/images/Kyo-Select.png" },

				{ "id": GameAssets.Menu, "src": "/data/images/backgrounds/menu.png" },
				{ "id": GameAssets.PlayerSelect, "src": "/data/images/backgrounds/Player-Select.jpg" },
				{ "id": GameAssets.Controls, "src": "/data/images/backgrounds/controls.jpg" },
				{ "id": GameAssets.Splash, "src": "/data/images/backgrounds/splash.png" },


				
				{ "id": PlayerFight.May, "src": "/data/spritesheets/Iam.json" },
				{ "id": PlayerFight.Leona, "src": "/data/spritesheets/Anoel.json" },
				{ "id": PlayerFight.Kyo, "src": "/data/spritesheets/oyk.json" },
				{ "id": PlayerFight.Yory, "src": "/data/spritesheets/Iroi.json" },


				{ "id": Sounds.Choose, "src": "/data/sounds/common/Choose_Sound_Effect.mp3"},
				{ "id": Sounds.Coin, "src":   "/data/sounds/common/Coin_Effect.mp3"},
				{ "id": Sounds.Select, "src": "/data/sounds/common/Selecting_Sound_Effect.mp3"},
				
			]
		};
	};

	public Load(asset: GameAssets | PlayerFight | PlayerSelect | Sounds): any {
		return this.Queue.getResult(asset);
	}

	public ConvertToPlayerFight(select: PlayerSelect): PlayerFight {
		switch (select) {
			case PlayerSelect.Kyo:
				return PlayerFight.Kyo;
			case PlayerSelect.Leona:
				return PlayerFight.Leona;
			case PlayerSelect.May:
				return PlayerFight.May;
			case PlayerSelect.Yory:
				return PlayerFight.Yory;	
		}
	}
}