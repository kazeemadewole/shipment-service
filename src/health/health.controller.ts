import { controller, httpGet } from 'inversify-express-utils';
import { BaseController } from '../common/base.controller';

@controller('/health')
export class HealthController extends BaseController {
    @httpGet('/')
    public async get() {
        return this.successResponse('Shipment Service is Running', 200);
    }
}
