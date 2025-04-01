import { Request, Response } from "express";
import { Role } from "../entity/role.entity";
import { RoleService } from "../services/role.service";

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  // Recupera tutti i ruoli
  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.roleService.getAllRoles();
      res.json(roles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Recupera un ruolo per ID
  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.id);
      const role = await this.roleService.getRoleById(roleId);

      if (!role) {
        res.status(404).json({ message: "Ruolo non trovato" });
        return;
      }

      res.json(role);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crea un nuovo ruolo
  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const role: Role = req.body as Role;
      const createdRole = await this.roleService.createRole(role);
      res.status(201).json(createdRole);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Aggiorna un ruolo esistente
  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.id);
      const roleData: Partial<Role> = req.body;
      const updatedRole = await this.roleService.updateRole(roleId, roleData);

      if (!updatedRole) {
        res.status(404).json({ message: "Ruolo non trovato" });
        return;
      }

      res.json(updatedRole);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Elimina un ruolo
  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const roleId = parseInt(req.params.id);
      await this.roleService.deleteRole(roleId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
