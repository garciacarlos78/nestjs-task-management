import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UserEntity tests', () => {

    let user: User;

    beforeEach(async () => {
        // mock user 
        user = new User();
        user.password = 'user test password';
        user.salt = 'user test salt';
        // mock hash method of bcrypt
        bcrypt.hash = jest.fn();
    });

    describe('validatePassword test', () => {

        // test for a correct password
        it('returns true when called with valid password', async () => {
            // mock hash resolved value to user's password
            bcrypt.hash.mockResolvedValue(user.password);
            // ensure bcrypt.hash has not been called before
            expect(bcrypt.hash).not.toHaveBeenCalled();            
            // call method
            const callingPassword = 'no matters which password, we are mocking the result';
            const result = await user.validatePassword(callingPassword);
            // expect bcrypt.hash been called with expected parameters
            expect(bcrypt.hash).toHaveBeenCalledWith(callingPassword, user.salt);
            // expect result resolves to true
            expect(result).toEqual(true);
        });

        // test for a wrong password
        it('resolves to false when called with a wrong password', async () => {
            // mock hash resolved value different to user's mocked password
            bcrypt.hash.mockResolvedValue('wrong password');
            // make sure the mocked hash result is different from user's mocked password
            expect(await bcrypt.hash()).not.toEqual(user.password);
            // reset mock values
            bcrypt.hash.mockClear();

            // call validatePassword
            const callingPassword = 'password';
            const result = await user.validatePassword(callingPassword);
            // expect bcrypt.hash to have been called with expected params
            expect(bcrypt.hash).toHaveBeenCalledWith(callingPassword, user.salt);
            // expect validatePassword result to be false
            expect(result).toEqual(false);
        });
    });
});