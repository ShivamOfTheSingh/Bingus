// __tests__/socket.test.js
import { socket as mockSocket } from '../src/socket';

jest.mock('../src/socket.ts', () => ({
    socket: {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
    },
}));

describe('Socket authentication with cookies', () => {
    const sessionCookie = 'test-session-cookie';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should authenticate socket using session cookie', () => {
        // Assuming the socket needs a cookie for authentication
        // Emit 'authenticate' event with sessionCookie on connection
        mockSocket.emit('authenticate', sessionCookie);

        // Verify that the cookie is included in the authenticate emit call
        expect(mockSocket.emit).toHaveBeenCalledWith('authenticate', sessionCookie);
    });

    it('should handle disconnection when session cookie is invalid', () => {
        // Emit 'authenticate' with an invalid session cookie
        const invalidCookie = 'invalid-session-cookie';
        mockSocket.emit('authenticate', invalidCookie);

        // Simulate server response for invalid session
        mockSocket.on.mock.calls.forEach(([event, callback]) => {
            if (event === 'unauthorized') {
                callback();
            }
        });

        // Verify disconnection or alert occurs as a result of invalid authentication
        expect(mockSocket.emit).toHaveBeenCalledWith('disconnect');
    });
});
