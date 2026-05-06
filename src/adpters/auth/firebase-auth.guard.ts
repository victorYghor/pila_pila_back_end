import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from '../firebase/firebase.service';
import { DecodedIdToken } from 'firebase-admin/auth';

// 1. Opcional: Criar uma interface para manter o TypeScript feliz e tipado nos seus controllers
export interface AuthenticatedRequest extends Request {
  user: DecodedIdToken;
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  // Inicializando o Logger para ajudar no debug
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(private readonly firebase: FirebaseService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    const idToken = authHeader.slice('Bearer '.length).trim();

    try {
      // 2. O segundo parâmetro "true" força a checagem se o token foi revogado/invalidado
      const decoded = await this.firebase.auth.verifyIdToken(idToken, true);

      // 3. Tipagem mais limpa graças à interface AuthenticatedRequest
      request.user = decoded;

      return true;
    } catch (error: any) {
      // Logamos o erro real no console do servidor para o desenvolvedor ver
      this.logger.warn(`Falha na autenticação: ${error.message}`);

      // Retornamos um erro genérico (401) para o cliente por segurança
      throw new UnauthorizedException('Invalid, expired or revoked token');
    }
  }
}