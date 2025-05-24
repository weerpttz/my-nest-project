import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from "./dto/user.dto";
import { hash, verify } from "@node-rs/bcrypt";
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        try {
            const users = await this.prisma.user.findMany();
            return {
                status: 'success',
                message: 'Users retrieved successfully',
                users: users.map(user => ({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }))
            };
        } catch (error) {
            throw new Error('Failed to fetch users');
        }
    }

    async onRegister(createUserDto: CreateUserDto) {
        try {
            const { email, firstName, lastName, password } = createUserDto;
            const hashedPassword = await hash(password.normalize("NFKC"), 10);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    password: hashedPassword
                }
            });
            return {
                status: 'success',
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            };
        } catch (error) {
            throw new Error('Registration failed');
        }
    }

    async onLogin(loginUserDto: LoginUserDto) {
        try {
            const { email, password } = loginUserDto;
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            
            if (!user) {
                return { status: 'error', message: 'E-mail or Password is incorrect' };
            }

            const isPasswordMatch = await verify(password.normalize("NFKC"), user.password);
            if (!isPasswordMatch) {
                return { status: 'error', message: 'E-mail or Password is incorrect' };
            }

            const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 't$Weep@Pim2882', { algorithm: 'HS256' });
            return { status: 'success', message: 'Login successfully', token };
        } catch (error) {
            throw new Error('Login failed');
        }
    }
}