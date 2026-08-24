import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PerfilesModule } from './perfiles/perfiles.module';
import { ExpedientesModule } from './expedientes/expedientes.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';

@Module({
  imports: [RolesModule, PermisosModule, UsuariosModule, PerfilesModule, ExpedientesModule, AutenticacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
