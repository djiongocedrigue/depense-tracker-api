import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { DepensesService } from './depenses.service';

@Controller('depenses')
export class DepensesController {
  constructor(private readonly depensesServices: DepensesService) {}

  @Post()
  async createDepense(
    @Body('userId') userId: string,
    @Body('titreDepense') titreDepense: string,
    @Body('dateAchat') dateAchat: string,
    @Body('descriptionAchat') descriptionAchat: string,
  ) {
    try {
      return await this.depensesServices.createDepense(
        userId,
        titreDepense,
        dateAchat,
        descriptionAchat,
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Patch(':depenseId')
  async updateDepense(
    @Param('depenseId') depenseId: string,
    @Body('titreDepense') titreDepense: string,
    @Body('dateAchat') dateAchat: string,
    @Body('descriptionAchat') descriptionAchat: string,
  ) {
    try {
      return await this.depensesServices.updateDepense(
        depenseId,
        titreDepense,
        dateAchat,
        descriptionAchat,
      );
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':depenseId')
  async removeDepense(
    @Param('depenseId') depenseId: string,
    @Body('userId') userId: string,
  ) {
    return await this.depensesServices.removeDepense(userId, depenseId);
  }

  @Get(':depenseId')
  async getOneDepense(
    @Param('depenseId') depenseId: string,
    @Body('userId') userId: string,
  ) {
    return await this.depensesServices.getOneDepense(userId, depenseId);
  }

  @Get()
  async getAllDepense(@Body('userId') userId: string) {
    return await this.depensesServices.getAllDepense(userId);
  }
}
