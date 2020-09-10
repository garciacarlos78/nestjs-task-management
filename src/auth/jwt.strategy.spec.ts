import { Test } from "@nestjs/testing";
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';

// create a UserRepository factory. We just need to mock the findOne method
const mockUserRepository = () => ({
    findOne: jest.fn()
});

describe('JwtStrategy test suites', () => {
    let userRepository;
    let jwtStrategy;

    beforeEach( async () => {
        // get the user repository from the factory
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {provide: UserRepository, useFactory: mockUserRepository}]
        }).compile();

        // get the JwtStrategy
        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        // assign a mocked UserRepository before each test
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe('validate tests', () => {

        // we need a mocked payload with a username property
        const payload = {username:'username'};

        // happy path test, user valid
        it('success in user validation', async () => {
            // mock userRepository.findOne to resolve to true (that it, a user is returned)
            const user = new User();
            user.username = 'test username';
            userRepository.findOne.mockResolvedValue(user);

            // expect userRepository.findOne not to've been called
            expect(userRepository.findOne).not.toHaveBeenCalled();
            // call JwtStrategy.validate with mocked payload
            const result = await jwtStrategy.validate(payload);
            // expect userRepository.findOne have been called with proper parameters
            expect(userRepository.findOne).toHaveBeenCalledWith({ username: payload.username });
            // expect to return gotten used from user repository
            expect(result).toEqual(user);
        });

        // unhappy path test, invalid user
        it('fails in user validation', () => {
            // mock userRepository.findOne to resolve to null
            userRepository.findOne.mockResolvedValue(null);

            // call JwtStrategy.validate with mocked payload
            const result = jwtStrategy.validate(payload);
            // expect result to resolve to UnauthorizedException("Bad request")
            expect(result).rejects.toThrow(UnauthorizedException);
        });
    });
});