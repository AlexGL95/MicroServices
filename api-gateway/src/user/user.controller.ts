import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { UserMSG } from 'src/common/constants';
import { IUser } from 'src/common/interfaces/user.interface';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { UserDTO } from './dto/user.dto';

@ApiTags('Users')
@Controller('api/v2/user')
export class UserController {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {}
  private _clientProxyUser = this.clientProxy.clientProxyUsers();

  @Post()
  create(@Body() userDTO: UserDTO): Observable<IUser> {
    return this._clientProxyUser.send(UserMSG.CREATE, userDTO);
  }

  @Get()
  findAll(): Observable<IUser[]> {
    return this._clientProxyUser.send(UserMSG.FIND_ALL, '');
  }

  @Get(':idUser')
  finOne(@Param('idUser') idUser: string): Observable<IUser> {
    return this._clientProxyUser.send(UserMSG.FIND_ONE, idUser);
  }

  @Put(':idUser')
  update(
    @Param('idUser') idUser: string,
    @Body() userDTO: UserDTO,
  ): Observable<IUser> {
    return this._clientProxyUser.send(UserMSG.UPDATE, { idUser, userDTO });
  }

  @Delete(':idUser')
  delete(@Param('idUser') idUser: string): Observable<IUser> {
    return this._clientProxyUser.send(UserMSG.DELETE, idUser);
  }
}
