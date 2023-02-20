export default abstract class ResoursesController {
  protected geometries: Array<THREE.BufferGeometry> = [];

  protected materials: Array<THREE.Material> = [];

  protected textures: Array<THREE.Texture> = [];

  public destroy() {
    const dispose = <T extends { dispose: () => void }>(element: T) => {
      element.dispose();
    };

    this.geometries.forEach(dispose);
    this.materials.forEach(dispose);
    this.textures.forEach(dispose);
  }

  public considerGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);

    return geometry;
  }

  public considerMaterial<T extends THREE.Material>(material: T): T {
    this.materials.push(material);

    return material;
  }

  public considerTexture<T extends THREE.Texture>(texture: T): T {
    this.textures.push(texture);

    return texture;
  }
}
