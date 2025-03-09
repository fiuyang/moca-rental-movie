import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ParamInterceptor } from '../common/interceptor/param.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseFilterDto } from '../common/dto/base-filter.dto';
import {
  JsonErrorResponse,
  JsonPagingResponse,
  JsonSuccessResponse,
} from '../common/decorator/response.dto';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { webResponse } from '../common/helper/web.helper';
import { WebResponse } from '../common/interface/web.interface';
import { MovieResponseDto } from './dto/movie-response.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create movie' })
  @ApiBody({ type: CreateMovieDto })
  @JsonSuccessResponse(null, 201, 'Movie successfully created')
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
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<WebResponse<null>> {
    await this.movieService.create(createMovieDto);
    return webResponse(201, 'Movie successfully created');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All movie' })
  @JsonPagingResponse(MovieResponseDto, 200, 'Success', true)
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
    @Query() filter: BaseFilterDto,
  ): Promise<WebResponse<MovieResponseDto[]>> {
    const { data, paging } = await this.movieService.findAll(filter);
    return webResponse(200, 'Success', data, paging);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First movie' })
  @JsonSuccessResponse(MovieResponseDto, 200, 'Success')
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
  ): Promise<WebResponse<MovieResponseDto>> {
    const data = await this.movieService.findOne(id);
    return webResponse(200, 'Success', data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update movie' })
  @ApiBody({ type: UpdateMovieDto })
  @JsonSuccessResponse(null, 200, 'Movie successfully updated')
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
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<WebResponse<null>> {
    await this.movieService.update(id, updateMovieDto);
    return webResponse(200, 'Movie successfully updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete movie' })
  @JsonSuccessResponse(null, 200, 'Movie successfully deleted')
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
    await this.movieService.remove(id);
    return webResponse(200, 'Movie successfully deleted');
  }
}
