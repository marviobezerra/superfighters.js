import { Action, Action01 } from '../common/util';

import '../../data/images/Mai/mai-data.json';
import '../../data/images/Mai/mai-image.png';

import '../../data/images/Leona/leona-data.json';
import '../../data/images/Leona/leona-image.png';
import '../../data/images/May_8070-0.png';

export enum Assets {
	May,
	MayPresentation,
	Kyo,
	Leona,
	Yory
}

export class AssetsManager {

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
				{ "id": Assets.MayPresentation, "src": "/data/images/May_8070-0.png" },
				{ "id": Assets.May, "src": "/data/images/Mai/mai-data.json" },
				{ "id": Assets.Leona, "src": "/data/images/Leona/leona-data.json" }
			]
		};
	};

	public Load(asset: Assets): any {
		return this.Queue.getResult(asset);
	}
}