import readFile from '@/lib/utils/readFile'; // Adjust to the correct path

describe('readFile function', () => {
  let mockFileReader: any;

  beforeEach(() => {
    // Mock the FileReader API with static properties
    mockFileReader = jest.fn().mockImplementation(function (this: FileReader) {
      // These will be set directly in each test
      this.onloadend = null;
      this.onerror = null;
      this.readAsDataURL = jest.fn();
    });

    // Add static properties to the mock FileReader class
    mockFileReader.EMPTY = 0;
    mockFileReader.LOADING = 1;
    mockFileReader.DONE = 2;

    // Replace the global `FileReader` with the mocked version
    global.FileReader = mockFileReader;
  });

  afterEach(() => {
    // Restore the original FileReader to avoid affecting other tests
    jest.restoreAllMocks();
  });

  it('should call the callback with the base64 string after reading the file', () => {
    // Create a mock File object (simple text file)
    const file = new File(['Hello, world!'], 'hello.txt', { type: 'text/plain' });

    // Mock callback function
    const mockCallback = jest.fn();

    // Call the readFile function with the file and callback
    readFile(file, mockCallback);

    // Ensure that readAsDataURL was called with the file
    expect(mockFileReader.mock.instances[0].readAsDataURL).toHaveBeenCalledWith(file);

    // Simulate the `onloadend` event being triggered after the file is read successfully
    const base64String = 'data:text/plain;base64,aGVsbG8sd29ybGQh';
    mockFileReader.mock.instances[0].onloadend && mockFileReader.mock.instances[0].onloadend({
      target: { result: base64String },
    });

    // Assertions
    expect(mockCallback).toHaveBeenCalledWith(base64String); // Ensure the callback is called with the correct base64 string
  });

  it('should not call callback if FileReader fails to read the file (simulate error)', () => {
    // Create a mock File object
    const file = new File(['Invalid file'], 'invalid.txt', { type: 'text/plain' });

    // Mock callback function
    const mockCallback = jest.fn();

    // Call the readFile function with the file and callback
    readFile(file, mockCallback);

    // Simulate the `onerror` event being triggered after an error in reading
    const errorEvent = new Event('error');
    mockFileReader.mock.instances[0].onerror && mockFileReader.mock.instances[0].onerror(errorEvent);

    // Assertions: The callback should not have been called if there was an error
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
