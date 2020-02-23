import * as THREE from 'three';
import { Vertex } from '../lib/primitives';

export type BuildingPrimitive = THREE.Mesh | THREE.LineSegments;

const faceColors: Array<number> = [0xd9d9d9, 0x1a75ff, 0x008000];
const materials = faceColors.map((faceColor) => new THREE.MeshBasicMaterial({ color: faceColor }));
const cubeEdgeLength = 20;
const cubeGeometry = new THREE.BoxGeometry(cubeEdgeLength, cubeEdgeLength, cubeEdgeLength);

const getFaceMaterial = (readinessPercent: number): THREE.MeshBasicMaterial => {
  if (readinessPercent <= 0) return materials[0];
  if (readinessPercent < 100) return materials[1];
  return materials[2];
};

const createCube = (objectPosition: Vertex, readinessPercent: number): Array<BuildingPrimitive> => {
  const material = getFaceMaterial(readinessPercent);
  const cube = new THREE.Mesh(cubeGeometry, material);
  const { x, y, z } = objectPosition.position || {};
  const { rx, ry, rz } = objectPosition.rotation || {};
  objectPosition.position && cube.position.set(x, y, z);
  objectPosition.rotation && cube.rotation.set(rx, ry, rz);
  const lineGeometry = new THREE.BoxBufferGeometry(cubeEdgeLength, cubeEdgeLength, cubeEdgeLength);
  const edges = new THREE.EdgesGeometry(lineGeometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6699ff }));
  objectPosition.position && line.position.set(x, y, z);
  objectPosition.rotation && line.rotation.set(rx, ry, rz);
  return [cube, line];
};

export const generateComplexOfBuildings = (): Array<BuildingPrimitive> => {
  const objects: Array<BuildingPrimitive> = [];
  const constructionReadinessData = (window as any).ConstructionReadinessRenderer;
  let positionX = cubeEdgeLength;

  constructionReadinessData.forEach((complexOfBuildings) => {
    const sections = complexOfBuildings['СтруктураСекций'];
    sections.forEach((section) => {
      const floors = section['СтруктураЭтажей'];
  
      floors.forEach((sectionFloor, sectionFloorIndex) => {
        const readinessPercent = sectionFloor['Готовность'];
        const cubePosition: Vertex = {
          position: {
            x: positionX,
            y: cubeEdgeLength + sectionFloorIndex * cubeEdgeLength,
            z: cubeEdgeLength,
          }
        };
        const cube = createCube(cubePosition, readinessPercent);
        objects.push(...cube);
      });
      positionX += cubeEdgeLength;
    });
    positionX += cubeEdgeLength;
  });
  return objects;
};
