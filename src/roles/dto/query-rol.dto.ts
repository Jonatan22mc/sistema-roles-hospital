import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class QueryRolDto {
  @ApiPropertyOptional({
    example: 'ADMIN',
    description: 'Filtro de búsqueda por nombre del rol',
  })
  @IsString({ message: 'El filtro de nombre debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nombre?: string;
}
