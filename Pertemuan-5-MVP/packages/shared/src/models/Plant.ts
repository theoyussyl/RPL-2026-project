export interface Plant {
  Id: number;
  GardenId: number;
  Name: string;
  Species?: string | null;
  PlantedDate?: string | null;
  CreatedAt: string;
}
