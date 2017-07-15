export class Manufacturer {
  id: number;
  englishName: string;
  chineseName: string;

  getName():string {
    return this.chineseName || this.englishName;
  }

}