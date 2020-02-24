import { BuildingPrimitive, Cube, Vertex } from '@lib/primitives';
import { themeSizes } from '@constants/primitiveSizes';


const { cubeEdgeLength } = themeSizes;

export const ComplexOfBuildings = (): Array<BuildingPrimitive> => {
  const objects: Array<BuildingPrimitive> = [];
  const constructionReadinessData = (window as any).ConstructionReadinessRenderer;
  let positionX = 0;

  constructionReadinessData.forEach((complexOfBuildings) => {
    const sections = complexOfBuildings['СтруктураСекций'];
    sections.forEach((section) => {
      const floors = section['СтруктураЭтажей'];
  
      floors.forEach((sectionFloor, sectionFloorIndex) => {
        const readinessPercent = sectionFloor['Готовность'];
        const cubePosition: Vertex = {
          position: {
            x: positionX + cubeEdgeLength / 2,
            y: sectionFloorIndex * cubeEdgeLength + cubeEdgeLength / 2,
            z: cubeEdgeLength / 2,
          }
        };
        const cube = Cube(cubePosition, readinessPercent);
        objects.push(...cube);
      });
      positionX += cubeEdgeLength;
    });
    positionX += cubeEdgeLength;
  });
  return objects;
};
