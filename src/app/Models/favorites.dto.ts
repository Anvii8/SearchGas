import { GasStationDTO } from "./gas-station.dto";

export class FavoritesDTO {
    id!: number;
    gasStation!: GasStationDTO;
    userId!: string;
}