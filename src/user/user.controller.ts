import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  JsonErrorResponse,
  JsonPagingResponse,
  JsonSuccessResponse,
} from '../common/decorator/response.dto';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { WebResponse } from '../common/interface/web.interface';
import { webResponse } from '../common/helper/web.helper';
import { FilterUser } from './dto/filter-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ParamInterceptor } from '../common/interceptor/param.interceptor';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('User')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @JsonSuccessResponse(null, 201, 'User successfully created')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<WebResponse<null>> {
    await this.userService.create(createUserDto);
    return webResponse(201, 'User successfully created');
  }

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All user' })
  @JsonPagingResponse(UserResponseDto, 200, 'Success', true)
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAll(
    @Query() filter: FilterUser,
  ): Promise<WebResponse<UserResponseDto[]>> {
    const { data, paging } = await this.userService.findAll(filter);
    return webResponse(200, 'Success', data, paging);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First user' })
  @JsonSuccessResponse(UserResponseDto, 200, 'Success')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findOne(
    @Param('id') id: string,
  ): Promise<WebResponse<UserResponseDto>> {
    const data = await this.userService.findOne(id);
    return webResponse(200, 'Success', data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({ type: UpdateUserDto })
  @JsonSuccessResponse(null, 200, 'User successfully updated')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  @UseInterceptors(ParamInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<WebResponse<null>> {
    await this.userService.update(id, updateUserDto);
    return webResponse(200, 'User successfully updated');
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user' })
  @JsonSuccessResponse(null, 200, 'User successfully deleted')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  @UseInterceptors(ParamInterceptor)
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    await this.userService.remove(id);
    return webResponse(200, 'User successfully deleted');
  }
}
