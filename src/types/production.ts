export interface GeneratedSerial {
  serialNumber: string;
  warrantyNumber: string;
  productName: string;
  productionDate: string;
  batchNumber: string;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  productionDate: string;
  productionOrderNumber?: string;
  notes?: string;
  createdAt: string;
  serials: GeneratedSerial[];
}
