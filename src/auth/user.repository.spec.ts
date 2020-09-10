import { Test } from "@nestjs/testing";
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

describe ('UserRepository tests', () => {
    // initialize test module
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository]
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe ('signUp tests', () => {
        // mock credentials dto
        const mockCredentialsDto = {username:'Test username', password:'Test password'};

        // mock save and UserRepository.create methods before each individual test
        let save;

        beforeEach(()=>{
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({save});
        });

        it('successfully signs up', () =>{
            // mock save to resolve, no matter to what
            save.mockResolvedValue(undefined);

            // expect it doesn't throw an exception when called
            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();

        });

        it('rejects due to duplicate username', async () =>{
            // mock save to throw a 23505 error code
            save.mockRejectedValue({code: '23505'});

            // expect repository to reject to ConflictException
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('rejects with internal server error', async () => {
            // mock save to throw error code different to 23505
            save.mockRejectedValue({code:'red'});

            // expect repository to reject to InternalServerError
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });
    })
})