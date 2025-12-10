import { inject, injectable } from 'inversify';
import TYPES from '../../common/config/symbols';
import { CreateShipmentDTO, UpdateShipmentDTO } from '../validations/shipment.validation';
import { ShipmentRepository } from '../repositories/shipment.repository';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

@injectable()
export class ShipmentService {
  constructor(
    @inject(TYPES.SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: ShipmentRepository
  ) {}

  async getAllShipments(page?: number, limit?: number) {
    return this.shipmentRepository.getAll(page, limit);
  }

  async getSingleShipment(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(404, `Invalid shipment id`);
      }
      const record = await this.shipmentRepository.getById(id);
      if (!record) {
        throw createHttpError(404, `Shipment not found`);
      }
      return record;
    } catch (error) {
      throw createHttpError(404, `Failed to fetch shipment record: ${error.message}`);
    }
  }

  async createShipment(data: CreateShipmentDTO) {
    try {
      return this.shipmentRepository.create(data);
    } catch (error) {
      throw createHttpError(404, `Failed to create shipment record: ${error.message}`);
    }
  }

  async updateShipment(id: string, data: UpdateShipmentDTO) {
    try {
      await this.getSingleShipment(id);
      return this.shipmentRepository.update(id, data);
    } catch (error) {
      throw createHttpError(404, `Failed to update shipment record: ${error.message}`);
    }
  }

  async deleteShipment(id: string) {
    try {
      await this.getSingleShipment(id);
      return this.shipmentRepository.delete(id);
    } catch (error) {
      throw createHttpError(404, `Failed to delete shipment record: ${error.message}`);
    }
  }
}
