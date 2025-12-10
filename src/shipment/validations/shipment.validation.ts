import { z } from 'zod';
import { IShipment } from '../interfaces/shipment.interface';

export const ShipmentStatusEnum = z.enum([
  'pending',
  'in_transit',
  'delivered',
  'cancelled',
]);

export const CreateShipmentSchemaStrict = z.object({
  trackingNumber: z.string().min(1),
  senderName: z.string().min(1),
  receiverName: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  status: ShipmentStatusEnum.optional(),
}) satisfies z.ZodType<IShipment>;


export const UpdateShipmentSchema = z
  .object({
    trackingNumber: z.string().optional(),
    senderName: z.string().optional(),
    receiverName: z.string().optional(),
    origin: z.string().optional(),
    destination: z.string().optional(),
    status: ShipmentStatusEnum.optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });


export const ShipmentIdSchema = z.object({
  id: z.string().length(24),
});


export const getListShipmentQuerySchema = z.object({
  page: z
    .coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),
});

export type UpdateShipmentDTO = z.infer<typeof UpdateShipmentSchema>;
export type CreateShipmentDTO = z.infer<typeof CreateShipmentSchemaStrict>;
export type getListShipmentQueryDTO = z.infer<typeof getListShipmentQuerySchema>;
