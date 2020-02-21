import { Face, rendererUtils, Vertex, Vertex2D } from './lib/3dUtils';
// import { CameraPosition } from './lib/camera';
import { ColorStyle, primitiveUtils, Shape } from './lib/primitiveUtils';
import { domUtils } from './lib/domUtils';

let autorotateTimeout: number;

// Инициализация сцены
export const sceneInit = () => {
  // Задаём ширину и высоту канвы
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  console.log('#16', {
    canvasWidth,
    canvasHeight,
  });

  // Стилизация объектов
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!ctx) return;

  const project = (M: Vertex): Vertex2D => {
    return rendererUtils.createVertex2D(M.x, M.z);
  };

  const cubeColorByReadinessPercent = (readinessPercent: number): ColorStyle => {
    let strokeStyle, fillStyle;
    if (readinessPercent === 0) {
      strokeStyle = 'rgba(65, 71, 71, 0.3)';
      fillStyle = 'rgba(170, 190, 190, 0.3)';
    } else if (readinessPercent < 100) {
      strokeStyle = 'rgba(17, 50, 50, 0.3)';
      fillStyle = 'rgba(51, 198, 198, 0.3)';
    } else if (readinessPercent === 100) {
      strokeStyle = 'rgba(4, 64, 12, 0.3)';
      fillStyle = 'rgba(70, 198, 55, 0.3)';
    };
    return { strokeStyle, fillStyle }
  };

  const render = (objects: Array<Shape>): void => {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Итерация по всем объектам
    objects.forEach((object: Shape) => {
      ctx.strokeStyle = object.strokeStyle;
      ctx.fillStyle = object.fillStyle;

      // Итерация по граням объекта
      object.faces.forEach((face: Face) => {
        // Рисуем первый вертекс
        let P = project(face[0]);
        ctx.beginPath();
        ctx.moveTo(P.x, -P.y);

        // Рисуем остальные вертексы
        face.forEach((vertice: Vertex) => {
          P = project(vertice);
          ctx.lineTo(P.x, -P.y);
        });

        // Закрываем контур рёбер и рисуем грань
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      });
    });
  };

  // Начинает перемещение камеры мышью
  const initMoveCamera = (evt: MouseEvent): void => {
    // clearTimeout(autorotateTimeout);
    mousedown = true;
    mx = evt.clientX;
    my = evt.clientY;
  };

  const moveCamera = (evt: MouseEvent): void => {
    if (mousedown) {
      const theta = (evt.clientX - mx) * Math.PI / 360;
      const phi = 0; //(evt.clientY - my) * Math.PI / 180;

      objects.forEach((object: Shape) => {
        object.vertices.forEach((vertice: Vertex) => {
          rotate(vertice, sceneCenter, theta, phi);
        });
      });

      mx = evt.clientX;
      my = evt.clientY;

      render(objects);
    }
  };

  // Прекращает движение камеры
  const stopMoveCamera = (): void => {
    mousedown = false;
    // autorotateTimeout = setTimeout(autorotate, 2000);
  };

  // Генерация кубиков
  const objects: Array<Shape> = [];
  const constructionReadinessData = (window as any).ConstructionReadinessRenderer;

  // Для расчёта положения камеры потребуется оценка размера сгенерированных объектов
  const cameraPositionParams = {
    minX: 0, 
    maxX: 0,
    minZ: 0,
    maxZ: 0,
  };

  let maximumHeight = 0;
  constructionReadinessData.forEach((complexOfBuildings) => {
    const sections = complexOfBuildings['СтруктураСекций'];
    sections.forEach((section, sectionIndex) => {
      const floors = section['СтруктураЭтажей'];
      if (floors && floors.length && floors.length > maximumHeight) maximumHeight = floors.length;
    });
  });
  console.log('#130', {
    maximumHeight,
  });
  const cubeEdgeLength = canvasHeight / (maximumHeight + 1);
  const baseX = canvasWidth / 2;
  const baseZ = -canvasHeight + cubeEdgeLength;

  constructionReadinessData.forEach((complexOfBuildings) => {
    // Устанавливаем тайтл и футер
    domUtils.insertHtmlToElementById('title', complexOfBuildings['Проект']);
    domUtils.insertHtmlToElementById('footer', 'подвал');
    const sections = complexOfBuildings['СтруктураСекций'];

    sections.forEach((section, sectionIndex) => {
      const floors = section['СтруктураЭтажей'];
      const sectionName = section['Секция'];

      floors.forEach((sectionFloor, sectionFloorIndex) => {
        const xReal = sectionIndex * cubeEdgeLength;
        const zReal = sectionFloorIndex * cubeEdgeLength;
        const x = baseX + xReal;
        const z = baseZ + zReal;
        const readinessPercent = Number(sectionFloor['Готовность']);
        const { strokeStyle, fillStyle } = cubeColorByReadinessPercent(readinessPercent);
        if (xReal > cameraPositionParams.maxX) cameraPositionParams.maxX = xReal;
        if (zReal > cameraPositionParams.maxZ) cameraPositionParams.maxZ = zReal;
        const cubeCenter = rendererUtils.createVertex(x, 0, z);
        const cube = primitiveUtils.createCube(cubeCenter, cubeEdgeLength, strokeStyle, fillStyle)
        objects.push(cube);
      });
    });
  });
  const horizontalCenter = (cameraPositionParams.maxX - cameraPositionParams.minX) / 2;
  const verticalCenter = cameraPositionParams.minZ;
  const sceneCenter = rendererUtils.createVertex(baseX + horizontalCenter, 0, baseZ);
  
  console.log('#116', {
    sceneCenter,
    cameraPositionParams,
    constructionReadinessData,
    objects,
  });


  // First render
  render(objects);

  // Events
  let mousedown = false;
  let mx = 0;
  let my = 0;

  canvas.addEventListener('mousedown', initMoveCamera);
  document.addEventListener('mousemove', moveCamera);
  document.addEventListener('mouseup', stopMoveCamera);

  // Rotate a vertice
  const rotate = (M: Vertex, center: Vertex, theta: number, phi: number): void => {
    // Rotation matrix coefficients
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const cp = Math.cos(phi);
    const sp = Math.sin(phi);

    // Rotation
    const x = M.x - center.x;
    const y = M.y - center.y;
    const z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
  };

  // const autorotate = (): void => {
  //   objects.forEach((object: Shape) => {
  //     object.vertices.forEach((vertice: Vertex) => {
  //       const theta = -Math.PI / 720;
  //       const phi = 0.001; // Math.PI / 720;
  //       rotate(vertice, sceneCenter, theta, phi);
  //     });
  //   });

  //   render(objects);

  //   autorotateTimeout = setTimeout(autorotate, 30);
  // }
  // autorotateTimeout = setTimeout(autorotate, 2000);
};
