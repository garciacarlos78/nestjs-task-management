import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    DUPLICATE_USER = '23505';

    async signUp(authCredentialsDto:AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password,user.salt);

        try {
           await user.save();
        } catch (err) {
            if (err.code === this.DUPLICATE_USER ) {
                throw new ConflictException('username already exists');
            } else {
                console.log('New user creation error', err);                
                throw new InternalServerErrorException();
            }            
        }
    }

    private async hashPassword(password:string, salt:string): Promise<string> {
        return bcrypt.hash(password,salt);
    }
}