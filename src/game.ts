import { Caracter } from './characters/Character';
import { AssertsManager, Players } from './asserts/asserts-manager';

export class Game {

	public Canvas: HTMLCanvasElement;
	public Stage: createjs.Stage;
	public Asserts: AssertsManager;

	constructor(element: string) {
		this.Stage = new createjs.Stage(document.getElementById(element));
		this.Canvas = <HTMLCanvasElement>this.Stage.canvas;

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", this.Tick.bind(this));

		this.Asserts = new AssertsManager(this.Start.bind(this), this.Progress.bind(this), this.Error.bind(this));
	}

	public Start(): void {
		let playerOne = new Caracter(this.Asserts.Load(Players.Leona), true);
		let playerTwo = new Caracter(this.Asserts.Load(Players.May), false);

		var image = this.Asserts.Load(Players.MayPresentation);
		var myBitmap = new createjs.Bitmap(image);

		this.Stage.addChild(playerOne);
		this.Stage.addChild(playerTwo);
		this.Stage.addChild(myBitmap);
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