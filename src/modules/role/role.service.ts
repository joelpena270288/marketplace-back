import { Injectable, Inject } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ReadRolDto } from './dto/read-role-dto';
import { Role } from './entities/role.entity';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_createRoleDto: CreateRoleDto) {
    return `This create role`;
  }

  async findAll(): Promise<ReadRolDto[]> {
    const roles: Role[] = await this.roleRepository.find();
    return roles.map((rol: Role) => plainToClass(ReadRolDto, rol));
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
