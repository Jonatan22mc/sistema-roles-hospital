import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermisoDto {
  @ApiProperty({
    example: 'EXPEDIENTES_CREAR',
    description: 'Nombre único del permiso',
  })
  @IsString({ message: 'El nombre del permiso debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del permiso es obligatorio' })
  nombre!: string;

  @ApiPropertyOptional({
    example: 'Permite registrar nuevos expedientes clínicos',
    description: 'Descripción de la acción permitida',
  })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    example: 'EXPEDIENTES',
    description: 'Módulo del sistema al que pertenece el permiso',
  })
  @IsString({ message: 'El módulo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El módulo es obligatorio' })
  modulo!: string;
}
