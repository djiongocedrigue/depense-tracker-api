import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { ProduitsService } from './produits.service';

@Controller('produits')
export class ProduitsController {
  constructor(private readonly produitsServices: ProduitsService) {}

  @Post()
  async createProduit(
    @Body('depenseId') depenseId: string,
    @Body('nomProduit') nomProduit: string,
    @Body('descriptionProduit') descriptionProduit: string,
    @Body('prixProduit') prixProduit: number,
    @Body('quantiteProduit') quantiteProduit: number,
  ) {
    try {
      return await this.produitsServices.createProduit(
        depenseId,
        nomProduit,
        descriptionProduit,
        prixProduit,
        quantiteProduit,
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Patch(':produitId')
  async updateProduit(
    @Param('produitId') produitId: string,
    @Body('nomProduit') nomProduit: string,
    @Body('descriptionProduit') descriptionProduit: string,
    @Body('prixProduit') prixProduit: number,
    @Body('quantiteProduit') quantiteProduit: number,
  ) {
    try {
      return await this.produitsServices.updateProduit(
        produitId,
        nomProduit,
        descriptionProduit,
        prixProduit,
        quantiteProduit,
      );
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':produitId')
  async removeProduit(
    @Param('produitId') produitId: string,
    @Body('depenseId') depenseId: string,
  ) {
    return await this.produitsServices.removeProduit(depenseId, produitId);
  }

  @Get(':produitId')
  
  async getOneProduit(
    @Param('produitId') produitId: string,
    @Body('depenseId') depenseId: string,
  ) {
    return await this.produitsServices.getOneProduit(depenseId, produitId);
  }

  @Get()
  async getAllProduits(@Body('depenseId') depenseId: string) {
    return await this.produitsServices.getAllProduits(depenseId);
  }
}
