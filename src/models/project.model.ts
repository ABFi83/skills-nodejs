import { UserResponse } from "./user.model";
import { Evaluation } from "../entity/evaluation.entity";

export interface ProjectResponse {
  id: number;
  projectName: string;
  description: string;
  evaluations?: EvaluationResponse[];
  labelEvaluations?: LabelResponse[];
  role?: RoleResponse;
  users: UserResponse[];
  client?: ClientResponse;
}
export interface ClientResponse {
  id: number;
  code: string;
  name: string;
  logo: string;
}
export interface LabelResponse {
  id: number;
  label: string;
  shortLabel: string;
}

export interface RoleResponse {
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
  startDate?: Date;
  endDate?: Date;
  values: ValueResponse[];
}

export interface EvaluationRequest {
  startDate: Date;
  endDate: Date;
  evaluationDate: Date;
}
export interface ValueRequest {
  evaluationId?: number;

  values: ValueResponse[];
}
