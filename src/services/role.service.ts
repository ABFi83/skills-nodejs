import { Repository, Like } from "typeorm";

import { Role } from "../entity/role.entity";
import { AppDataSource } from "../database/database";

export class RoleService {
  private roleRepository: Repository<Role>;

  constructor() {
    this.roleRepository = AppDataSource.getRepository(Role);
  }

  // Recupera tutti i ruoli
  async getAllRoles(search?: string): Promise<Role[]> {
    const whereCondition = search
      ? { name: Like(`%${search}`) } // Filtra i ruoli il cui nome contiene il valore di "search"
      : {};

    return await this.roleRepository.find({
      where: whereCondition,
    });
  }

  // Recupera un ruolo per ID
  async getRoleById(id: number): Promise<Role | null> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  // Crea un nuovo ruolo
  async createRole(role: Role): Promise<Role> {
    const newRole = this.roleRepository.create(role);
    return await this.roleRepository.save(newRole);
  }

  // Aggiorna un ruolo esistente
  async updateRole(id: number, roleData: Partial<Role>): Promise<Role | null> {
    const role = await this.getRoleById(id);
    if (!role) return null;

    Object.assign(role, roleData);
    return await this.roleRepository.save(role);
  }

  // Elimina un ruolo
  async deleteRole(id: number): Promise<void> {
    const role = await this.getRoleById(id);
    if (role) {
      await this.roleRepository.remove(role);
    }
  }
}
