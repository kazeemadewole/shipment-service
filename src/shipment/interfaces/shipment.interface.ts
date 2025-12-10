export type ShipmentStatus =
  | 'pending'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface IShipment {
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  status?: ShipmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShipmentService {
  getAllShipments(): Promise<IShipment[]>;
  getSingleShipment(id: string): Promise<IShipment | null>;
  createShipment(data: IShipment): Promise<IShipment>;
  updateShipment(id: string, data: Partial<IShipment>): Promise<IShipment | null>;
  deleteShipment(id: string): Promise<IShipment | null>;
}
