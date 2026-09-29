export interface CadLayerItem {
  id: string;
  layerType: string;
  material: string;
  thickness: number; // in cm
  density: number; // in kg/m3 (0 for springs/felts)
  cost: number; // SAR / m2
  supplier?: string;
  notes?: string;
}

export interface UnifiedCadLayerProps {
  layer: CadLayerItem;
  index: number;
  totalLayers: number;
  totalThickness: number;
  totalMaterialsCost: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  displayMode: 'crossSection' | 'exploded' | 'finishedProduct' | 'manufacturing';
  zoom: number;
  isTopLayer?: boolean;
  isBottomLayer?: boolean;
}

export type MaterialVisualCategory = 'spring' | 'foam' | 'latex' | 'felt' | 'fabric' | 'fiber';
