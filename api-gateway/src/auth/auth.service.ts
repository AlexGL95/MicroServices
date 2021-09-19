import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserMSG } from 'src/common/constants';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { UserDTO } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
    private readonly jwtService: JwtService,
  ) {}
  private _clientUser = this.clientProxy.clientProxyUsers();
  async onApplicationBootstrap() {
    await this._clientUser.connect();
  }
  async validateUser(username: string, password: string): Promise<any> {
    return await this._clientUser
      .send(UserMSG.VALID_USER, {
        username,
        password,
      })
      .toPromise();
  }

  async signIn(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(userDTO: UserDTO) {
    return this._clientUser.send(UserMSG.CREATE, userDTO).toPromise();
  }
}
