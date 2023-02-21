export type SceneItems = Partial<Record<string, THREE.Object3D>>;

export type MeshWithTime = {
  creationTime: number;
  mesh: THREE.Mesh;
};
