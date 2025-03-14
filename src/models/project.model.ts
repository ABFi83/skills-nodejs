export interface ProjectResponse {
  id: string;
  projectName: string;
  ratingAverage: number;
  //role: string;
  evaluations: EvaluationResponse[];
  labelEvaluations: LabelResponse[];
}
export interface LabelResponse {
  id: string;
  label: string;
  shortLabel: string;
}

export interface ValueResponse {
  id: string;
  skill: string;
  value: number;
}

export interface EvaluationResponse {
  id: string;
  label: string; //01/01/2024
  values: ValueResponse[];
}
