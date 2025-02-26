import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ default: 200 })
  statusCode?: number;

  @ApiProperty()
  message?: string;

  data: T | T[];
}

export class SuccessResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ nullable: true })
  data: T | null;
}

export class PagingResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ nullable: true })
  data: T | null;

  @ApiProperty({ required: false, nullable: true })
  paging?: {
    total_data: number;
    total_page: number;
    page: number;
    limit: number;
  };
}

export class ErrorResponseDto {
  @ApiProperty({ example: true })
  error: boolean;

  @ApiProperty({ example: '2025-02-03T15:14:12.604Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/v1/users/9' })
  path: string;

  @ApiProperty({ example: 'GET' })
  method: string;

  @ApiProperty({ example: '9afc545f-eca0-4de5-98d0-c4bb1bd84587' })
  trace_id: string;
}

export class JsonBadRequestDto {
  @ApiProperty({ type: 'integer', example: 400 })
  statusCode: number;

  @ApiProperty({ type: 'string', example: 'Bad Request' })
  error: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    required: false,
    example: ['email member@gmail.com already exists'],
  })
  message: string[];
}