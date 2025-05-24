import { 
    Controller,
    Get,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    UseGuards,
    UnauthorizedException,
    BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { UserService } from "./user.service";
import { CreateUserDto, LoginUserDto } from "./dto/user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @UsePipes(new ValidationPipe())
    async findAll() {
        try {
            const result = await this.userService.findAll();
            return {
                status: result.status,
                message: result.message,
                data: result.users,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw new BadRequestException('Failed to fetch users');
        }
    }

    @Public()
    @Post('register')
    @UsePipes(new ValidationPipe())
    async onRegister(@Body() createUserDto: CreateUserDto) {
        try {
            const result = await this.userService.onRegister(createUserDto);
            return {
                status: result.status,
                message: result.message,
                data: result.user,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw new BadRequestException('Registration failed');
        }
    }

    @Public()
    @Post('login')
    @UsePipes(new ValidationPipe())
    async onLogin(@Body() loginUserDto: LoginUserDto) {
        try {
            const result = await this.userService.onLogin(loginUserDto);
            if (result.status === 'error') {
                throw new UnauthorizedException(result.message);
            }
            return {
                status: result.status,
                message: result.message,
                data: {
                    token: result.token
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw new UnauthorizedException('Login failed');
        }
    }
}