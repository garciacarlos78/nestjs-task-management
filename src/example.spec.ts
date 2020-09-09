// feature
class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announcesFrienship(name);
    }

    announcesFrienship(name) {
        console.log(`${name} is now a friend.`);        
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);

        if (idx !== -1) this.friends.splice(idx, 1);
        else throw new Error(`Friend ${name} not found!`);
    }
}

// tests
describe('FriendsList', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });

    it('initializes friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });

    it('adds a friend to the list', () => {
        friendsList.addFriend('Peter');

        expect(friendsList.friends.length).toEqual(1);
    });

    it('announces new friendships', () => {
        friendsList.announcesFrienship = jest.fn();
        const friend = 'Peter';
        friendsList.addFriend(friend);

        expect(friendsList.announcesFrienship).toHaveBeenCalledWith(friend);
    });

    describe('Remove friend', () => {
        const friend = 'Peter';

        it('removes an existing friend', () => {
            friendsList.addFriend(friend);            
            expect(friendsList.friends[0]).toEqual(friend);
            friendsList.removeFriend(friend);
            expect(friendsList.friends[0]).toEqual(undefined);
        });

        it('tries to remove a non-existing friend', () => {
            expect(()=>friendsList.removeFriend(friend)).toThrow(new Error(`Friend ${friend} not found!`))
        });
    });
});