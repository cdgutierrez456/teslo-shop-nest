import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata, ParseUUIDPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserRoleGuard } from './guards/user-role.guard';

import { RoleProtected } from './decorators/role-protected.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';

import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'User logged in, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('check-status')
  @Auth()
  @ApiOperation({ summary: 'Validate current token and renew it' })
  @ApiResponse({ status: 200, description: 'Token is valid, returns new token' })
  @ApiResponse({ status: 401, description: 'Token expired or invalid' })
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Private test route (requires authentication)' })
  @ApiResponse({ status: 200, description: 'Returns user data and headers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() rawHeader: string[]
  ) {

    return {
      ok: true,
      message: "privado",
      user,
      email,
      rawHeader,
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Private test route (requires superUser role)' })
  @ApiResponse({ status: 200, description: 'Returns user data' })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user,
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Private test route (requires admin role)' })
  @ApiResponse({ status: 200, description: 'Returns user data' })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

}
