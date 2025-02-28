import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { webResponse } from '../common/helper/web.helper';
import { WebResponse } from '../common/interface/web.interface';
import { TransactionService } from './transaction.service';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { FilterTransaction } from './dto/filter-transaction.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { ICurrentUser } from '../common/types/user.interface';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Transaction')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All transaction' })
  @JsonPagingResponse(TransactionResponseDto, 200, 'Success', true)
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAll(
    @Query() filter: FilterTransaction,
  ): Promise<WebResponse<TransactionResponseDto[]>> {
    const { data, paging } = await this.transactionService.findAll(filter);
    return webResponse(200, 'Success', data, paging);
  }

  @Get('history')
  @Roles(Role.RENTER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get History transaction user' })
  @JsonPagingResponse(TransactionResponseDto, 200, 'Success', true)
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAllHistory(
    @Query() filter: FilterTransaction,
    @CurrentUser() user: ICurrentUser,
  ): Promise<WebResponse<TransactionResponseDto[]>> {
    const { data, paging } = await this.transactionService.findAllHistory(
      filter,
      user.id,
    );
    return webResponse(200, 'Success', data, paging);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RENTER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First transaction' })
  @JsonSuccessResponse(TransactionResponseDto, 200, 'Success')
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
  ): Promise<WebResponse<TransactionResponseDto>> {
    const data = await this.transactionService.findOne(id);
    return webResponse(200, 'Success', data);
  }
}
