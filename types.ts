export interface Warehouse {
  id: string;
  city: string;
  contact: string;
  manager: string;
  email: string;
  chatLink: string;
}

export type WarehouseRawRow = [string, string, string, string, string, string];