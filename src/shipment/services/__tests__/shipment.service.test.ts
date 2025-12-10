import 'reflect-metadata';
import { ShipmentService } from '../shipment.service';
import { ShipmentRepository } from '../../repositories/shipment.repository';
import { CreateShipmentDTO, UpdateShipmentDTO } from '../../validations/shipment.validation';

describe('ShipmentService', () => {
  let shipmentService: ShipmentService;
  let shipmentRepository: jest.Mocked<ShipmentRepository>;

  beforeEach(() => {
    shipmentRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ShipmentRepository>;

    shipmentService = new ShipmentService(shipmentRepository);
  });

  it('should call getAllShipments and return data', async () => {
    const mockData = { data: [], pagination: { total: 0, perPage: 10, totalPages: 0, currentPage: 1, hasNextPage: false } };
    shipmentRepository.getAll.mockResolvedValue(mockData);

    const result = await shipmentService.getAllShipments(1, 10);

    expect(shipmentRepository.getAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(mockData);
  });

  it('should call getSingleShipment and return a shipment', async () => {
    const mockShipment = { id: '123', trackingNumber: 'TRK001' };
    shipmentRepository.getById.mockResolvedValue(mockShipment as any);

    const result = await shipmentService.getSingleShipment('123');

    expect(shipmentRepository.getById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockShipment);
  });

  it('should call createShipment and return created shipment', async () => {
    const payload: CreateShipmentDTO = {
      trackingNumber: 'TRK001',
      senderName: 'Alice',
      receiverName: 'Bob',
      origin: 'NY',
      destination: 'LA',
    };

    const createdShipment = { ...payload, id: '1' };
    shipmentRepository.create.mockResolvedValue(createdShipment as any);

    const result = await shipmentService.createShipment(payload);

    expect(shipmentRepository.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual(createdShipment);
  });

  it('should call updateShipment and return updated shipment', async () => {
    const payload: UpdateShipmentDTO = { status: 'in_transit' };
    const updatedShipment = { id: '1', trackingNumber: 'TRK001', status: 'in_transit' };
    shipmentRepository.update.mockResolvedValue(updatedShipment as any);

    const result = await shipmentService.updateShipment('1', payload);

    expect(shipmentRepository.update).toHaveBeenCalledWith('1', payload);
    expect(result).toEqual(updatedShipment);
  });

  it('should call deleteShipment and return result', async () => {
    const deletedShipment = { id: '1', trackingNumber: 'TRK001' };
    shipmentRepository.delete.mockResolvedValue(deletedShipment as any);

    const result = await shipmentService.deleteShipment('1');

    expect(shipmentRepository.delete).toHaveBeenCalledWith('1');
    expect(result).toEqual(deletedShipment);
  });
});
