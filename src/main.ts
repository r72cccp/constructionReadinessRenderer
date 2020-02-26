import { sceneInit } from './entities/scene';

// Инициализация 
if ((window as any).attachEvent) {
  (window as any).attachEvent('onload', sceneInit);
} else {
  if (window.onload) {
    var curronload = (window as any).onload;
    var newonload = function() {
      curronload();
      sceneInit();
    };
    window.onload = newonload;
  } else {
    window.onload = sceneInit;
  }
}
