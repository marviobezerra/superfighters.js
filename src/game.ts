import { Character } from './characters/Character';
import { AssetsManager, Assets } from './assets/assets-manager';
import { GameMenu } from './scenes/GameMenu';

export class Game {

	public Canvas: HTMLCanvasElement;
	public Stage: createjs.Stage;
	public Assets: AssetsManager;

	constructor(element: string) {
		this.Stage = new createjs.Stage(document.getElementById(element));
		this.Canvas = <HTMLCanvasElement>this.Stage.canvas;

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", this.Tick.bind(this));

		this.Assets = new AssetsManager(this.Start.bind(this), this.Progress.bind(this), this.Error.bind(this));
	}

	public Start(): void {

		let menuScene = new GameMenu(this.Assets);
		this.Stage.addChild(menuScene);

		// let playerOne = new Character(this.Assets.Load(Assets.Leona), true);
		// let playerTwo = new Character(this.Assets.Load(Assets.May), false);

		// var image = this.Assets.Load(Assets.Menu);
		// var myBitmap = new createjs.Bitmap(image);

		// this.Stage.addChild(playerOne);
		// this.Stage.addChild(playerTwo);
		// this.Stage.addChild(myBitmap);
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