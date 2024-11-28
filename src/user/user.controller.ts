import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerCreateUser } from 'src/swagger/user.swagger';

@ApiTags('User - 유저')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SwaggerCreateUser()
  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
