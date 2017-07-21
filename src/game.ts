import { Mai } from './characters/Mai';
import { AssertsManager } from './asserts/asserts-manager';

export class Game {

	public Canvas: HTMLCanvasElement;
	public Stage: createjs.Stage;
	public Asserts: AssertsManager;

	constructor(element: string) {
		this.Stage = new createjs.Stage(document.getElementById(element));
		this.Canvas = <HTMLCanvasElement>this.Stage.canvas;

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", this.Tick.bind(this));

		this.Asserts = new AssertsManager(this.Start, this.Progress, this.Error);
	}

	public Start(): void {
		let player = new Mai();
		this.Stage.addChild(player);
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