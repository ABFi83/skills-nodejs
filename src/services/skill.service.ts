import { Repository, Like } from "typeorm";
import { AppDataSource } from "../database/database";
import { Skill } from "../entity/skill.entity";

export class SkillService {
  private skillRepository: Repository<Skill>;

  constructor() {
    this.skillRepository = AppDataSource.getRepository(Skill);
  }

  // Recupera tutte le skill
  async getAllSkills(search?: string): Promise<Skill[]> {
    try {
      const whereCondition = search
        ? { name: Like(`%${search}`) } // Filtra le skill il cui nome contiene il valore di "search"
        : {};

      return await this.skillRepository.find({
        where: whereCondition,
      });
    } catch (error) {
      console.error("Errore durante il recupero delle skill:", error);
      throw new Error("Non è stato possibile recuperare le skill.");
    }
  }

  // Recupera una skill per ID
  async getSkillById(id: number): Promise<Skill | null> {
    try {
      return await this.skillRepository.findOne({ where: { id } });
    } catch (error) {
      console.error("Errore durante il recupero della skill:", error);
      throw new Error("Non è stato possibile recuperare la skill.");
    }
  }

  // Crea una nuova skill
  async createSkill(skill: Skill): Promise<Skill> {
    try {
      return await this.skillRepository.save(skill);
    } catch (error) {
      console.error("Errore durante la creazione della skill:", error);
      throw new Error("Non è stato possibile creare la skill.");
    }
  }

  // Aggiorna una skill esistente
  async updateSkill(id: number, skillData: Partial<Skill>): Promise<Skill> {
    try {
      await this.skillRepository.update(id, skillData);
      const updatedSkill = await this.getSkillById(id);
      if (!updatedSkill) {
        throw new Error("Skill non trovata dopo l'aggiornamento.");
      }
      return updatedSkill;
    } catch (error) {
      console.error("Errore durante l'aggiornamento della skill:", error);
      throw new Error("Non è stato possibile aggiornare la skill.");
    }
  }

  // Elimina una skill
  async deleteSkill(id: number): Promise<void> {
    try {
      await this.skillRepository.delete(id);
    } catch (error) {
      console.error("Errore durante l'eliminazione della skill:", error);
      throw new Error("Non è stato possibile eliminare la skill.");
    }
  }
}
