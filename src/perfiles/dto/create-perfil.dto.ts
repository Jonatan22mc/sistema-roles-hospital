import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePerfilDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'UUID del usuario al que pertenece el perfil',
  })
  @IsUUID('all', { message: 'El usuarioId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El usuarioId es obligatorio' })
  usuarioId!: string;

  @ApiProperty({
    example: 'Carlos Andrés',
    description: 'Nombres del usuario',
  })
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  nombres!: string;

  @ApiProperty({
    example: 'Pérez Gómez',
    description: 'Apellidos del usuario',
  })
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  apellidos!: string;

  @ApiPropertyOptional({
    example: '+573001234567',
    description: 'Teléfono de contacto',
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  telefono?: string;

  @ApiProperty({
    example: '1020304050',
    description: 'Documento de identidad',
  })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  documento!: string;
}
