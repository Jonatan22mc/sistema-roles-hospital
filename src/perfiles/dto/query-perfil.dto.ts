import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class QueryPerfilDto {
  @ApiPropertyOptional({
    example: 'Carlos',
    description: 'Filtro por nombres del usuario',
  })
  @IsString({ message: 'El filtro de nombres debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nombres?: string;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Filtro por apellidos del usuario',
  })
  @IsString({ message: 'El filtro de apellidos debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  apellidos?: string;

  @ApiPropertyOptional({
    example: '1020304050',
    description: 'Filtro por documento de identidad',
  })
  @IsString({ message: 'El filtro de documento debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  documento?: string;
}
