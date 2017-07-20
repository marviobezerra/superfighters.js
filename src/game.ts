export class Game {

    public Canvas: HTMLCanvasElement;
    public Stage: createjs.Stage;

	constructor(element: string) {
		this.Stage = new createjs.Stage(document.getElementById(element));
		this.Canvas = <HTMLCanvasElement>this.Stage.canvas;

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", this.Tick.bind(this));
		
		let rectangle = new createjs.Shape();

        rectangle.graphics
            .setStrokeStyle(2)
            .beginStroke('#000')
            .beginFill('orange')
            .drawRect(20, 20, 500, 500);

        this.Stage.addChild(rectangle);
	}

	private Tick() : void {
		this.Stage.update();
	}
}