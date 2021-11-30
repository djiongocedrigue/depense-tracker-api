import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Produit } from './produits.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { DepensesService } from '../depenses/depenses.service';
@Injectable()
export class ProduitsService {
  private produitList: Produit[] = [];

  constructor(
    @InjectModel('Produit') private readonly produitModel: Model<Produit>,
    private readonly depensesServices: DepensesService,
  ) {}

  async createProduit(
    depenseId: string,
    nomProduit: string,
    descriptionProduit: string,
    prixProduit: number,
    quantiteProduit: number,
  ) {
    if (!nomProduit || !prixProduit || !quantiteProduit) {
      //On s'assure le champ associé à la date ou le titre de la dépense n'est vide!
      throw new BadRequestException(
        'Veuillez indiquer au moins le nom, le prix et la quantité du produit !',
      );
    } else {
      // Création d'un nouvel utilisateur à l'aide de mongoose
      const newProduit = new this.produitModel({
        nomProduit: nomProduit,
        descriptionProduit: descriptionProduit,
        prixProduit: prixProduit,
        quantiteProduit: quantiteProduit,
      });

      const insertResult = await newProduit.save(); // Enregistrement des données du nouveau produit dans le base de données MongoDB
      await this.depensesServices.addNewProduit(depenseId, newProduit._id);
      return { produitId: insertResult.id as string };
    }
  }

  async updateProduit(
    produitId: string,
    nomProduit: string,
    descriptionProduit: string,
    prixProduit: number,
    quantiteProduit: number,
  ) {
    try {
      const updatedProduit = await this.findOneProduit(produitId);

      if (nomProduit) updatedProduit.nomProduit = nomProduit;
      if (descriptionProduit)
        updatedProduit.descriptionProduit = descriptionProduit;
      if (prixProduit) updatedProduit.prixProduit = prixProduit;
      if (quantiteProduit) updatedProduit.quantiteProduit = quantiteProduit;

      updatedProduit.save(); // Enregistrement des données
      return 'Mise à jour Produit ID ' + produitId + ' : Succès !';
    } catch (error) {
      throw new NotFoundException(
        'Mise à jour Produit ID ' + produitId + ' : Echec !',
      );
    }
  }

  async removeProduit(depenseId: string, produitId: string) {
    const result = await this.produitModel.deleteOne({ _id: produitId }).exec();
    if (result.deletedCount > 0) {
      // on retire cet identifiant de la liste des dépense de l'utilisateur userID
      await this.depensesServices.removeOneProduitDepense(depenseId, produitId);
      return 'Suppression Produit ID ' + produitId + ' : Succès !';
    } else
      throw new NotFoundException(
        'Suppression Produit ID ' + produitId + ' : Echec !',
      );
  }

  async getOneProduit(depenseId: string, produitId: string) {
    try {
      const existeProduit = await this.depensesServices.existeProduit(
        depenseId,
        produitId,
      );
      if (existeProduit) {
        const produit = await this.findOneProduit(produitId);
        return {
          id: produit.id,
          nomProduit: produit.nomProduit,
          descriptionProduit: produit.descriptionProduit,
          prixProduit: produit.prixProduit,
          quantiteProduit: produit.quantiteProduit,
        };
      }
    } catch (error) {
      throw new NotFoundException(
        'Produit  ID : ' + produitId + " : n'existe pas !",
      );
    }
  }

  async getAllProduits(depenseId: string): Promise<Schema.Types.ObjectId[]> {
    //on recupere la liste de toute les depenses associé à l'utilisateur userId
    try {
      return await this.depensesServices.getListeProduits(depenseId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  private async findOneProduit(produitID: string): Promise<Produit> {
    let produit: Produit;
    try {
      produit = await this.produitModel.findById(produitID);
      return produit;
    } catch (error) {
      throw new NotFoundException(
        'Produit  ID : ' + produitID + " n'existe pas !",
      );
    }
  }
}
