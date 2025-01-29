import { NewAuthService } from '../feature/auth/auth.service';

export function authAppInitializerFactory(
  authService: NewAuthService
): () => Promise<void> {
  return () => authService.runInitialLoginSequence();
}
