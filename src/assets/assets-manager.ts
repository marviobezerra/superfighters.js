import { Action, Action01 } from '../common/util';

import '../../data/images/Mai/mai-data.json';
import '../../data/images/Mai/mai-image.png';
import '../../data/images/Leona/leona-data.json';
import '../../data/images/Leona/leona-image.png';

import '../../data/images/Iori-Select.png';
import '../../data/images/Kyo-Select.png';
import '../../data/images/Leona-Select.png';
import '../../data/images/May-Select.png';

import '../../data/images/backgrounds/menu.png';

import '../../data/sounds/Bg_01.mp3';
import '../../data/sounds/Iori_40-1.mp3';

export enum GameAssets {
	Menu = 'Game-Menu'
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

export class AssetsManager {

	private Queue: createjs.LoadQueue;

	constructor(onComplete: Action, onProgress: Action01<number>, onError: Action01<any>) {
		console.log(PlayerFight.Kyo);
		this.Queue = new createjs.LoadQueue(true);

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

				{ "id": PlayerFight.May, "src": "/data/images/Mai/mai-data.json" },
				{ "id": PlayerFight.Leona, "src": "/data/images/Leona/leona-data.json" }
			]
		};
	};

	public Load(asset: GameAssets | PlayerFight | PlayerSelect): any {
		return this.Queue.getResult(asset);
	}
}