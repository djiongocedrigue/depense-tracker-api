import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProduitsController } from './produits.controller'
import { ProduitsService } from './produits.service';
import { ProduitSchema } from './produits.model';
import { DepensesModule } from '../depenses/depenses.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Produit', schema: ProduitSchema }]),
    DepensesModule,
  ],
  controllers: [ProduitsController],
  providers: [ProduitsService],
})
export class ProduitsModule {}
