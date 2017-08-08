import { Character, Animations, Directions } from '../characters/Character';
import { SceneBase } from '../scenes/SceneBase';
export class AiManager{

	static proximityRange:number = 300;
	static punching:boolean = false;

	static AiCheck(player:Character, enemy:Character){		
		// Define positioning of characters left/right
		if (player.x < enemy.x ) {
			//Player on the left
			this.move(player,enemy,true);
		} else {
			// Player on the right
			this.move(player, enemy, false);
		}
	}

	static move(player:Character, enemy:Character, isLeft:boolean){
		if (this.checkProximity(player.x, enemy.x)){
			enemy.Punch();
			
		} else {
			
			if (isLeft){			
				enemy.Move(Directions.Left, 1);			
			}
			else {
				enemy.Move(Directions.Right, 1);				
			}
		}
	}

	static hit(enemy:Character){		
		enemy.Punch();
	}

	static checkProximity(pX:number, eX: number){
		
		if (Math.abs(pX-eX) < this.proximityRange) { 			
			return true; 
		} else { 			
			return false;
		}
	}
}

export enum AiState{
	Idle,
	Walk,
	Hit
}