export interface IStore {
  id: number;
  name: string;
  marker: [number, number];
}

export interface ILocation {
  id: number;
  center: [number, number];
  city: string;
  title: string;
  stores: IStore[];
}