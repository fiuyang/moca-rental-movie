import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  ErrorResponseDto,
  PagingResponseDto,
  SuccessResponseDto,
} from '../dto/api-response.dto';

export const JsonSuccessResponse = (
  model?: any,
  statusCode?: number,
  message?: string,
) => {
  return applyDecorators(
    ...(model ? [ApiExtraModels(SuccessResponseDto, model)] : []),
    ApiResponse({
      status: statusCode,
      description: message,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              statusCode: { type: 'integer', example: statusCode },
              message: { type: 'string', example: message },
              data: model
                ? {
                    oneOf: [
                      { $ref: getSchemaPath(model) },
                      {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    ],
                  }
                : { type: 'null', example: null },
            },
          },
        ],
      },
    }),
  );
};

export const JsonErrorResponse = (statusCode?: number, message?: string) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      description: message,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ErrorResponseDto) },
          {
            properties: {
              statusCode: { type: 'integer', example: statusCode },
              error: { type: 'boolean', example: true },
              timestamp: {
                type: 'string',
                example: '2025-02-03T15:14:12.604Z',
              },
              path: { type: 'string', example: '/api/v1/users/9' },
              method: { type: 'string', example: 'Get' },
              message: { type: 'string', example: message },
              trace_id: {
                type: 'string',
                example: '9afc545f-eca0-4de5-98d0-c4bb1bd84587',
              },
            },
          },
        ],
      },
    }),
  );
};

export const JsonPagingResponse = <TModel extends Type<any>>(
  model?: TModel,
  statusCode?: number,
  message?: string,
  withPaging: boolean = false,
) => {
  return applyDecorators(
    ...(model ? [ApiExtraModels(PagingResponseDto, model)] : []),
    ApiResponse({
      status: statusCode,
      description: message,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PagingResponseDto) },
          {
            properties: {
              statusCode: { type: 'integer', example: statusCode ?? 200 },
              message: { type: 'string', example: message ?? 'Success' },
              data: model
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  }
                : { type: 'array', items: { type: 'null' }, example: [] },
              ...(withPaging && {
                paging: {
                  type: 'object',
                  properties: {
                    total_data: { type: 'integer', example: 100 },
                    total_page: { type: 'integer', example: 10 },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                  },
                },
              }),
            },
          },
        ],
      },
    }),
  );
};
