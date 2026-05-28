"use client";

export type EvaluationScenario = {
  evaluation_id: number;
  split_ratio: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  is_active: boolean;
};

export type GroupedEvaluation = {
  k_value: number;
  is_active: boolean;
  scenarios: EvaluationScenario[];
};