
## Description
GESTION DEPENSE est une API permettant de construire des applications de gestions des dépenses pour un foyer.
Cet API permet de créer des utilisateur, de les associés une liste de dépenses comportant des produits.
Il est construit à l'aide dui framework NestJS et utilise une base de données MONGO DB.


## Utilisation

---Gestioin des utilisateurs  
Un urilisateur est décrit par :
  id: string;
  loginName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  listeDepenses: [mongoose.Schema.Types.ObjectId]; (Il s'agit ici d'une liste d'identifiant de document désignant les dépendes associé à un utilisateur)

  On peut: 
  Créer un utilisateur (POST)
  Mettre à jour certain information (PATCH)
  Supprimer (DELETE)
Obtenir les informations sur un utilisateur dont l'identifiant est connu (GET with userID as param and depenseID in the path)
Obtenir les information sur tout les utilisateurs

--- Gestions des dépenses et des produits

La manipulation des dépenses et des produits est similaire à celle d'un utilisateur.

## Support

Cetta API est un projet Opensource. Il a été réalisé par Cedrigue DJIONGO dans la cadre du cours Full Advanced Back
