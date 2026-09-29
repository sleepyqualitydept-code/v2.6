/**
 * PRODUCT ENGINEERING PACKAGE (PEP)
 * =================================
 * Official Engineering Entity: حزمة الهندسة والتصنيع المتكاملة للمنتج
 * 
 * Re-architected in accordance with Master Restructuring Directive:
 * - Unifies BOM Engineering, Routing, Product Classification, Compliance,
 *   Warranty, Lifecycle, Cost Engine, and Production Release into a single
 *   8-Stage Guided Accordion Workflow.
 * - Sourced strictly from Product Master, Material Master, and Warranty Policy Registry.
 * - Strict adherence to the Sleepee Industrial Design Language.
 */

import React from 'react';
import { ProductEngineeringPackage } from './pep/ProductEngineeringPackage';

export { ProductEngineeringPackage };

export const AiBomDesignCenter: React.FC = () => {
  return <ProductEngineeringPackage />;
};

export default AiBomDesignCenter;
