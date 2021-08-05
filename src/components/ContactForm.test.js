import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    // Arrange:
    render(<ContactForm />);

    // Act:
    const header = screen.getByText(/contact form/i)

    // Assert:
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByPlaceholderText(/Edd/i)

    expect(firstNameInput).toBeInTheDocument();

    userEvent.type(firstNameInput, "no");

    const firstNameError = screen.getByText(/firstName must have at least 5 characters./i)

    expect(firstNameError).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByPlaceholderText(/Edd/i)
    const lastNameInput = screen.getByPlaceholderText(/Burke/i)
    const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i)
    const submitButton = screen.queryByRole('button')

    userEvent.type(firstNameInput, "");
    userEvent.type(lastNameInput, "");
    userEvent.type(emailInput, "");

    userEvent.click(submitButton)

    const firstNameError = screen.getByText(/firstName must have at least 5 characters./i)
    const lastNameError = screen.getByText(/lastName is a required field./i)
    const emailError = screen.getByText(/email must be a valid email address./i)

    expect(firstNameError).toBeInTheDocument();
    expect(lastNameError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByPlaceholderText(/Edd/i)
    const lastNameInput = screen.getByPlaceholderText(/Burke/i)
    const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i)
    const submitButton = screen.queryByRole('button')

    userEvent.type(firstNameInput, "Emmanuel");
    userEvent.type(lastNameInput, "Gonzalez");
    userEvent.type(emailInput, "");

    userEvent.click(submitButton)

    const firstNameError = screen.queryByText(/firstName must have at least 5 characters./i)
    const lastNameError = screen.queryByText(/lastName is a required field./i)
    const emailError = screen.queryByText(/email must be a valid email address./i)

    expect(firstNameError).not.toBeInTheDocument();
    expect(lastNameError).not.toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i)

    userEvent.type(emailInput, "email");

    const emailError = screen.queryByText(/email must be a valid email address./i)

    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByPlaceholderText(/Edd/i)
  const lastNameInput = screen.getByPlaceholderText(/Burke/i)
  const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i)
  const submitButton = screen.queryByRole('button')

  userEvent.type(firstNameInput, "Emmanuel");
  userEvent.type(lastNameInput, "");
  userEvent.type(emailInput, "email@email.com");

  userEvent.click(submitButton)

  const firstNameError = screen.queryByText(/firstName must have at least 5 characters./i)
  const lastNameError = screen.queryByText(/lastName is a required field./i)
  const emailError = screen.queryByText(/email must be a valid email address./i)

  expect(firstNameError).not.toBeInTheDocument();
  expect(lastNameError).toBeInTheDocument();
  expect(emailError).not.toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByPlaceholderText(/Edd/i)
  const lastNameInput = screen.getByPlaceholderText(/Burke/i)
  const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i)
  const messageInput = screen.getByLabelText(/Message/i)
  const submitButton = screen.queryByRole('button')

  userEvent.type(firstNameInput, "Emmanuel");
  userEvent.type(lastNameInput, "Gonzalez");
  userEvent.type(emailInput, "email@email.com");
  userEvent.type(messageInput, "");

  userEvent.click(submitButton)

  const submissionMessage = screen.getByText(/You Submitted:/i)

  expect(submissionMessage).toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByPlaceholderText(/Edd/i)
  const lastNameInput = screen.getByPlaceholderText(/Burke/i)
  const emailInput = screen.getByPlaceholderText(/bluebill1049@hotmail.com/i)
  const messageInput = screen.getByLabelText(/Message/i)
  const submitButton = screen.queryByRole('button')

  userEvent.type(firstNameInput, "Emmanuel");
  userEvent.type(lastNameInput, "Gonzalez");
  userEvent.type(emailInput, "email@email.com");
  userEvent.type(messageInput, "I am Emmanuel");

  userEvent.click(submitButton)

  const submissionMessage = screen.queryByText(/You Submitted:/i)
  const submittedFName  = screen.queryByText(/First Name:/i)
  const submittedLName  = screen.queryByText(/Last Name:/i)
  const submittedEmail  = screen.queryByText(/Email:/i)
  const submittedMessage  = screen.queryByText(/Message:/i)

  expect(submissionMessage).toBeInTheDocument();
  expect(submittedFName).toBeInTheDocument();
  expect(submittedLName).toBeInTheDocument();
  expect(submittedEmail).toBeInTheDocument();
  expect(submittedMessage).toBeInTheDocument();
});