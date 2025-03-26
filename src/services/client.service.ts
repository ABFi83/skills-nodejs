import { Repository } from "typeorm";
import { Client } from "../entity/client.entity";
import { AppDataSource } from "../database/database";

export class ClientService {
  private clientRepository: Repository<Client>;

  constructor() {
    this.clientRepository = AppDataSource.getRepository(Client); // Creazione dell'istanza del repository
  }

  // Recupera tutti i client
  async getAllClients(): Promise<Client[]> {
    try {
      return await this.clientRepository.find(); // Trova tutti i client
    } catch (error) {
      throw new Error("Errore nel recuperare i client: " + error);
    }
  }

  // Recupera un client per ID
  async getClientById(id: number): Promise<Client | null> {
    try {
      return await this.clientRepository.findOne({ where: { id } }); // Trova un client per ID
    } catch (error) {
      throw new Error("Errore nel recuperare il client: " + error);
    }
  }

  // Crea un nuovo client
  async createClient(client: Client): Promise<Client> {
    try {
      return await this.clientRepository.save(client); // Crea e salva il client nel database
    } catch (error) {
      throw new Error("Errore nel creare il client: " + error);
    }
  }

  // Aggiorna un client esistente
  async updateClient(
    id: number,
    clientData: Partial<Client>
  ): Promise<Client | null> {
    try {
      const client = await this.clientRepository.findOne({ where: { id } }); // Trova il client esistente

      if (!client) {
        return null; // Se il client non esiste, restituisce null
      }

      // Aggiorna i dati del client e lo salva nel database
      Object.assign(client, clientData);
      return await this.clientRepository.save(client); // Salva l'oggetto aggiornato
    } catch (error) {
      throw new Error("Errore nell'aggiornare il client: " + error);
    }
  }

  // Elimina un client
  async deleteClient(id: number): Promise<void> {
    try {
      const client = await this.clientRepository.findOne({ where: { id } }); // Trova il client da eliminare

      if (!client) {
        throw new Error("Client non trovato");
      }

      await this.clientRepository.remove(client); // Elimina il client dal database
    } catch (error) {
      throw new Error("Errore nell'eliminare il client: " + error);
    }
  }
}
