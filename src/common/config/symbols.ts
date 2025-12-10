const TYPES = {
  // databases
  DB_CONNECTION: Symbol.for('DB_CONNECTION'),

  // controllers
  HEALTH_CONTROLLER: Symbol.for('HealthController'),
  SHIPMENT_CONTROLLER: Symbol.for('ShipmentController'),

  // repositories
  SHIPMENT_REPOSITORY: Symbol.for('ShipmentRepository'),

  // services
  SHIPMENT_SERVICE: Symbol.for('ShipmentService'),

  DATA_SOURCE: Symbol.for('DATA_SOURCE')
};

export default TYPES;
