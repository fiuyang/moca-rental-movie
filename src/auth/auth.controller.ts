import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthResponse, RefreshTokenDto, SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { webResponse } from '../common/helper/web.helper';
import { WebResponse } from '../common/interface/web.interface';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import {
  JsonErrorResponse,
  JsonSuccessResponse,
} from '../common/decorator/response.dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ICurrentUser } from '../common/types/user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignUpDto })
  @ApiOperation({ summary: 'SignUp user' })
  @JsonSuccessResponse(null, 201, 'Register successfully')
  @JsonErrorResponse(400, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async signUp(@Body() dto: SignUpDto): Promise<WebResponse<null>> {
    await this.authService.signUp(dto);
    return webResponse(201, 'Register successfully');
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiBody({ type: SignInDto })
  @ApiOperation({ summary: 'SignIn user' })
  @JsonSuccessResponse(AuthResponse, 200, 'Login successfully')
  @JsonErrorResponse(400, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async signIn(@Body() dto: SignInDto): Promise<WebResponse<AuthResponse>> {
    const data = await this.authService.signIn(dto);
    return webResponse(200, 'Login successfully', data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiBody({ type: RefreshTokenDto })
  @ApiOperation({ summary: 'Refresh token user' })
  @JsonSuccessResponse(AuthResponse, 200, 'Refresh token successfully')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async refresh(
    @CurrentUser() user: any,
    @Body() dto: RefreshTokenDto,
  ): Promise<WebResponse<AuthResponse>> {
    const data = await this.authService.refreshTokens(
      user.id,
      dto.refresh_token,
    );
    return webResponse(200, 'Refresh token successfully', data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @JsonSuccessResponse(null, 200, 'Logout successfully')
  @JsonErrorResponse(400, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async logout(@CurrentUser() user: ICurrentUser): Promise<WebResponse<null>> {
    await this.authService.logout(user.id);
    return webResponse(200, 'logout successfully');
  }
}
