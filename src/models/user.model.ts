import { RoleResponse } from "./project.model";

export interface UserResponse {
  id: number;
  username: string;
  name?: string;
  surname?: string;
  role?: RoleResponse;
  ratingAverage?: number;
}
