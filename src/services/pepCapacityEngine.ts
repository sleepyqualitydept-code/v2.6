/**
 * SLEEPEE INDUSTRIAL PEP CAPACITY ENGINE
 * =====================================
 * Manufacturing Line Capacity, Machine Utilization & Bottleneck Analysis Engine.
 * 
 * Formulas:
 * Available Shift Time (minutes) = Shift Hours * 60 * Operational Efficiency
 * Daily Available Time = Available Shift Time * Shifts Per Day
 * Unit Capacity = Available Time / Bottleneck Operation Cycle Time
 * Machine Utilization % = (Operation Cycle Time / Bottleneck Cycle Time) * 100
 */

import { RoutingStep } from '../types/erp';

export interface MachineWorkload {
  machineCode: string;
  machineNameAr: string;
  operationCode: string;
  operationNameAr: string;
  lineCode: string;
  cycleTimeMinutes: number;
  laborCount: number;
  utilizationPercentage: number;
  isBottleneck: boolean;
}

export interface CapacityEngineReport {
  overallCycleTimeMinutes: number;
  bottleneckCycleTimeMinutes: number;
  bottleneckOperation: string;
  bottleneckMachine: string;
  bottleneckLine: string;
  shiftHours: number;
  shiftsPerDay: number;
  workingDaysPerWeek: number;
  dailyCapacityUnits: number;
  weeklyCapacityUnits: number;
  monthlyCapacityUnits: number;
  overallMachineUtilization: number;
  overallLaborUtilization: number;
  machineWorkloads: MachineWorkload[];
}

export class PepCapacityEngine {
  public static calculateCapacity(params: {
    routingSteps: RoutingStep[];
    shiftHours?: number; // default 8
    shiftsPerDay?: number; // default 2
    workingDaysPerWeek?: number; // default 6
    lineEfficiency?: number; // default 0.88 (88% OEE)
  }): CapacityEngineReport {
    const shiftHours = params.shiftHours || 8;
    const shiftsPerDay = params.shiftsPerDay || 2;
    const workingDaysPerWeek = params.workingDaysPerWeek || 6;
    const lineEfficiency = params.lineEfficiency || 0.88;

    // Calculate total cycle time
    const overallCycleTimeMinutes = params.routingSteps.reduce((sum, s) => sum + (s.runTime || 10), 0);

    // Identify bottleneck step (step with the highest runTime)
    let maxRunTime = 0;
    let bottleneckStep: RoutingStep | null = null;

    const machineMap: Record<string, { nameAr: string; line: string }> = {
      'OP-CUT-01': { nameAr: 'ماكينة تقطيع إسفنج CNC-CUT-01', line: 'خط تفصيل الإسفنج (Line 01)' },
      'OP-SPRING-01': { nameAr: 'ماكينة تجميع نوابض آلية SPR-01', line: 'خط النوابض والشاسيه (Line 02)' },
      'OP-QUILT-01': { nameAr: 'ماكينة تطريز محوسبة QUILT-01', line: 'خط الكبتنة والتطريز (Line 03)' },
      'OP-BORDER-01': { nameAr: 'ماكينة حياكة الداير BORDER-01', line: 'خط تشطيب الداير (Line 04)' },
      'OP-TAPE-01': { nameAr: 'ماكينة تقفيل Tape Edge TAPE-01', line: 'خط التجميع المداري (Line 05)' },
      'OP-QC-01': { nameAr: 'محطة الفحص والتغليف الآلي PACK-01', line: 'خط الفحص والتعبئة (Line 06)' }
    };

    for (const step of params.routingSteps) {
      const stepDuration = Number(step.runTime) || 15;
      if (stepDuration > maxRunTime) {
        maxRunTime = stepDuration;
        bottleneckStep = step;
      }
    }

    const bottleneckDuration = maxRunTime || 25;
    const bottleneckOpCode = bottleneckStep ? bottleneckStep.operationCode : 'OP-QUILT-01';
    const bottleneckOpNameAr = bottleneckStep ? bottleneckStep.operationNameAr : 'كبتنة وتطريز الأقمشة العلوية';
    const bottleneckInfo = machineMap[bottleneckOpCode] || { 
      nameAr: `${bottleneckOpNameAr} (MCH-${bottleneckOpCode})`, 
      line: 'خط الإنتاج الرئيسي' 
    };

    // Calculate workload per machine and relative utilization
    const machineWorkloads: MachineWorkload[] = params.routingSteps.map(step => {
      const runTime = Number(step.runTime) || 15;
      const isBottleneck = step.operationCode === bottleneckOpCode;
      const util = Math.min(100, Math.round((runTime / bottleneckDuration) * 100));
      const info = machineMap[step.operationCode] || {
        nameAr: `${step.operationNameAr} (MCH-${step.operationCode})`,
        line: 'خط الإنتاج الرئيسي'
      };

      return {
        machineCode: step.operationCode.replace('OP-', 'MCH-'),
        machineNameAr: info.nameAr,
        operationCode: step.operationCode,
        operationNameAr: step.operationNameAr,
        lineCode: info.line,
        cycleTimeMinutes: runTime,
        laborCount: step.laborCount || 2,
        utilizationPercentage: util,
        isBottleneck
      };
    });

    // Available operational working minutes
    const availableMinutesPerShift = shiftHours * 60 * lineEfficiency;
    const dailyAvailableMinutes = availableMinutesPerShift * shiftsPerDay;

    // Unit capacity calculation: Available Time / Bottleneck Operation Cycle Time
    const dailyCapacityUnits = Math.floor(dailyAvailableMinutes / bottleneckDuration);
    const weeklyCapacityUnits = dailyCapacityUnits * workingDaysPerWeek;
    const monthlyCapacityUnits = Math.floor(weeklyCapacityUnits * 4.33);

    const overallMachineUtilization = Math.round(
      machineWorkloads.reduce((sum, m) => sum + m.utilizationPercentage, 0) / (machineWorkloads.length || 1)
    );

    const totalLabors = params.routingSteps.reduce((sum, s) => sum + (s.laborCount || 1), 0);
    const overallLaborUtilization = Math.min(96, Math.round(overallMachineUtilization * 0.94));

    return {
      overallCycleTimeMinutes,
      bottleneckCycleTimeMinutes: bottleneckDuration,
      bottleneckOperation: bottleneckOpNameAr,
      bottleneckMachine: bottleneckInfo.nameAr,
      bottleneckLine: bottleneckInfo.line,
      shiftHours,
      shiftsPerDay,
      workingDaysPerWeek,
      dailyCapacityUnits,
      weeklyCapacityUnits,
      monthlyCapacityUnits,
      overallMachineUtilization,
      overallLaborUtilization,
      machineWorkloads
    };
  }
}
