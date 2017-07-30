import { Character } from './characters/Character';
import { AssetsManager, GameAssets } from './assets/assets-manager';
import { SceneManager } from './scenes/SceneManager';

export class Game {

	private Canvas: HTMLCanvasElement;
	private Stage: createjs.Stage;
	private Assets: AssetsManager;
	private Manager: SceneManager;


	constructor(element: string) {
		this.Stage = new createjs.Stage(document.getElementById(element));
		this.Canvas = <HTMLCanvasElement>this.Stage.canvas;
		this.Canvas.width = document.body.clientWidth;
		this.Canvas.height = document.body.clientHeight;

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", this.Tick.bind(this));

		this.Assets = new AssetsManager(this.Start.bind(this), this.Progress.bind(this), this.Error.bind(this));
	}

	public Start(): void {
		this.Manager = new SceneManager(this.Stage, this.Assets, this.Canvas);
	}

	public Progress(value: number): void {
		console.log(value);
	}

	public Error(value: any): void {
		console.log(value);
	}

	private Tick(): void {
		this.Stage.update();
	}
}