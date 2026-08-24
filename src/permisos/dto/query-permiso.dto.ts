import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class QueryPermisoDto {
  @ApiPropertyOptional({
    example: 'EXPEDIENTES',
    description: 'Filtro por nombre del permiso',
  })
  @IsString({ message: 'El filtro de nombre debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nombre?: string;

  @ApiPropertyOptional({
    example: 'EXPEDIENTES',
    description: 'Filtro por módulo del permiso',
  })
  @IsString({ message: 'El filtro de módulo debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  modulo?: string;
}
