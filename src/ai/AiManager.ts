import { Character, Animations, Directions } from '../characters/Character';
import { SceneBase } from '../scenes/SceneBase';
export class AiManager {

	static proximityRange: number = 300;
	static punching: boolean = false;
	static aiBehaviorChangeInterval: number = 50; //Level of dificulty

	static AiCheck(player: Character, enemy: Character, ticks: number) {

		console.log(ticks);

		if (ticks % this.aiBehaviorChangeInterval === Math.floor((Math.random() * 10))) {
			this.changeBehavior(player, enemy);
		}
	}

	static changeBehavior(player: Character, enemy: Character) {
		let aiState: AiState = Math.floor((Math.random() * Object.keys(AiState).length));
		console.log(aiState);
		switch (aiState) {
			case AiState.GoTo:
				if (player.x < enemy.x) {
					//Player on the left
					this.moveForward(player, enemy, true);
				} else {
					// Player on the right
					this.moveForward(player, enemy, false);
				}
				break;
			case AiState.Idle:
				break;
			case AiState.Retreat:

				if (player.x < enemy.x) {
					//Player on the left
					this.moveBackwards(player, enemy, false);
				} else {
					// Player on the right
					this.moveBackwards(player, enemy, true);
				}
			default:
				break;
		}
	}

	static moveForward(player: Character, enemy: Character, isLeft: boolean) {
		if (this.checkProximity(player.x, enemy.x)) {
			enemy.Punch();

		} else {

			if (isLeft) {
				enemy.MoveForward(Directions.Left, 20); //to be define by the global velocity when defined
			}
			else {
				enemy.MoveForward(Directions.Right, 20); //to be define by the global velocity when defined
			}
		}
	}

	static moveBackwards(player: Character, enemy: Character, isLeft: boolean) {
		if (this.checkProximity(player.x, enemy.x)) {
			enemy.Punch();

		} else {

			if (isLeft) {
				enemy.MoveBackWards(Directions.Left, 3);
			}
			else {
				enemy.MoveBackWards(Directions.Right, 3);
			}
		}
	}

	static hit(enemy: Character) {
		enemy.Punch();
	}

	static checkProximity(pX: number, eX: number) {

		if (Math.abs(pX - eX) < this.proximityRange) {
			return true;
		} else {
			return false;
		}
	}
}

export enum AiState {
	GoTo,
	Retreat,
	Idle,
	//JumpTo - To be added
	//JumpBack - To be added
}