export type PepStepId = 1 | 2 | 3 | 4 | 5 | 6;

export interface PepStepMeta {
  id: PepStepId;
  code: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
}

export interface PepCloneOptions {
  sourceModelId: string;
  newModelName: string;
  newModelCode: string;
  newTargetHeight: number;
  cloneMaterials: boolean;
  cloneAssemblies: boolean;
  cloneRouting: boolean;
  cloneWarranty: boolean;
  cloneCostStructure: boolean;
  cloneComplianceSettings: boolean;
}

export interface AssemblyTreeNode {
  id: string;
  key: 'top' | 'spring' | 'bottom' | 'border' | 'sub';
  nameAr: string;
  nameEn: string;
  type: 'Finished' | 'Assembly' | 'Sub-Assembly' | 'Semi-Finished' | 'Raw' | 'Purchased';
  routingStepCode?: string;
  thickness: number;
  weight: number;
  cost: number;
  layersCount: number;
  children?: AssemblyTreeNode[];
}
