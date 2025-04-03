import { Request, Response } from "express";
import { SkillService } from "../services/skill.service";
import { Skill } from "../entity/skill.entity";

export class SkillController {
  private skillService: SkillService;

  constructor() {
    this.skillService = new SkillService();
  }

  // Recupera tutte le skill
  async getAllSkills(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query; // Recupera il parametro di query "search"

      // Passa il parametro "search" al servizio per filtrare i risultati
      const skills = await this.skillService.getAllSkills(search as string);

      res.json(skills);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Recupera una skill per ID
  async getSkillById(req: Request, res: Response): Promise<void> {
    try {
      const skillId = parseInt(req.params.id);
      const skill = await this.skillService.getSkillById(skillId);

      if (!skill) {
        res.status(404).json({ message: "Skill non trovata" });
        return;
      }

      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  // Crea una nuova skill
  async createSkill(req: Request, res: Response): Promise<void> {
    try {
      const skill: Skill = req.body as Skill;
      const createdSkill = await this.skillService.createSkill(skill);
      res.status(201).json(createdSkill);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Aggiorna una skill esistente
  async updateSkill(req: Request, res: Response): Promise<void> {
    try {
      const skillId = parseInt(req.params.id);
      const skillData: Partial<Skill> = req.body;
      const updatedSkill = await this.skillService.updateSkill(
        skillId,
        skillData
      );

      res.json(updatedSkill);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Elimina una skill
  async deleteSkill(req: Request, res: Response): Promise<void> {
    try {
      const skillId = parseInt(req.params.id);
      await this.skillService.deleteSkill(skillId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
