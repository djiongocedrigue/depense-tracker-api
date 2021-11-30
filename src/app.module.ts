import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepensesModule } from './depenses/depenses.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProduitsModule } from './produits/produits.module';

@Module({
  imports: [
    ProduitsModule,
    DepensesModule, // Permet le gestion des dépenses faites par chaque utilisateur
    UsersModule, // Permet la gestion des utilisateurs
    MongooseModule.forRoot('mongodb://localhost:27017/depense_database'), // Permet de gérer la connexion à la base de données sur un serveur MongoDB local
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
