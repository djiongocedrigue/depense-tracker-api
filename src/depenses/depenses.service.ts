import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Depense } from './depenses.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { UsersService } from '../users/users.service';
@Injectable()
export class DepensesService {
  private userList: Depense[] = [];

  constructor(
    @InjectModel('Depense') private readonly depenseModel: Model<Depense>,
    private readonly userServices: UsersService,
  ) {}

  /* Fonction exécutée  pour créer une nouvelle depense et enregistrer ses données dans la liste des dépense créée 
     par l'utilisateur dont l'id est donné en paramètre la base de données.
      Le données reçues du controlleur sont d'abord inspecté afin de s'assurer que tous les champs sont remplis,
      puis un objet Javascript est créé à  partir de ces données grâce à mongoose. ensuite cet objet est sauvegader 
      dans la base de données, l'id de la nouvel dépense est ajouté dans la liste des dépenses créée par cet 
      utilisateur et il est renvoyé comme réponse sous la forme d'un JSON.string  {depenseId : numeroIdDepense}
    
      */
  async createDepense(
    userId: string,
    titreDepense: string,
    dateAchat: string,
    descriptionAchat: string,
  ) {
    if (!dateAchat || !titreDepense) {
      //On s'assure le champ associé à la date ou le titre de la dépense n'est vide!
      throw new BadRequestException(
        'Veuillez indiquer la date à laquelle cette dépense à été effectuée et/ou un titre !',
      );
    }

    // Création d'un nouvel utilisateur à l'aide de mongoose
    const newDepense = new this.depenseModel({
      titreDepense: titreDepense,
      dateAchat: new Date(dateAchat),
      descriptionAchat: descriptionAchat,
    });

    const insertResult = await newDepense.save(); // Enregistrement des données du nouvel utilisateur dans le base de données MongoDB

    // On let à jour la liste des l'utilisateur userId et on met à jour la liste de ses dépenses
    await this.userServices.addNewDepense(userId, newDepense._id);

    return { depenseId: insertResult.id as string }; // Renvoi l'ID du nouvel utlisateur créé sous la la forme d'un JSON
  }

  async updateDepense(
    depenseId: string,
    titreDepense: string,
    dateAchat: string,
    descriptionAchat: string,
  ) {
    try {
      const updatedDepense = await this.findOneDepense(depenseId);
      if (titreDepense) updatedDepense.titreDepense = titreDepense;
      if (dateAchat) updatedDepense.dateAchat = new Date(dateAchat);
      if (descriptionAchat) updatedDepense.descriptionAchat = descriptionAchat;

      updatedDepense.save(); // Enregistrement des données
      return 'Mise à jour Depense ID ' + depenseId + ' : Succès !';
    } catch (error) {
      throw new NotFoundException(
        'Mise à jour Depense ID ' + depenseId + ' : Echec !',
      );
    }
  }

  /** Cette fonction retire toutes les données associé à la dépense dont l'ID est passé en paramètre. Elle utiliser
   * pour cela la fonction deleteOne de Mongoose. Elle renvoie un message de succès
   * une execption si cet utilisateur n'existe pas.
   */
  async removeDepense(userId: string, depenseId: string) {
    const result = await this.depenseModel.deleteOne({ _id: depenseId }).exec();
    if (result.deletedCount > 0) {
      // on retire cet identifiant de la liste des dépense de l'utilisateur userID
      await this.userServices.removeOneDepenseUser(userId, depenseId);
      return 'Suppression Depense ID ' + depenseId + ' : Succès !';
    } else
      throw new NotFoundException(
        'Suppression Depense ID ' + depenseId + ' : Echec !',
      );
  }

  async getOneDepense(userId: string, depenseId: string) {
    try {
      // On vérifie si cet utilisateur possède bien la dépense dont l'ID est fournit
      const existeDepense = await this.userServices.existeDepense(
        userId,
        depenseId,
      );
      if (existeDepense) {
        const depense = await this.findOneDepense(depenseId);
        return {
          id: depense.id,
          titreDepense: depense.titreDepense,
          dateAchat: depense.dateAchat,
          descriptionAchat: depense.descriptionAchat,
        };
      }
    } catch (error) {
      throw new NotFoundException(
        'Depense +++ ID : ' + depenseId + " : N'existe pas !",
      );
    }
  }

  /** Cette fonction recupère la liste de toutes dépenses réalisé par un utilisateur et la renvoie sous la forme d'un tableau de Depense
   * Elle s'appuie sur le methode find() offerte par Mongoose pour lire toutes les données stockées dans un
   * document MongoDB
   */
  async getAllDepense(userId: string): Promise<Schema.Types.ObjectId[]> {
    //on recupere la liste de toute les depenses associé à l'utilisateur userId
    try {
      return await this.userServices.getListeDepense(userId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /** Nous allon ajouter une nouvelle dépense dans la liste des dépenses chaque fois qu'une nouvelle dépense est crée */
  async addNewProduit(depenseID: string, produitID: Schema.Types.ObjectId) {
    try {
      await this.depenseModel.findByIdAndUpdate(
        depenseID,
        { $push: { produitsAchetes: produitID } },
        { new: true, useFindAndModify: false },
      );
    } catch (error) {
      throw new NotFoundException(
        "Ajout d'un produit dans la dépense  ID " + depenseID + ' : Echec !',
      );
    }
  }

  async removeOneProduitDepense(depenseID: string, produitId: string) {
    try {
      await this.depenseModel.findByIdAndUpdate(
        depenseID,
        { $pull: { produitsAchetes: { _id: produitId } } },
        { new: true, useFindAndModify: false },
      );
    } catch (error) {
      throw new NotFoundException(
        'Suppression du produit ID ' +
          produitId +
          ' de la depense ID ' +
          depenseID +
          ' : Echec !',
      );
    }
  }

  async existeProduit(depenseId: string, produitId: string): Promise<boolean> {
    try {
      const depense = await this.depenseModel.findById(depenseId);
      try {
        if (!depense.produitsAchetes) {
          return false;
        } else {
          const stringsArrayProduitsID = depense.produitsAchetes.map(
            (produit_id) => produit_id.toString(),
          );
          return stringsArrayProduitsID.includes(produitId);
        }
      } catch (error) {
        throw new NotFoundException(
          'Produit +++ ID : ' + produitId + " n'existe pas !",
        );
      }
    } catch (error) {
      throw new NotFoundException(
        'Depense  ID : ' + depenseId + " n'existe pas !",
      );
    }
  }

  async getListeProduits(depenseId: string): Promise<Schema.Types.ObjectId[]> {
    try {
      const depense = await this.depenseModel.findById(depenseId).populate({
        path: 'produitsAchetes',
        select: '_id nomProduit descriptionProduit prixProduit quantiteProduit',
      });
      return depense.produitsAchetes;
    } catch (error) {
      throw new NotFoundException(
        'Depense  ID : ' + depenseId + " : N'existe pas !",
      );
    }
  }
  private async findOneDepense(depenseID: string): Promise<Depense> {
    let depense: Depense;
    try {
      depense = await this.depenseModel.findById(depenseID);
      return depense;
    } catch (error) {
      throw new NotFoundException(
        'Depense  ID : ' + depenseID + " n'existe pas !",
      );
    }
  }
}
