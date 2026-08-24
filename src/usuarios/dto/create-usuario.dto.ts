import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'medico@hospital.com',
    description: 'Correo electrónico institucional del usuario',
  })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email!: string;

  @ApiProperty({
    example: 'ClaveSegura123!',
    description: 'Contraseña segura de acceso',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'UUID del rol asignado al usuario',
  })
  @IsUUID('all', { message: 'El rolId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El rolId es obligatorio' })
  rolId!: string;
}
