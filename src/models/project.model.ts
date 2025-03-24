export interface ProjectResponse {
  id: number;
  projectName: string;
  evaluations?: EvaluationResponse[];
  labelEvaluations?: LabelResponse[];
  role?: RoleRosponse;
}
export interface LabelResponse {
  id: number;
  label: string;
  shortLabel: string;
}

export interface RoleRosponse {
  id: number;
  code: string;
  name: string;
}

export interface ValueResponse {
  id: number;
  skill: string;
  value: number;
}

export interface EvaluationResponse {
  id: number;
  label: string;
  ratingAverage: number;
  values: ValueResponse[];
}
