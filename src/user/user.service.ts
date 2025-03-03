import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from '../common/util/crypto.util';
import { PagingResponse } from '../common/interface/web.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { FilterUser } from './dto/filter-user.dto';
import { paginate } from '../common/helper/paging.helper';
import { plainToInstance } from 'class-transformer';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.userRepo.save({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
      role: Role.ADMIN,
    });
  }

  async findAll(
    filter: FilterUser,
  ): Promise<{ data: UserResponseDto[]; paging: PagingResponse }> {
    const queryBuilder = this.userRepo.createQueryBuilder('user');

    if (filter.name) {
      queryBuilder.andWhere('user.name LIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.email) {
      queryBuilder.andWhere('user.email = :email', { email: filter.email });
    }

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere(
        'user.created_at BETWEEN :start_date AND :end_date',
        {
          start_date: filter.start_date,
          end_date: filter.end_date,
        },
      );
    }

    const page = filter.page;
    const limit = filter.limit;

    const { data, paging } = await paginate(queryBuilder, { page, limit });

    return {
      data: plainToInstance(UserResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      paging,
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const data = await this.userRepo.findOne({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string): Promise<User> {
    return this.userRepo.findOne({ where: { id: id } });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await hashPassword(refreshToken);
    await this.userRepo.update(userId, { refreshToken: hashedToken });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshToken: null });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const existingUser = await this.userRepo.findOne({ where: { id: id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    Object.assign(existingUser, updateUserDto);

    if (
      updateUserDto.password &&
      updateUserDto.password !== existingUser.password
    ) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    } else {
      updateUserDto.password = existingUser.password;
    }

    Object.assign(existingUser, updateUserDto);

    await this.userRepo.save(existingUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }
}
