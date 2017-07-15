import {Instrument} from "./instrument";
import {User} from "./user";
export class Reservation {
  id: number;
  instrument?: Instrument | number;
  user?: User;
  start_time: string;
  end_time: string;
}
