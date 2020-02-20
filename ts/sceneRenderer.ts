import { Face, Vertex, rendererUtils } from './lib/3dUtils';
import { Cube, primitiveUtils } from './lib/primitiveUtils';
let autorotate_timeout: number;

// Инициализация сцены
export function sceneInit() {
  function project(M: Vertex) {
    return rendererUtils.createVertex2D(M.x, M.z);
  }

  function render(objects: Array<Cube>, ctx: CanvasRenderingContext2D | null, dx: number, dy: number) {
    if (!ctx) return;

    ctx.clearRect(0, 0, 2 * dx, 2 * dy);

    // Итерация по всем объектам
    objects.forEach((object: Cube) => {
      // For each face
      object.faces.forEach((face: Face) => {
        // Draw the first vertex
        var P = project(face[0]);
        ctx.beginPath();
        ctx.moveTo(P.x + dx, -P.y + dy);

        // Draw the other vertices
        face.forEach((vertice: Vertex) => {
          P = project(vertice);
          ctx.lineTo(P.x + dx, -P.y + dy);

        });

        // Close the path and draw the face
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      });
    });
  };

  (function() {
    // Fix the canvas width and height
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const dx = canvas.width / 2;
    const dy = canvas.height / 2;

    // Objects style
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';

    // Create the cubes
    const objects: Array<Cube> = [];

    for(var x = 0; x <= 10; x++) {
      var zMax = Math.random() * 10;
      for(var z = 0; z <= zMax; z++) {
        var cube_center = rendererUtils.createVertex(x * 100, 0, z * 100);
        const cube = primitiveUtils.createCube(cube_center, 100);
        objects.push(cube);
      };
    };
    console.log('#116', {
      objects,
    });

    // Create the scene
    // middle x coordinate
    // var xCenter = objects.reduce((acc, cube) => {
    //   return acc + cube.
    // });
    var scene_center = rendererUtils.createVertex(0, 0, 0);

    // First render
    render(objects, ctx, dx, dy);

    // Events
    var mousedown = false;
    var mx = 0;
    var my = 0;

    canvas.addEventListener('mousedown', initMove);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stopMove);

    // Rotate a vertice
    function rotate(M: Vertex, center: Vertex, theta: number, phi: number) {
      // Rotation matrix coefficients
      var ct = Math.cos(theta);
      var st = Math.sin(theta);
      var cp = Math.cos(phi);
      var sp = Math.sin(phi);

      // Rotation
      var x = M.x - center.x;
      var y = M.y - center.y;
      var z = M.z - center.z;

      M.x = ct * x - st * cp * y + st * sp * z + center.x;
      M.y = st * x + ct * cp * y - ct * sp * z + center.y;
      M.z = sp * y + cp * z + center.z;
    }

    // Initialize the movement
    function initMove(evt: MouseEvent) {
      clearTimeout(autorotate_timeout);
      mousedown = true;
      mx = evt.clientX;
      my = evt.clientY;
    }

    function move(evt: MouseEvent) {
      if (mousedown) {
        var theta = (evt.clientX - mx) * Math.PI / 360;
        var phi = (evt.clientY - my) * Math.PI / 180;

        for (var i = 0; i < 8; ++i) {
          for(var x = 0; x < objects.length; x++) {
            var cube = objects[x];
            rotate(cube.vertices[i], scene_center, theta, phi)
          };
        };

        mx = evt.clientX;
        my = evt.clientY;

        render(objects, ctx, dx, dy);
      }
    }

    function stopMove() {
      mousedown = false;
      autorotate_timeout = setTimeout(autorotate, 2000);
    }

    function autorotate() {
      for (var i = 0; i < 8; ++i) {
        for(var x = 0; x < objects.length; x++) {
          var cube = objects[x];
          rotate(cube.vertices[i], scene_center, -Math.PI / 720, Math.PI / 720);
        };
      };

      render(objects, ctx, dx, dy);

      autorotate_timeout = setTimeout(autorotate, 30);
    }
    autorotate_timeout = setTimeout(autorotate, 2000);
  })();
};
