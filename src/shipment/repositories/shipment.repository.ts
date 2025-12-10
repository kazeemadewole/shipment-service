import { injectable } from 'inversify';
import { ShipmentModel } from '../entities/shipment.schema';
import { IShipment } from '../interfaces/shipment.interface';
import { paginateMongoose } from '../../common/pagination/paginate';
import { CreateShipmentDTO } from '../validations/shipment.validation';

@injectable()
export class ShipmentRepository {
  async getAll(page?: number, limit?: number) {
    const data = await paginateMongoose(ShipmentModel, { page: page || 1, limit: limit || 10 }, {});
    return data;
  }

  getById(id: string) {
    return ShipmentModel.findById(id);
  }

  create(data: CreateShipmentDTO) {
    return ShipmentModel.create(data);
  }

  update(id: string, data: Partial<IShipment>) {
    return ShipmentModel.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string) {
    return ShipmentModel.findByIdAndDelete(id);
  }
}
