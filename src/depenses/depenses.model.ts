import * as mongoose from 'mongoose';

export const DepenseSchema = new mongoose.Schema({
  /* Schéma pour le stockage des donées dans la bases de données*/
  titreDepense: { type: String, require: true, unique: false },
  dateAchat: {
    type: Date,
    require: true,
    unique: false,
  },
  descriptionAchat: { type: String, require: false, unique: false },
  produitsAchetes: [
    // il s'agit de la liste des produits se trouvant sur une dépense
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produit',
    },
  ],
});

export interface Depense extends mongoose.Document {
  /* Interface Objet permettant de manipuler les documents qui sont stockés dans la base de donées */
  id: string;
  titreDepense: string;
  dateAchat: Date;
  descriptionAchat: string;
  produitsAchetes: [mongoose.Schema.Types.ObjectId];
}

export const DepenseModel = mongoose.model('Depense', DepenseSchema);
