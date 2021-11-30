import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DepensesController } from './depenses.controlller';
import { DepensesService } from './depenses.service';
import { DepenseSchema } from './depenses.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Depense', schema: DepenseSchema }]),
    UsersModule,
  ],
  controllers: [DepensesController],
  providers: [DepensesService],
  exports: [DepensesService],
})
export class DepensesModule {}
