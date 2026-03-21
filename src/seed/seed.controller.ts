import { Controller, Get } from '@nestjs/common';

import { ValidRoles } from '../auth/interfaces/valid-roles';
import { Auth } from '../auth/decorators/auth.decorator';

import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }

}
