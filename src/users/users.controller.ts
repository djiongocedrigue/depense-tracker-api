import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @Post()
  async createUser(
    @Body('loginName') loginName: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      return await this.userServices.createUser(
        loginName,
        firstName,
        lastName,
        email,
        password, 
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Patch(':userID')
  async updateUser(
    @Param('userID') userID: string,
    @Body('login') loginName: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      return await this.userServices.updateUser(
        userID,
        loginName,
        firstName,
        lastName,
        email,
        password,
      );
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':userID')
  async removeUser(@Param('userID') userID: string) {
    return await this.userServices.removeUser(userID);
  }

  @Get(':userID')
  async getOneUser(@Param('userID') userID: string) {
    return await this.userServices.getOneUser(userID);
  }

  @Get()
  async getAllUser() {
    return await this.userServices.getAllUser();
  }
}
