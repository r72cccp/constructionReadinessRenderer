import { BuildingPrimitive } from '@lib/primitives';
import { themeSizes } from '@constants/primitiveSizes';
import { BuildingBlock } from '@entities/buildingBlock';

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
        const x = positionX + cubeEdgeLength / 2;
        const y = sectionFloorIndex * cubeEdgeLength + cubeEdgeLength / 2;
        const z = cubeEdgeLength / 2;
        const cube = BuildingBlock(readinessPercent, x, y, z);
        objects.push(...cube);
      });
      positionX += cubeEdgeLength;
    });
    positionX += cubeEdgeLength;
  });
  return objects;
};
