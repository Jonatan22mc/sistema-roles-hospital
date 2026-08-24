import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateExpedienteDto {
  @ApiProperty({
    example: 'Carlos Ruiz',
    description: 'Nombre completo del paciente atendido',
  })
  @IsString({ message: 'El nombre del paciente debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del paciente es obligatorio' })
  pacienteNombre!: string;

  @ApiProperty({
    example: '72819283',
    description: 'DNI o documento de identidad del paciente',
  })
  @IsString({ message: 'El documento debe ser texto' })
  @IsNotEmpty({ message: 'El documento de identidad es obligatorio' })
  pacienteDocumento!: string;

  @ApiProperty({
    example: 'b1a2c3d4-0000-0000-0000-000000000000',
    description: 'ID del médico tratante (FK a usuarios)',
  })
  @IsUUID('all', { message: 'El medicoId debe ser un identificador UUID válido' })
  @IsNotEmpty({ message: 'El medicoId es obligatorio' })
  medicoId!: string;

  @ApiProperty({
    example: 'Faringitis aguda bacteriana',
    description: 'Diagnóstico clínico emitido',
  })
  @IsString({ message: 'El diagnóstico debe ser texto' })
  @IsNotEmpty({ message: 'El diagnóstico es obligatorio' })
  diagnostico!: string;

  @ApiProperty({
    example: 'Amoxicilina 500mg cada 8 horas por 7 días',
    description: 'Plan de tratamiento y recetas',
  })
  @IsString({ message: 'El tratamiento debe ser texto' })
  @IsNotEmpty({ message: 'El tratamiento es obligatorio' })
  tratamiento!: string;
}
