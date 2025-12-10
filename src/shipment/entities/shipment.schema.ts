import mongoose, { Schema } from 'mongoose';
import { IShipment } from '../interfaces/shipment.interface';

const ShipmentSchema = new Schema<IShipment>(
  {
    trackingNumber: { type: String, required: true, unique: true },
    senderName: { type: String, required: true },
    receiverName: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export const ShipmentModel = mongoose.model<IShipment>(
  'Shipment',
  ShipmentSchema
);
