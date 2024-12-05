// __tests__/Inbox.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Inbox from 'src/components/InboxComponents/Inbox.tsx';
import { socket as mockSocket } from '../src/socket';

jest.mock('../src/socket.ts', () => ({
    socket: {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
    },
}));

// Mock window.alert to avoid 'not implemented' error in JSDOM
global.alert = jest.fn();

describe('Inbox component', () => {
    const session = 'test-session';
    const userId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should authenticate the socket with the session on mount', () => {
        render(<Inbox session={session} userId={userId} />);
        expect(mockSocket.emit).toHaveBeenCalledWith('authenticate', session);
    });

    it('should not send a message if the input message length is 0', () => {
        render(<Inbox session={session} userId={userId} />);
        const inputElement = screen.getByPlaceholderText('Type a message');
        const sendButton = screen.getByText('Send');
        fireEvent.change(inputElement, { target: { value: '' } });
        fireEvent.click(sendButton);
        expect(global.alert).toHaveBeenCalledWith("Message cannot be empty");
        expect(mockSocket.emit).not.toHaveBeenCalledWith('message', expect.any(String));
    });

    it('should send a message if the input message length is 10', () => {
        render(<Inbox session={session} userId={userId} />);
        const inputElement = screen.getByPlaceholderText('Type a message');
        const sendButton = screen.getByText('Send');
        const message = 'helloworld';
        fireEvent.change(inputElement, { target: { value: message } });
        fireEvent.click(sendButton);
        expect(mockSocket.emit).toHaveBeenCalledWith('message', expect.stringContaining(`"messageText":"${message}"`));
    });

    it('should send a message if the input message length is 99', () => {
        render(<Inbox session={session} userId={userId} />);
        const inputElement = screen.getByPlaceholderText('Type a message');
        const sendButton = screen.getByText('Send');
        const message = 'a'.repeat(99);
        fireEvent.change(inputElement, { target: { value: message } });
        fireEvent.click(sendButton);
        expect(mockSocket.emit).toHaveBeenCalledWith('message', expect.stringContaining(`"messageText":"${message}"`));
    });

    it('should send a message if the input message length is 100', () => {
        render(<Inbox session={session} userId={userId} />);
        const inputElement = screen.getByPlaceholderText('Type a message');
        const sendButton = screen.getByText('Send');
        const message = 'a'.repeat(100);
        fireEvent.change(inputElement, { target: { value: message } });
        fireEvent.click(sendButton);
        expect(mockSocket.emit).toHaveBeenCalledWith('message', expect.stringContaining(`"messageText":"${message}"`));
    });

    it('should send a message if the input message length is 101', () => {
        render(<Inbox session={session} userId={userId} />);
        const inputElement = screen.getByPlaceholderText('Type a message');
        const sendButton = screen.getByText('Send');
        const message = 'a'.repeat(101);
        fireEvent.change(inputElement, { target: { value: message } });
        fireEvent.click(sendButton);
        expect(mockSocket.emit).toHaveBeenCalledWith('message', expect.stringContaining(`"messageText":"${message}"`));
    });

    it('should send a message if the input message length is 10000', () => {
        render(<Inbox session={session} userId={userId} />);
        const inputElement = screen.getByPlaceholderText('Type a message');
        const sendButton = screen.getByText('Send');
        const longMessage = 'a'.repeat(10000);
        fireEvent.change(inputElement, { target: { value: longMessage } });
        fireEvent.click(sendButton);
        expect(mockSocket.emit).toHaveBeenCalledWith('message', expect.stringContaining(`"messageText":"${longMessage.substring(0, 20)}"`));
    });

    it('should broadcast the sent message back to the client', () => {
        render(<Inbox session={session} userId={userId} />);
        const inputElement = screen.getByPlaceholderText('Type a message');
        const sendButton = screen.getByText('Send');
        const message = 'broadcastTest';
        fireEvent.change(inputElement, { target: { value: message } });
        fireEvent.click(sendButton);
        const expectedBroadcastMessage = { messageText: message, messageTime: expect.any(String), userId: userId };
        mockSocket.on.mock.calls.forEach(([event, callback]) => {
            if (event === 'message') {
                callback(JSON.stringify(expectedBroadcastMessage));
            }
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });
});
