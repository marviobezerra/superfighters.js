import { Action, Action01 } from '../common/util';

import '../../data/images/Mai/mai-data.json';
import '../../data/images/Mai/mai-image.png';

import '../../data/images/Leona/leona-data.json';
import '../../data/images/Leona/leona-image.png';

export enum Players {
	May,
	Kyo,
	Leona,
	Yory
}

export class AssertsManager {

	private Queue: createjs.LoadQueue;

	constructor(onComplete: Action, onProgress: Action01<number>, onError: Action01<any>) {
		this.Queue = new createjs.LoadQueue(true);

		this.Queue.on("complete", onComplete);
		this.Queue.on("progress", onProgress);
		this.Queue.on("error", onError);

		this.Queue.loadManifest(this.Manifest());
	}

	private Manifest(): any {
		return {
			manifest: [
				{ "id": Players.May, "src": "/data/images/Mai/mai-data.json" },
				{ "id": Players.Leona, "src": "/data/images/Leona/leona-data.json" }
			]
		};
	};

	public Load(player: Players): any {
		return this.Queue.getResult(player);
	}
}