import Animasu from "./provider/default/Animasu";

export default class AnimakuAPI {
  
  private static animasu: Animasu;

  public static getAnimasu(): Animasu {
    if (!this.animasu) {
      this.animasu = new Animasu();
    }
    return this.animasu;
  }
}