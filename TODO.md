// TODO:

v - paint while dragging the mouse
v - toolbar with: paint, select area, erase
v - add more symbols (in pages)
v- sacar el tipado de props a un type en cada componente
v - panel of used tiles
v - extract hooks from Grid
v - rotate when click (create rotatable groups of tiles)
v - improve colors harmony

- deploy to netlify and profit
- add multiuser experience
- layers?
- check performance in grid rerenders
- improve zoom responsiveness
- improve draw performance
- tests coverage

Functionality

- undo (requires history)
- export to png
- move
- select area to create pattern
- hide grid
- share
- create new canvas

UX

- try out scroll bar in other OS and browser
  - make evident that panels scroll
- support mobile size
- full range of scrolling the canvas. Part is missing
- zoom with mouse or gesture
- prevent divs selection to avoid confusion
- the default color shouldn't be that gray (?)
- nice animation in colors toggle
- collapse toolbars?
- icono del mouse cambia y toma la forma de la accion

BUGS

- all grid is rerendering though Cell is exported with React.memo
- a veces se queda pintando despues de mouse up (a veces tras cambiar solapa de Chrome)
- la altura del panel de active tiles no se auto ajusta (quizas es bueno para no distraer, no se)
