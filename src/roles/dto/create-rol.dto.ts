import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({
    example: 'ADMINISTRADOR',
    description: 'Nombre único del rol hospitalario',
  })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del rol es obligatorio' })
  nombre!: string;

  @ApiPropertyOptional({
    example: 'Control total de usuarios y módulos',
    description: 'Descripción de privilegios',
  })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  descripcion?: string;
}
