import { QualityGate } from "@mosaic/contracts";

export interface QualityGateResult {
  passed: boolean;
  failedGates: QualityGate[];
}

export class QualityGateEvaluator {
  
  /**
   * Evaluates a list of quality gates against an artifact's payload.
   * In a real implementation, this would contain logic specifically comparing
   * payload metrics against the gate's threshold. For this mocked engine,
   * we simulate evaluation by reading predefined actualValues on the gates.
   */
  evaluate(gates: QualityGate[], payload: any): QualityGateResult {
    const failedGates: QualityGate[] = [];

    for (const gate of gates) {
      // In production: calculate actualValue from payload
      const actualValue = gate.actualValue ?? 1.0; 
      
      const passed = actualValue >= gate.threshold; // Simplified logic
      
      gate.passed = passed;
      gate.actualValue = actualValue;

      if (!passed) {
        failedGates.push(gate);
      }
    }

    return {
      passed: failedGates.length === 0,
      failedGates
    };
  }
}
