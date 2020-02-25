import * as THREE from '@lib/three';
import { HTMLBlock, Vertex } from '@lib/primitives';
import { themeSizes } from '@constants/primitiveSizes';
import { BuildingBlock } from '@entities/buildingBlock';

const { cubeEdgeLength } = themeSizes;

export const ComplexOfBuildings = (): THREE.Group => {
  const objects = new THREE.Group;
  const constructionReadinessData = (window as any).ConstructionReadinessRenderer;
  let positionX = 0;

  constructionReadinessData.forEach((complexOfBuildings) => {
    const sections = complexOfBuildings['СтруктураСекций'];
    let buildingMaximumSectionHeight = 0;
    sections.forEach((section) => {
      const floors = section['СтруктураЭтажей'];
      if (floors.length > buildingMaximumSectionHeight) buildingMaximumSectionHeight = floors.length;
      floors.forEach((sectionFloor, sectionFloorIndex) => {
        const readinessPercent = sectionFloor['Готовность'];
        const x = positionX + cubeEdgeLength / 2;
        const y = sectionFloorIndex * cubeEdgeLength + cubeEdgeLength / 2;
        const z = cubeEdgeLength / 2;
        const buildingBlockPosition = new Vertex(x, y, z);
        const cube = BuildingBlock(readinessPercent, buildingBlockPosition);
        objects.add(cube);
      });
      positionX += cubeEdgeLength;
    });

    const buildingMiddle = positionX + (sections.length * cubeEdgeLength) / 2;
    const buildingTop = buildingMaximumSectionHeight * (cubeEdgeLength + 2);

    const faceTexture = document.createElement('div');
    faceTexture.textContent = complexOfBuildings['Проект'];
    faceTexture.className = 'building-annotation';
    const buildingAnnotationPosition = new Vertex(buildingMiddle, buildingTop, cubeEdgeLength / 2);
    const buildingAnnotation = new HTMLBlock(buildingAnnotationPosition, faceTexture);
    objects.add(buildingAnnotation);

    positionX += cubeEdgeLength;
  });
  return objects;
};
