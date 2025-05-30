import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Check if user exists
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        })

        if (existingUser) {
            throw new ConflictException('Email already exists')
        }

        // Hash password
        const hashedPassword = await this.hashPassword(createUserDto.password)

        // Create new user
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        })

        return this.userRepository.save(user)
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }

        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } })
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        // Check if user exists
        const user = await this.findOne(id)

        // If changing password, hash it
        if (updateUserDto.password) {
            updateUserDto.password = await this.hashPassword(updateUserDto.password)
        }

        // Update user
        Object.assign(user, updateUserDto)
        return this.userRepository.save(user)
    }

    async remove(id: number): Promise<void> {
        const result = await this.userRepository.delete(id)

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`)
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10
        return bcrypt.hash(password, saltRounds)
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email)

        if (!user) {
            return null
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return null
        }

        return user
    }
}
