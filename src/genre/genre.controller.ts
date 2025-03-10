import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParamInterceptor } from '../common/interceptor/param.interceptor';
import { WebResponse } from '../common/interface/web.interface';
import { webResponse } from '../common/helper/web.helper';
import {
  JsonErrorResponse,
  JsonPagingResponse,
  JsonSuccessResponse,
} from '../common/decorator/response.dto';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { FilterGenre } from './dto/filter-genre.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Genre')
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create genre' })
  @ApiBody({ type: CreateGenreDto })
  @JsonSuccessResponse(null, 201, 'Genre successfully created')
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async create(
    @Body() createGenreDto: CreateGenreDto,
  ): Promise<WebResponse<null>> {
    await this.genreService.create(createGenreDto);
    return webResponse(201, 'Genre successfully created');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All genre' })
  @JsonPagingResponse(GenreResponseDto, 200, 'Success', true)
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAll(
    @Query() filter: FilterGenre,
  ): Promise<WebResponse<GenreResponseDto[]>> {
    const { data, paging } = await this.genreService.findAll(filter);
    return webResponse(200, 'Success', data, paging);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First genre' })
  @JsonSuccessResponse(GenreResponseDto, 200, 'Success')
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findOne(
    @Param('id') id: string,
  ): Promise<WebResponse<GenreResponseDto>> {
    const data = await this.genreService.findOne(id);
    return webResponse(200, 'Success', data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update genre' })
  @ApiBody({ type: UpdateGenreDto })
  @JsonSuccessResponse(null, 200, 'Genre successfully updated')
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
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
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<WebResponse<null>> {
    await this.genreService.update(id, updateGenreDto);
    return webResponse(200, 'Genre successfully updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete genre' })
  @JsonSuccessResponse(null, 200, 'Genre successfully deleted')
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    await this.genreService.remove(id);
    return webResponse(200, 'Genre successfully deleted');
  }
}
