import { Action, Action01 } from '../common/util';

interface IManifest {
	scr: string;
	id: string;
}

export class AssertsManager {

	public Queue: createjs.LoadQueue;

	public readonly Mai = "Mai";

	private Manifest: Array<IManifest> = [
		{ id: this.Mai, scr: "data/images/Mai/Mai.json" }
	];

	constructor(onComplete: Action, onProgress: Action01<number>, onError: Action01<any>) {
		this.Queue = new createjs.LoadQueue(true);
		
		this.Queue.on("complete", onComplete);
		this.Queue.on("progress", onProgress);
		this.Queue.on("error", onError);

		this.Queue.loadManifest(this.Manifest);
	}
}