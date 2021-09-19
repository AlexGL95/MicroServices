import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { flightMSG, passengerMSG } from 'src/common/constants';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { FlightDTO } from './dto/flight.dto';

@ApiTags('Flights')
@Controller('flight')
export class FlightController {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {}
  private _clientProxyFlights = this.clientProxy.clientProxyFlights();
  private _clientProxyPassengers = this.clientProxy.clientProxyPassengers();

  @Post()
  create(@Body() flightDTO: FlightDTO): Observable<IFlight> {
    return this._clientProxyFlights.send(flightMSG.CREATE, flightDTO);
  }

  @Get()
  findAll(): Observable<IFlight[]> {
    return this._clientProxyFlights.send(flightMSG.FIND_ALL, '');
  }

  @Get(':idFlight')
  finOne(@Param('idFlight') idFlight: string): Observable<IFlight> {
    return this._clientProxyFlights.send(flightMSG.FIND_ONE, idFlight);
  }

  @Put(':idFlight')
  update(
    @Param('idFlight') idFlight: string,
    @Body() flightDTO: FlightDTO,
  ): Observable<IFlight> {
    return this._clientProxyFlights.send(flightMSG.UPDATE, {
      idFlight,
      flightDTO,
    });
  }

  @Delete(':idFlight')
  delete(@Param('idFlight') idFlight: string): Observable<IFlight> {
    return this._clientProxyFlights.send(flightMSG.DELETE, idFlight);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ) {
    const PASSENGER = await this._clientProxyPassengers
      .send(passengerMSG.FIND_ONE, passengerId)
      .toPromise();
    if (!PASSENGER)
      throw new HttpException('Passenger Not Found', HttpStatus.NOT_FOUND);

    return this._clientProxyFlights.send(flightMSG.ADD_PASSENGER, {
      flightId,
      passengerId,
    });
  }
}
