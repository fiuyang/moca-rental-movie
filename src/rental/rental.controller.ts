import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreatePaymentCashDto,
  CreateProcessPayDto,
} from './dto/create-process-pay.dto';
import { FilterGenre } from '../genre/dto/filter-genre.dto';
import {
  JsonErrorResponse,
  JsonPagingResponse,
  JsonSuccessResponse,
} from '../common/decorator/response.dto';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { webResponse } from '../common/helper/web.helper';
import { WebResponse } from '../common/interface/web.interface';
import { BankTransferResponseDto } from '../midtrans/dto/bank-transfer-response.dto';
import {
  PaymentCashResponseDto,
  RentalResponseDto,
} from './dto/rental-response.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { ICurrentUser } from '../common/types/user.interface';
import { PayLateFeeDto } from '../transaction/dto/pay-late-fee.dto';
import { RolesGuard } from '../common/guards/role.guard';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorator/roles.decorator';

@ApiTags('Rental')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RENTER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create rental' })
  @ApiBody({ type: CreateRentalDto })
  @JsonSuccessResponse(
    '75235942931818389349543',
    201,
    'Rental successfully created',
  )
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
    @Body() createRentalDto: CreateRentalDto,
  ): Promise<WebResponse<string>> {
    const data = await this.rentalService.create(createRentalDto);
    return webResponse(201, 'Rental successfully created', data);
  }

  @Post('pay')
  @Roles(Role.ADMIN, Role.RENTER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pay rental' })
  @ApiBody({ type: CreateProcessPayDto })
  @JsonSuccessResponse(BankTransferResponseDto, 201, 'Pay successfully')
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async pay(
    @Body() createProcessPayDto: CreateProcessPayDto,
  ): Promise<WebResponse<BankTransferResponseDto>> {
    const data = await this.rentalService.processPayment(createProcessPayDto);
    return webResponse(200, 'Payment successfully', data);
  }

  @Post('pay/cash')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment Cash rental' })
  @ApiBody({ type: CreatePaymentCashDto })
  @JsonSuccessResponse(PaymentCashResponseDto, 201, 'Payment cash successfully')
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async payCash(
    @Body() createPaymentCashDto: CreatePaymentCashDto,
  ): Promise<WebResponse<PaymentCashResponseDto>> {
    const data =
      await this.rentalService.processCashPayment(createPaymentCashDto);
    return webResponse(200, 'Payment cash successfully', data);
  }

  @Post('late-fee/payment')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pay late fee for a rental' })
  @ApiBody({ type: PayLateFeeDto })
  @JsonSuccessResponse(null, 200, 'Late fee paid successfully')
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async payLateFee(@Body() dto: PayLateFeeDto): Promise<WebResponse<void>> {
    await this.rentalService.processPayLateFee(dto);
    return webResponse(200, 'Late fee paid successfully');
  }

  @Get('overdue')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All Over Due Rental' })
  @JsonPagingResponse(RentalResponseDto, 200, 'Success', true)
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findOverdueRentals(
    @Query() filter: FilterGenre,
  ): Promise<WebResponse<RentalResponseDto[]>> {
    const { data, paging } =
      await this.rentalService.findOverdueRentals(filter);
    return webResponse(200, 'Success', data, paging);
  }

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All rental' })
  @JsonPagingResponse(RentalResponseDto, 200, 'Success', true)
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
  ): Promise<WebResponse<RentalResponseDto[]>> {
    const { data, paging } = await this.rentalService.findAll(filter);
    return webResponse(200, 'Success', data, paging);
  }

  @Get('history')
  @Roles(Role.RENTER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get History rental user' })
  @JsonPagingResponse(RentalResponseDto, 200, 'Success', true)
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAllHistory(
    @CurrentUser() user: ICurrentUser,
    @Query() filter: FilterGenre,
  ): Promise<WebResponse<RentalResponseDto[]>> {
    const { data, paging } = await this.rentalService.findAllHistory(
      filter,
      user.id,
    );
    return webResponse(200, 'Success', data, paging);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RENTER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First rental' })
  @JsonSuccessResponse(RentalResponseDto, 200, 'Success')
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
  ): Promise<WebResponse<RentalResponseDto>> {
    const data = await this.rentalService.findOne(id);
    return webResponse(200, 'Success', data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update status rental' })
  @ApiBody({ type: UpdateRentalDto })
  @JsonSuccessResponse(null, 200, 'Rental successfully updated')
  @JsonErrorResponse(404, 'Record Not Found')
  @JsonErrorResponse(401, 'Unauthorized')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async update(
    @Param('id') id: string,
    @Body() updateRentalDto: UpdateRentalDto,
  ): Promise<WebResponse<null>> {
    await this.rentalService.update(id, updateRentalDto);
    return webResponse(200, 'Rental successfully updated');
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete rental' })
  @JsonSuccessResponse(null, 200, 'Rental successfully deleted')
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
    await this.rentalService.remove(id);
    return webResponse(200, 'Rental successfully deleted');
  }
}
