import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  request,
  requestBody,
  requestParam,
  queryParam
} from 'inversify-express-utils';
import { BaseController } from '../../common/base.controller';
import TYPES from '../../common/config/symbols';
import { Request } from 'express';
import { validateBody, validateParam, validateQuery } from '../../common/middlewares/validator.middleware';

import { ShipmentService } from '../services/shipment.service';
import {
    CreateShipmentDTO,
  CreateShipmentSchemaStrict,
  getListShipmentQueryDTO,
  getListShipmentQuerySchema,
  ShipmentIdSchema,
  UpdateShipmentDTO,
  UpdateShipmentSchema
} from '../validations/shipment.validation';

@controller('/api/shipments')
export class ShipmentController extends BaseController {
  constructor(
    @inject(TYPES.SHIPMENT_SERVICE)
    private readonly shipmentService: ShipmentService
  ) {
    super();
  }

  @httpPost('/', validateBody(CreateShipmentSchemaStrict))
  async createShipment(
    @requestBody() body: CreateShipmentDTO,
    @request() req: Request
  ) {
    const data = await this.shipmentService.createShipment(body);
    return this.successResponse('Shipment successfully created', 201, { data });
  }

  @httpGet('/', validateQuery(getListShipmentQuerySchema))
  async getAllShipments(@queryParam() query: getListShipmentQueryDTO, @request() req: Request, ) {
    const data = await this.shipmentService.getAllShipments(query.page, query.limit);
    return this.successResponse('Shipments successfully fetched', 200, { data });
  }

  @httpGet('/:id', validateParam(ShipmentIdSchema))
  async getSingleShipment(
    @requestParam('id') id: string,
    @request() req: Request
  ) {
    const data = await this.shipmentService.getSingleShipment(id);
    return this.successResponse('Shipment successfully fetched', 200, { data });
  }

  @httpPut('/:id', validateParam(ShipmentIdSchema), validateBody(UpdateShipmentSchema))
  async updateShipment(
    @requestParam('id') id: string,
    @requestBody() body: UpdateShipmentDTO,
    @request() req: Request
  ) {
    const data = await this.shipmentService.updateShipment(id, body);
    return this.successResponse('Shipment successfully updated', 200, { data });
  }

  @httpDelete('/:id', validateParam(ShipmentIdSchema))
  async deleteShipment(
    @requestParam('id') id: string,
    @request() req: Request
  ) {
    const data = await this.shipmentService.deleteShipment(id);
    return this.successResponse('Shipment successfully deleted', 200, { data });
  }
}
