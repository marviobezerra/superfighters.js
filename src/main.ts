import { Game } from './game';

declare var module: any;

if (module.hot) {
    module.hot.accept();
}

let game = new Game('canvas');