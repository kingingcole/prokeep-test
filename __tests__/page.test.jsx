import fetch, { enableFetchMocks } from 'jest-fetch-mock'

enableFetchMocks()

import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import LoginScreen from '../src/app/page'
 
describe('Page', () => {
  beforeEach(() => {
    fetch.resetMocks()
    localStorage.removeItem('prokeep-login')

    render(<LoginScreen />)
  })

  it('renders a form', () => {
    const emailInput = screen.getByTestId('emailField')
    const passwordInput = screen.getByTestId('passwordField')
    const submitButton = screen.getByTestId('submitBtn')

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('disables the button when email is invalid', () => { 
    const emailInput = screen.getByTestId('emailField')
    const passwordInput = screen.getByTestId('passwordField')
    const submitButton = screen.getByTestId('submitBtn')

    fireEvent.blur(emailInput)
    fireEvent.blur(passwordInput)
    fireEvent.change(emailInput, { target: { value: 'invalid email' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    expect(submitButton).toBeDisabled()
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
  })

  it('disables the button when password is invalid', () => {
    const emailInput = screen.getByTestId('emailField')
    const passwordInput = screen.getByTestId('passwordField')
    const submitButton = screen.getByTestId('submitBtn')

    fireEvent.blur(emailInput)
    fireEvent.blur(passwordInput)
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })

    expect(submitButton).toBeDisabled()
    expect(screen.getByText('Please enter a password')).toBeInTheDocument()
  })

  it('enables the button when email and password are valid', () => {
    const emailInput = screen.getByTestId('emailField')
    const passwordInput = screen.getByTestId('passwordField')
    const submitButton = screen.getByTestId('submitBtn')

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })

    expect(submitButton).toBeEnabled()
  })

  it('logs in successfully with correct credentials', async () => {  
    fetch.mockResponseOnce(JSON.stringify({ token: 'mockedToken' }));
    
    // Fill in the form fields
    const emailInput = screen.getByTestId('emailField');
    const passwordInput = screen.getByTestId('passwordField');
    fireEvent.change(emailInput, { target: { value: 'eve.holt@reqres.in' } });
    fireEvent.change(passwordInput, { target: { value: 'cityslicka' } });
    
    // Submit the form
    const submitBtn = screen.getByTestId('submitBtn');
    fireEvent.click(submitBtn);
    
    // Wait for the login process to complete
    await waitFor(() => {
      // Ensure the user is logged in by checking the presence of UI elements after successful login
      expect(localStorage.getItem('prokeep-login')).toBeTruthy();
      expect(screen.getByText('You are logged in')).toBeInTheDocument();
    });
  });

  it('shows an error message with incorrect credentials', async () => {
    fetch.mockResponseOnce(JSON.stringify({ error: 'Incorrect credentials' }));
    
    // Fill in the form fields
    const emailInput = screen.getByTestId('emailField');
    const passwordInput = screen.getByTestId('passwordField');

    fireEvent.blur(emailInput)
    fireEvent.blur(passwordInput)
    fireEvent.change(emailInput, { target: { value: 'a@test.com'} })
    fireEvent.change(passwordInput, { target: { value: 'password'} })

    // Submit the form
    const submitBtn = screen.getByTestId('submitBtn');

    expect(submitBtn).toBeEnabled()
    fireEvent.click(submitBtn);

    // Wait for the login process to complete
    await waitFor(() => {
      // Ensure the error message is displayed
      expect(screen.getByText('Incorrect credentials')).toBeInTheDocument();
    })
  })

  it('logs out successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ token: 'mockedToken' }));
    
    // Fill in the form fields
    const emailInput = screen.getByTestId('emailField');
    const passwordInput = screen.getByTestId('passwordField');
    
    fireEvent.change(emailInput, { target: { value: 'eve.holt@reqres.in' } });
    fireEvent.change(passwordInput, { target: { value: 'cityslicka' } });

    // Submit the form
    const submitBtn = screen.getByTestId('submitBtn');
    fireEvent.click(submitBtn);

    // Wait for the login process to complete
    await waitFor(() => {
      // Ensure the user is logged in by checking the presence of UI elements after successful login
      expect(localStorage.getItem('prokeep-login')).toBeTruthy();
      expect(screen.getByText('You are logged in')).toBeInTheDocument();

      // Log out
      const logoutBtn = screen.getByTestId('logoutBtn');
      fireEvent.click(logoutBtn);

      // Ensure the user is logged out
      expect(localStorage.getItem('prokeep-login')).toBeFalsy();
      expect(screen.getByText('Login')).toBeInTheDocument();
    })
  })
})