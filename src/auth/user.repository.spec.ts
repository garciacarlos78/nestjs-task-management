import { Test } from "@nestjs/testing";
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';

describe('UserRepository tests', () => {
    // initialize test module
    let userRepository;

    // mock credentials dto
    const mockCredentialsDto = { username: 'Test username', password: 'Test password' };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository]
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp tests', () => {
        // mock save and UserRepository.create methods before each individual test
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('successfully signs up', () => {
            // mock save to resolve, no matter to what
            save.mockResolvedValue(undefined);

            // expect it doesn't throw an exception when called
            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();

        });

        it('rejects due to duplicate username', async () => {
            // mock save to throw a 23505 error code
            save.mockRejectedValue({ code: '23505' });

            // expect repository to reject to ConflictException
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('rejects with internal server error', async () => {
            // mock save to throw error code different to 23505
            save.mockRejectedValue({ code: 'red' });

            // expect repository to reject to InternalServerError
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });
    })

    describe('validateUserPassword tests', () => {
        // mock user to mock validatePassword and mock findOne
        let user;
        beforeEach(() => {
            user = new User();
            user.validatePassword = jest.fn();
            userRepository.findOne = jest.fn();
        });

        // case 1: everything goes well
        it('receives a valid username and password', async () => {
            // mock findOne to resolve to a valid user
            userRepository.findOne.mockResolvedValue(user);
            // mock user to resolve validatePassword to true
            user.validatePassword.mockResolvedValue(true);

            // call validateUserPassword
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            
            // expect the result to be the same string as the mockCredentialsDto one
            expect(result).toEqual(mockCredentialsDto.username);
        })

        // case 2: invalid user
        it('receives an invalid username', async () => {
            // mock find one to resolve to null (user not found)
            userRepository.findOne.mockResolvedValue(null);

            // call validateUserPassword
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            // expect user.validatePassword not to be called
            expect(user.validatePassword).not.toHaveBeenCalled();
            // expect resolved value to be null
            expect(result).toBeNull();
        });

        // case 3: invalid password
        it('receives a non-matching password', async () => {
            // mock findOne to resolve to user
            userRepository.findOne.mockResolvedValue(user);
            // mock user.validatePassword to resolve to false
            user.validatePassword.mockResolvedValue(false);

            // call validateUserPassword
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            // expect user.validatePassword to have been called
            expect(user.validatePassword).toHaveBeenCalled();
            // expect resolved result to be null
            expect(result).toBeNull();
        });
    })
})