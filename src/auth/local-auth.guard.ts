import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A class to avoid passing the used authentication strategy to AuthGuard() as magic strings.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}