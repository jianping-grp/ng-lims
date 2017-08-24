export class Manufacturer {
  id: number;
  english_name: string;
  chinese_name: string;

  getName():string {
    return this.chinese_name || this.english_name;
  }

}
