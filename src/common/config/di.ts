import { Container } from 'inversify';
import { HealthController } from '../../health/health.controller';
import TYPES from './symbols';
import { ShipmentController } from '../../shipment/controllers/shipment.controller';
import { ShipmentService } from '../../shipment/services/shipment.service';
import { ShipmentRepository } from '../../shipment/repositories/shipment.repository';

const container = new Container({ skipBaseClassChecks: true });

//controllers
container.bind<HealthController>(TYPES.HEALTH_CONTROLLER).to(HealthController).inSingletonScope();
container.bind<ShipmentController>(TYPES.SHIPMENT_CONTROLLER).to(ShipmentController).inSingletonScope();

//services
container.bind<ShipmentService>(TYPES.SHIPMENT_SERVICE).to(ShipmentService).inSingletonScope();

//repositories
container.bind<ShipmentRepository>(TYPES.SHIPMENT_REPOSITORY).to(ShipmentRepository).inSingletonScope();

export { container };
