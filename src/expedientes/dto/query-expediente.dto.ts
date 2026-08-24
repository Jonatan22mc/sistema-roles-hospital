import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryExpedienteDto {
  @ApiPropertyOptional({
    example: '72819283',
    description: 'Filtro por documento de identidad del paciente',
  })
  @IsString({ message: 'El filtro de documento debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  pacienteDocumento?: string;

  @ApiPropertyOptional({
    example: 'Carlos',
    description: 'Filtro por nombre del paciente atendido',
  })
  @IsString({ message: 'El filtro de nombre debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  pacienteNombre?: string;

  @ApiPropertyOptional({
    example: 'b1a2c3d4-0000-0000-0000-000000000000',
    description: 'Filtro por UUID del médico tratante',
  })
  @IsUUID('all', { message: 'El filtro de medicoId debe ser un UUID válido' })
  @IsOptional()
  medicoId?: string;
}
