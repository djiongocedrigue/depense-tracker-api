import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcomeAPI(): string {
    return "Vous êtes dans l'API Gestion Depenses.";
  }
}
