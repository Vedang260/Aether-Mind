import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<{ success: boolean; message: string; users?: User[] | null }> {
    try{
      const users = await this.usersRepository.findAll();
      return {
        success: true,
        message: 'All users are retrieved successfully',
        users: users
      }
    }catch(error){
      console.error('Error in fetching all the users: ', error.message);
      return {
        success: false,
        message: 'Internal Server Error'
      }
    }
    
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findUserByEmail(email);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async removeUser(id: string): Promise<{ success: boolean, message: string}> {
    try{
      const result = await this.usersRepository.deleteUser(id);
    
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return{
      success: true,
      message: 'User is deleted'
    }
    }catch(error){
       console.error('Error in deleting the user');
       return{
        success: false,
        message: 'User is deleted successfully'
       }
    }
  }
} 