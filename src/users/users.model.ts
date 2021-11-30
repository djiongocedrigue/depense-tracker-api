import * as mongoose from 'mongoose';
import { Depense } from './../depenses/depenses.model';

export const UserSchema = new mongoose.Schema({
  /* Schéma pour le stockage des donées dans la bases de données*/
  loginName: {
    type: String,
    require: true,
    unique: true,
  },
  firstName: { type: String, require: true, unique: false },
  lastName: { type: String, require: true, unique: false },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: false },
  listeDepenses: [
    // il s'agit de la liste des dépenses effectués par un utilisateur. cette liste ne contient que les ID des differentes dépenses effectuées
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Depense',
    },
  ],
});

export interface User extends mongoose.Document {
  /* Interface Objet permettant de manipuler les documents qui sont stockés dans la base de donées */
  id: string;
  loginName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  listeDepenses: [mongoose.Schema.Types.ObjectId];
}

export const UserModel = mongoose.model('User', UserSchema);
