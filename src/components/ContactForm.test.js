import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
  // Arrange
  render(<ContactForm />)
});

test('renders the contact form header', ()=> {
  // Arrange
  render(<ContactForm />)

  // Act
  const heading = screen.getByText(/contact form/i)

  // Assert
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent("Contact Form");
});

test('NO error message is rendered if user enters more than 5 characters into firstname.', async () => {
  // Arrange
  render(<ContactForm />)

  // Act
  const nameInput = screen.getByLabelText(/first name*/i);
  
  userEvent.type(nameInput, 'morethanfive')

  const error = screen.queryByText(/must have at least 5 characters./i)

  // Assert
  expect(nameInput).toBeInTheDocument();
  expect(error).toBeNull();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  // Arrange
  render(<ContactForm />)

  // Act
  const nameInput = screen.getByLabelText(/first name*/i);
  
  userEvent.type(nameInput, 'four')

  const error = screen.queryByText(/must have at least 5 characters./i)

  // Assert
  expect(nameInput).toBeInTheDocument();
  expect(error).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  // Arrange
  render(<ContactForm />)

  // Act
  const nameInput = screen.getByLabelText(/First Name*/i)
  const lastNameInput = screen.getByLabelText(/Last Name*/i)
  const emailInput =  screen.getByLabelText(/Email*/i)

  const submitBtn = screen.queryByRole(/button/i);

  userEvent.type(nameInput, "")
  userEvent.type(lastNameInput, "")
  userEvent.type(emailInput, "")

  userEvent.click(submitBtn)

  const nameError = screen.getByText(/firstName must have at least 5 characters./i)
  const lastNameError = screen.getByText(/lastName is a required field./i)
  const emailError = screen.getByText(/email must be a valid email address./i)

  // Assert
  expect(nameError).toBeInTheDocument();
  expect(lastNameError).toBeInTheDocument();
  expect(emailError).toBeInTheDocument();

  expect(submitBtn).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  // Arrange
  render(<ContactForm />)
  
  // Act
  const nameInput = screen.getByLabelText(/First Name*/i)
  const lastNameInput = screen.getByLabelText(/Last Name*/i)
  const emailInput = screen.getByLabelText(/Email*/i)

  userEvent.type(nameInput, 'Anthony')
  userEvent.type(lastNameInput, 'iommi')
  userEvent.type(emailInput, 'no')

  const nameError = screen.queryByText(/firstName must have at least 5 characters./i)
  const lastNameError = screen.queryByText(/lastName is a required field./i)
  const emailError = screen.queryByText(/email must be a valid email address./i)

  // Assert
  expect(nameError).toBeNull();
  expect(lastNameError).toBeNull();
  expect(emailError).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  // Arrange
  render(<ContactForm />)

  // Act
  const emailInput = screen.getByLabelText(/Email*/i)

  userEvent.type(emailInput, "E")

  const emailError = screen.queryByText(/email must be a valid email address./i)

  // Assert
  expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  // Arrange
  render(<ContactForm />)

  // Act
  const lastNameInput = screen.getByLabelText(/Last Name*/i);
  const submitBtn = screen.queryByRole(/button/i);

  userEvent.type(lastNameInput, "")

  userEvent.click(submitBtn)

  const lastNameError = screen.queryByText(/lastName is a required field/i)

  // Assert
  expect(lastNameError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    // arrange
    render(<ContactForm />)

    // Act 
    const nameInput = screen.getByLabelText(/First Name*/i)
    const lastNameInput = screen.getByLabelText(/Last Name*/i)
    const emailInput = screen.getByLabelText(/Email*/i)
    const messageInput = screen.getByLabelText(/Message/i)

    const submitBtn = screen.queryByRole(/button/i);

    userEvent.type(nameInput, "William")
    userEvent.type(lastNameInput, "Ward")
    userEvent.type(emailInput, "email@email.com")
    userEvent.type(messageInput, "") 

    userEvent.click(submitBtn)

    const firstnameDisplay = screen.getByTestId("firstnameDisplay");
    const lastnameDisplay = screen.getByTestId("lastnameDisplay");
    const emailDisplay = screen.getByTestId("emailDisplay");
    const messageDisplay = screen.queryByTestId("messageDisplay")

    // Assert
     expect(firstnameDisplay).toHaveTextContent("First Name: William")
     expect(lastnameDisplay).toHaveTextContent("Last Name: Ward")
     expect(emailDisplay).toHaveTextContent("Email: email@email.com")
     expect(messageDisplay).toBeNull();
});