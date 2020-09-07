import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'dist/auth/dto/jws-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'BadSecret' // from auth.module.ts            
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        
        const { username } = payload;

        const user = await this.userRepository.findOne({username});

        if (!user) {
            throw new UnauthorizedException("Bad request");
        }

        return user;
    }

}