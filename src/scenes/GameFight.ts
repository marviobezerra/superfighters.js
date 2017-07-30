import { SceneBase } from './SceneBase';
import { AssetsManager, GameAssets, PlayerFight } from '../assets/assets-manager';
import { IManager, SceneType } from './SceneManager';
import { Character } from '../characters/Character';

export class GameFight extends SceneBase {

	private KeyBoardEvents: any;
	private BackGroundImage: createjs.Bitmap;
	private OponentList: Array<PlayerFight>;

	constructor(manager: IManager) {
		super(manager);

		// It is required to avoid scope references
		this.AddBackground();
		this.KeyBoardEvents = this.RegisterEvents.bind(this);
		this.Start();
	}

	public Register(): void {
		document.addEventListener('keydown', this.KeyBoardEvents, false);
	}

	public UnRegister(): void {
		document.removeEventListener('keydown', this.KeyBoardEvents, false);
	}

	private AddBackground(): void {
		this.BackGroundImage = new createjs.Bitmap(this.Manager.AssetsManager.Load(GameAssets.PlayerSelect));
		this.addChild(this.BackGroundImage);
		this.AdjustBackgroundSize();
	}

	private AdjustBackgroundSize(): void {
		this.BackGroundImage.scaleX = this.Manager.Canvas.width / this.BackGroundImage.getBounds().width
		this.BackGroundImage.scaleY = this.Manager.Canvas.height / this.BackGroundImage.getBounds().height;
	}

	private BuildOponentList(): void {

		this.OponentList = [];

		for (let item in PlayerFight) {

			let value = <PlayerFight>PlayerFight[item];

			if (value !== this.Manager.CurrentCaracter) {
				this.OponentList.push(value);
			}
		}
	}

	private GetNextOponent(): PlayerFight {
		let result = this.OponentList[0];
		this.OponentList.slice(0, 1);
		return result;
	}

	private Start(): void {
		this.BuildOponentList();
		let playerOne = new Character(this.Manager.AssetsManager.Load(this.Manager.CurrentCaracter), true);
		let playerTwo = new Character(this.Manager.AssetsManager.Load(this.GetNextOponent()), false);

		this.addChild(playerOne, playerTwo);
	}

	private RegisterEvents(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Escape':
				this.Manager.Load(SceneType.Menu);
				break;
			case 'ArrowLeft':
				break;
			case 'ArrowRight':
				break;
			case 'Enter':
				this.Manager.Load(SceneType.Fight);
		}
	}
}