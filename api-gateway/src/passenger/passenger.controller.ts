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
import { passengerMSG } from 'src/common/constants';
import { IPassenger } from 'src/common/interfaces/passenger.interface';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { PassengerDTO } from './dto/passenger.dto';

@ApiTags('Passengers')
@Controller('api/v2/passenger')
export class PassengerController {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {}
  private _clientProxyPassengers = this.clientProxy.clientProxyPassengers();

  async onApplicationBootstrap() {
    await this._clientProxyPassengers.connect();
  }

  @Post()
  create(@Body() passengerDTO: PassengerDTO): Observable<IPassenger> {
    return this._clientProxyPassengers.send(passengerMSG.CREATE, passengerDTO);
  }

  @Get()
  findAll(): Observable<IPassenger[]> {
    return this._clientProxyPassengers.send(passengerMSG.FIND_ALL, '');
  }

  @Get(':idPassenger')
  finOne(@Param('idPassenger') idPassenger: string): Observable<IPassenger> {
    return this._clientProxyPassengers.send(passengerMSG.FIND_ONE, idPassenger);
  }

  @Put(':idPassenger')
  update(
    @Param('idPassenger') idPassenger: string,
    @Body() passengerDTO: PassengerDTO,
  ): Observable<IPassenger> {
    return this._clientProxyPassengers.send(passengerMSG.UPDATE, {
      idPassenger,
      passengerDTO,
    });
  }

  @Delete(':idPassenger')
  delete(@Param('idPassenger') idPassenger: string): Observable<IPassenger> {
    return this._clientProxyPassengers.send(passengerMSG.DELETE, idPassenger);
  }
}
