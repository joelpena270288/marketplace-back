import {
  ConflictException,
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';

import * as bcrypt from 'bcryptjs';
import { UserDetails } from './user.details.entity';
import { plainToClass } from 'class-transformer';
import { ReadUserDto } from './dto/read-user.dto';

import { Status } from '../../EntityStatus/entity.estatus.enum';
import { RoleEnum } from '../role/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const { username, password, name, lastname, email } = createUserDto;

    const rolesfound: Role[] = [];
    const userExists = await this.userRepository.findOne({
      where: { username: username, status: Status.ACTIVO },
    });
    const emailExist = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.details', 'detail')
      .where('detail.email=:email', {
        email: email,
      })
      .getOne();
    if (userExists || emailExist) {
      throw new ConflictException('username or email already exists');
    }

    const foundRole = await this.roleRepository.findOne({
      where: { name: RoleEnum.ESTANDAR },
    });

    const user = new User();
    if (foundRole) {
      rolesfound.push(foundRole);
    }
    user.username = username.toLowerCase();

    const detail = new UserDetails();
    detail.name = name;
    detail.lastname = lastname;
    detail.email = email;
    user.roles = rolesfound;
    user.details = detail;
    user.status = Status.ACTIVO;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const result: User = await this.userRepository.save(user);

    return plainToClass(ReadUserDto, result);
  }

  async findAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this.userRepository.find();

    return users.map((user: User) => plainToClass(ReadUserDto, user));
  }

  async findOne(username: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });
    if (!foundUser) {
      throw new NotFoundException('No existe el usuario');
    } else {
      return  foundUser ;
    }
  }
  async findOneByUsername(username: string): Promise<ReadUserDto> {
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });
    if (!foundUser) {
      throw new NotFoundException('No existe el usuario');
    } else {
      return plainToClass(ReadUserDto, foundUser) ;
    }
  }

  async remove(id: string): Promise<ReadUserDto> {
    const userExists = await this.userRepository.findOne({
      where: { id: id, status: Status.ACTIVO },
    });
    if (!userExists) {
      throw new ConflictException('el usuario no existe');
    }
    userExists.status = Status.INACTIVO;
    await this.userRepository.save(userExists);
    return plainToClass(ReadUserDto, userExists);
  }
  async checkUserExists(username: string, email: string): Promise<boolean> {
    const userExists = await this.userRepository.findOne({
      where: { username: username.toLowerCase(), status: Status.ACTIVO },
    });

    const emailExist = await this.userRepository.findOne({
      relations: ['details'],
      where: { details: { email } },
    });

    if (userExists || emailExist) {
      throw new ConflictException(
        'El nombre de usuario o el correo ya existen',
      );
    }

    return false;
  }
}
