import { Router } from '../retro/index.js';
import { Store } from './store.js';
import { BoardComponent } from './board.js';

const store = new Store();
const router = new Router();
const appRoot = document.getElementById('app')!;

router.addRoute('#/', () => {
  new BoardComponent(appRoot, store);
});

router.start();
