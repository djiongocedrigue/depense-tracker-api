import * as mongoose from 'mongoose';

export const ProduitSchema = new mongoose.Schema({
  /* Schéma pour le stockage des produits dans la bases de données*/
  nomProduit: { type: String, require: true, unique: false },
  descriptionProduit: { type: String, require: false, unique: false },
  prixProduit: { type: Number, require: true, unique: false },
  quantiteProduit: { type: Number, require: true, unique: false },
});

export interface Produit extends mongoose.Document {
  /* Interface Objet permettant de manipuler les documents qui sont stockés dans la base de donées */
  id: string;
  nomProduit: string;
  descriptionProduit: string;
  prixProduit: number;
  quantiteProduit: number;
}

export const ProduitModel = mongoose.model('Produit', ProduitSchema);
