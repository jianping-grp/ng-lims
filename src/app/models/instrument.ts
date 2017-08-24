import {User} from "./user";
import {Department} from "./department";
import {Reservation} from "./reservation";
import {ReservationType} from "./reservation-type";
import {ChargeType} from "./charge-type";
import {Manufacturer} from "./manufacturer";
export class Instrument {
  id: number;
  name: string;
  status: string;
  location: string;
  image: string;
  description: string;
  application: string;
  accessories: string;
  department?: Department | number;
  admin?: number;
  sci_discount: boolean;
  reservation_type: ReservationType | number;
  reservation_time_unit: number;
  reservation_start_time: string;
  reservation_end_time: string;
  charge_type: ChargeType | number;
  manufacturer: Manufacturer;
  model: string;
  links:any;
}
