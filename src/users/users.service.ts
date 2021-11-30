import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { DepenseModel, Depense } from '../depenses/depenses.model';
import * as mongoose from 'mongoose';
@Injectable()
export class UsersService {
  private userList: User[] = [];

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  /* Fonction exécutée  poir créer un nouvel utilisateur et enregistrer ses données dans la base de données.
    Le données recçues du controlleur sont d'abord inspecté afin de s'assurer que tous les champs sont remplis,
    puis un objet Javascript est créé à  partir de ces données grâce à mongoose. ensuite cet objet est sauvegader 
    dans la base de données et  l'id du nouvel utilisateur est renvoyé comme réponse sous la forme d'un JSON.string
    {userId : numeroIdUtilisateur}
  
    */
  async createUser(
    loginName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    if (!loginName || !firstName || !lastName || !email || !password) {
      //On s'assure qu'aucun champ n'est vide!
      throw new BadRequestException(
        'Veuillez remplir tous les  champs du formulaire',
      );
    }
    // Création d'un nouvel utilisateur à l'aide de mongoose
    const newUser = new this.userModel({
      loginName: loginName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    const insertResult = await newUser.save(); // Enregistrement des données du nouvel utilisateur dans le base de données MongoDB
    return { userId: insertResult.id as string }; // Renvoi l'ID du nouvel utlisateur créé sous la la forme d'un JSON
  }

  async updateUser(
    userID: string,
    loginName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    try {
      const updatedUser = await this.findOneUser(userID);
      if (loginName) updatedUser.loginName = loginName;
      if (firstName) updatedUser.firstName = firstName;
      if (lastName) updatedUser.lastName = lastName;
      if (email) updatedUser.email = email;
      if (password) updatedUser.password = password;

      updatedUser.save(); // Enregistrement des données
      //this.userList[userIndex] = updatedUser;
      return 'Mise à jour utilisateur ID ' + userID + ' : Succès !';
    } catch (error) {
      throw new NotFoundException(
        'Mise à jour utilisateur ID ' + userID + ' : Echec !',
      );
    }
  }

  /** Cette fonction retire toutes les données associé à l'utilisateur dont l'ID est passé en paramètre. Elle utiliser
   * pour cela la fonction deleteOne de Mongoose. Elle renvoie un message de succès
   * une execption si cet utilisateur n'existe pas.
   */
  async removeUser(userID: string) {
    const result = await this.userModel.deleteOne({ _id: userID }).exec();
    if (result.deletedCount > 0)
      return 'Suppression utilisateur ID ' + userID + ' : Succès !';
    else
      throw new NotFoundException(
        'Suppression utilisateur ID ' + userID + ' : Echec !',
      );
  }

  async getOneUser(userID: string) {
    try {
      const user = await this.findOneUser(userID);
      return {
        id: user.id,
        loginName: user.loginName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        listeDepenses: user.listeDepenses,
      };
    } catch (error) {
      throw new NotFoundException(
        'Utilisateur  ID : ' + userID + " : N'existe pas !",
      );
    }
  }

  /** Cette fonction recupère la liste de tous les utilisateurs de la base de données et la renvoie sous la forme d'un tableau de User
   * dont les informations sensibles commes les mots de passes sont masqués
   * Elle s'appuie sur le methode find() offerte par Mongoose pour lire toutes les données stockées dans un
   * document MongoDB
   */
  async getAllUser() {
    const userList = await this.userModel
      .find()
      .populate({
        path: 'listeDepenses',
        select: 'titreDepense',
      })
      .exec(); // la méthode exec() permet de transformer le retour de la méthode sous la forme d'une Promise

    return userList.map((user) => ({
      id: user.id,
      loginName: user.loginName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      listeDepense: user.listeDepenses,
    })); //as User[];
  }

  /** Nous allon ajouter une nouvelle dépense dans la liste des dépenses chaque fois qu'une nouvelle dépense est crée */
  async addNewDepense(userID: string, depenseID: Schema.Types.ObjectId) {
    try {
      await this.userModel.findByIdAndUpdate(
        userID,
        { $push: { listeDepenses: depenseID } },
        { new: true, useFindAndModify: false },
      );
    } catch (error) {
      throw new NotFoundException(
        "Ajout d'une nouvelle dépense pour utilisateur ID " +
          userID +
          ' : Echec !',
      );
    }
  }

  async removeOneDepenseUser(userID: string, depenseID: string) {
    try {
      await this.userModel.findByIdAndUpdate(
        userID,
        { $pull: { listeDepenses: { _id: depenseID } } },
        { new: true, useFindAndModify: false },
      );
    } catch (error) {
      throw new NotFoundException(
        'Suppression de la dépense ID ' +
          depenseID +
          " de l'utilisateur ID " +
          userID +
          ' : Echec !',
      );
    }
  }

  async existeDepense(userID: string, depenseID: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(userID);
      try {
        if (!user.listeDepenses) {
          return false;
        } else {
          const stringsArrayDepenseID = user.listeDepenses.map((depense_id) =>
            depense_id.toString(),
          );
          return stringsArrayDepenseID.includes(depenseID);
        }
      } catch (error) {
        throw new NotFoundException(
          'Depense +++ ID : ' + depenseID + " n'existe pas !",
        );
      }
    } catch (error) {
      throw new NotFoundException(
        'Utilisateur  ID : ' + userID + " n'existe pas !",
      );
    }
  }

  async getListeDepense(userId: string): Promise<Schema.Types.ObjectId[]> {
    try {
      const user = await this.userModel.findById(userId).populate({
        path: 'listeDepenses',
        select: '_id titreDepense dateAchat descriptionAchat produitsAchetes',
      });
      return user.listeDepenses;
    } catch (error) {
      throw new NotFoundException(
        'Utilisateur  ID : ' + userId + " : N'existe pas !",
      );
    }
  }
  private async findOneUser(userID: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findById(userID).populate({
        path: 'listeDepenses',
        select: 'titreDepense',
      });
      return user;
    } catch (error) {
      throw new NotFoundException(
        'Utilisateur  ID : ' + userID + " n'existe pas !",
      );
    }
  }
}
