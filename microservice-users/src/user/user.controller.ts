import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserMSG } from 'src/common/constants';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMSG.CREATE)
  create(@Payload() userDTO: UserDTO) {
    return this.userService.create(userDTO);
  }

  @MessagePattern(UserMSG.FIND_ALL)
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern(UserMSG.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern(UserMSG.UPDATE)
  update(@Payload() payload: any) {
    return this.userService.update(payload.id, payload.userDTO);
  }

  @MessagePattern(UserMSG.DELETE)
  delete(@Payload() id: string) {
    return this.userService.delete(id);
  }
}
