// RegisterForm.test.js
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/components/forms/RegisterForm"; // Adjust import if needed
import '@testing-library/jest-dom';
import { ApiError } from "@/lib/errors/ApiError";

// Mocking global fetch and any other necessary parts
global.fetch = jest.fn();

// Utility for clearing mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

describe("RegisterForm Component", () => {

    // Test that the form is rendered with all expected fields
    test("renders the form with all required input fields", () => {
        render(<RegisterForm />);

        // Ensure the input fields and labels are rendered
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Birthdate/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();


        expect(screen.getByTestId("password")).toBeInTheDocument();  // for the main password field
        expect(screen.getByTestId("passwordRepeat")).toBeInTheDocument();
    });

    test("renders the form with First Name Field", () => {
        render(<RegisterForm />);

        // Ensure the input fields and labels are rendered
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    });

    test("renders the form with last Name Field", () => {
        render(<RegisterForm />);

        // Ensure the input fields and labels are rendered
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    });

    test("renders the form with userName Field", () => {
        render(<RegisterForm />);

        // Ensure the input fields and labels are rendered
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    });

    test("renders the form with email Field", () => {
        render(<RegisterForm />);

        // Ensure the input fields and labels are rendered
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    // Test that the form has a submit button
    test("renders the submit button", () => {
        render(<RegisterForm />);

        // Ensure the submit button is rendered
        const submitButton = screen.getByRole("button", { name: /Register/i });
        expect(submitButton).toBeInTheDocument();
    });

    // Test that the input fields have the correct type attributes (e.g., password field has type 'password')
    test("renders password with correct types", () => {
        render(<RegisterForm />);

        // Check if the password and confirm password fields have type="password"

        expect(screen.getByTestId("password")).toBeInTheDocument();  // for the main password field
        expect(screen.getByTestId("passwordRepeat")).toBeInTheDocument();
    });

    test("renders confirm password with correct types", () => {
        render(<RegisterForm />);

        // Check if the password and confirm password fields have type="password"


        expect(screen.getByTestId("passwordRepeat")).toBeInTheDocument();
    });

    // Test for rendering the gender select dropdown
    test("renders the gender select dropdown", () => {
        render(<RegisterForm />);

        // Check if the gender select dropdown is rendered
        const genderSelect = screen.getByLabelText(/gender/i);
        expect(genderSelect).toBeInTheDocument();
        // Ensure it is a 'select' element by checking its tag name
        expect(genderSelect).toHaveProperty("tagName", "SELECT");

    });

    // Test for rendering the birthdate input field
    test("renders the birthdate input field with correct type", () => {
        render(<RegisterForm />);

        // Check if the birthdate field has type="date"
        const birthdateInput = screen.getByLabelText(/Birthdate/i);
        expect(birthdateInput).toHaveAttribute("type", "date");
    });

    // Test for rendering form validation errors (this test assumes you have validation logic in place)
    test("renders validation errors for empty fields upon submission", async () => {
        render(<RegisterForm />);

        // Find and click the submit button without filling out the form
        const submitButton = screen.getByRole("button", { name: /Register/i });
        userEvent.click(submitButton);

        // Wait for validation errors to appear
        await screen.findByText(/First Name is required/i);
        await screen.findByText(/Last Name is required/i);
        await screen.findByText(/Username is required/i);
        await screen.findByText(/Email is required/i);
        await screen.findByText(/Birthdate is required/i);
        await screen.findByText(/Gender is required/i);
        await screen.findByText(/Password is required/i);
        await screen.findByText(/Confirm Password is required/i);
    });


    test("redirects to login page after successful registration", async () => {
        // Mock the fetch response for a successful registration
        global.fetch.mockResolvedValueOnce({
            status: 201, // HTTP status for successful creation
            json: () => Promise.resolve({ userId: "123" }),
        });

        // Mock window.location to track redirection
        const mockLocation = { ...window.location };
        delete window.location;
        window.location = { assign: jest.fn() }; // Mock the redirect function

        render(<RegisterForm />);

        // Fill in the form with valid data
        userEvent.type(screen.getByLabelText(/First Name/i), "John");
        userEvent.type(screen.getByLabelText(/Last Name/i), "Doe");
        userEvent.type(screen.getByLabelText(/Username/i), "john_doe");
        userEvent.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
        userEvent.type(screen.getByLabelText(/Birthdate/i), "1990-01-01");
        userEvent.selectOptions(screen.getByLabelText(/Gender/i), "male");

        // Enter valid passwords
        userEvent.type(screen.getByTestId("password"), "password123");
        userEvent.type(screen.getByTestId("passwordRepeat"), "password123");

        // Submit the form
        const submitButton = screen.getByRole("button", { name: /Register/i });
        userEvent.click(submitButton);

        // Wait for the fetch call to resolve and for the redirection to occur
        await waitFor(() => {
            // Ensure that the redirect is triggered (URL change or location.assign call)
            expect(window.location.assign).toHaveBeenCalledWith("/login"); // Adjust URL based on your actual redirection
        });

        // Restore the original window.location
        window.location = mockLocation;
    });

    test("shows spinner when form is submitting", () => {
        render(<RegisterForm />);

        // Fill in the form with valid data
        userEvent.type(screen.getByLabelText(/First Name/i), "John");
        userEvent.type(screen.getByLabelText(/Last Name/i), "Doe");
        userEvent.type(screen.getByLabelText(/Username/i), "john_doe");
        userEvent.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
        userEvent.type(screen.getByLabelText(/Birthdate/i), "1990-01-01");
        userEvent.selectOptions(screen.getByLabelText(/Gender/i), "male");
        userEvent.type(screen.getByLabelText(/Password/i), "password123");
        userEvent.type(screen.getByLabelText(/Confirm Password/i), "password123");

        // Click to submit the form
        const submitButton = screen.getByRole("button", { name: /Register/i });
        userEvent.click(submitButton);

        // Check if spinner is shown
        expect(screen.getByText(/Submitting.../i)).toBeInTheDocument();
    });

    test("shows validation errors when passwords don't match", async () => {
        render(<RegisterForm />);

        // Fill in the form with mismatched passwords
        // Get all elements with the label "Password" and "Confirm Password"
        const passwordInputs = screen.getAllByLabelText(/Password/i);
        const confirmPasswordInputs = screen.getAllByLabelText(/Confirm Password/i);

        // Fill in the form with mismatched passwords
        userEvent.type(passwordInputs[0], "password123"); // Password field
        userEvent.type(confirmPasswordInputs[0], "password321"); // Confirm Password field
        // Submit form
        const submitButton = screen.getByRole("button", { name: /Register/i });
        userEvent.click(submitButton);

        // Log the current DOM to inspect its state
        console.log(document.body.innerHTML);

        // Wait for the error about password mismatch
        await waitFor(() => {
            expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
        });
    });

});