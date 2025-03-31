import { Request, Response } from "express";

import { Client } from "../entity/client.entity";
import { ClientService } from "../services/client.service";

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await this.clientService.getAllClients();
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const clientId = parseInt(req.params.id);
      const client = await this.clientService.getClientById(clientId);

      if (!client) {
        res.status(404).json({ message: "Client non trovato" });
        return;
      }

      res.json(client);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crea un nuovo client
  async createClient(req: Request, res: Response): Promise<void> {
    try {
      const client: Client = req.body as Client;
      const createdClient = await this.clientService.createClient(client);
      res.status(201).json(createdClient);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Aggiorna un client esistente
  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const clientId = parseInt(req.params.id);
      const clientData: Partial<Client> = req.body;
      const updatedClient = await this.clientService.updateClient(
        clientId,
        clientData
      );

      if (!updatedClient) {
        res.status(404).json({ message: "Client non trovato" });
        return;
      }

      res.json(updatedClient);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Elimina un client
  async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const clientId = parseInt(req.params.id);
      await this.clientService.deleteClient(clientId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
