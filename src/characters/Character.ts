export class Caracter extends createjs.Sprite {
	constructor(data: Object) {
		super(new createjs.SpriteSheet(data));

		this.x = 500
		this.y = 200;
	}
}