import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryUsuarioDto {
  @ApiPropertyOptional({
    example: 'medico@hospital.com',
    description: 'Filtro por correo electrónico del usuario',
  })
  @IsString({ message: 'El filtro de correo debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email?: string;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Filtro por UUID del rol asignado',
  })
  @IsUUID('all', { message: 'El filtro de rolId debe ser un UUID válido' })
  @IsOptional()
  rolId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtro por estado activo del usuario',
  })
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  activo?: boolean;
}
