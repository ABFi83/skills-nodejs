import { Repository, Like } from "typeorm";
import { AppDataSource } from "../database/database";
import { User } from "../entity/user.entity";
import bcrypt from "bcrypt";
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Recupera tutti gli utenti
  async getAllUsers(search?: string): Promise<User[]> {
    try {
      const whereCondition = search
        ? { username: Like(`${search}%`) } // Filtra gli utenti il cui username contiene il valore di "search"
        : {};

      return await this.userRepository.find({
        where: whereCondition,
      });
    } catch (error) {
      console.error("Errore durante il recupero degli utenti:", error);
      throw new Error("Non è stato possibile recuperare gli utenti.");
    }
  }

  // Crea un nuovo utente
  async createUser(user: User): Promise<User> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
      return await this.userRepository.save(user);
    } catch (error) {
      console.error("Errore durante la creazione dell'utente:", error);
      throw new Error("Non è stato possibile creare l'utente.");
    }
  }

  // Aggiungi altri metodi del servizio come "findById", "deleteUser", ecc.
  async getUserById(id: number): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error("Errore durante il recupero dell'utente:", error);
      throw new Error("Non è stato possibile recuperare l'utente.");
    }
  }

  async getUsernamePassword(username: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { username: username },
      });
    } catch (error) {
      console.error("Errore durante il recupero dell'utente:", error);
      throw new Error("Non è stato possibile recuperare l'utente.");
    }
  }

  // Metodo per eliminare un utente
  async deleteUser(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id); // Elimina l'utente tramite ID
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'utente:", error);
      throw new Error("Non è stato possibile eliminare l'utente.");
    }
  }
}
