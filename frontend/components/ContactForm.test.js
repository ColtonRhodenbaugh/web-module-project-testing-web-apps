import React from 'react';
import App from '../App';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);

    const header = screen.queryByText(/contact form/i)

    //expect(header).toBeInDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const fName = screen.getByLabelText(/First Name*/i);
    userEvent.type(fName, 'edd');

    const err = await screen.findAllByTestId('error');
    expect(err).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);

    const err = await screen.findAllByTestId('error');
    expect(err).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
    const fName = 'Colton';
    const lName = 'Rhodenbaugh'

    const fNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(fNameInput, fName);

    const lNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lNameInput, lName);

    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);

    const err = await screen.findAllByTestId('error')
    expect(err).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const email = '1';
    const emailInput = screen.getByLabelText(/Email*/i);

    userEvent.type(emailInput, email)

    const err =  await screen.findByText(/email must be a valid email address/i)
    expect(err).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    const fName = 'Colton';
    const email = 'crhodenbaugh2204@gmail.com'
    
    const fNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(fNameInput, fName);
    
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, email);
    
    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);
    
    const err = await screen.findByText(/lastName is a required field/i)
    expect(err).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    //arrange
    render(<ContactForm />);
    const firstName = 'Colton'
    const lastName = 'Rhodenbaugh'
    const email = 'crhodenbaugh2204@gmail.com'
    //act
    const fNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(fNameInput, firstName);

    const lNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lNameInput, lastName);

    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, email);

    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn)
    //assert
    await waitFor(() => {
        const fNameDisplay = screen.queryByText('Colton')
        const lNameDisplay = screen.queryByText('Rhodenbaugh')
        const emailDisplay = screen.queryByText('crhodenbaugh2204@gmail.com')
        const messDisplay = screen.queryByTestId('messageDisplay')

        expect(fNameDisplay).toBeInTheDocument();
        expect(lNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messDisplay).not.toBeInTheDocument();
        //expect(messageInput).toBeNull()
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    //arrange
    render(<ContactForm />);
    const firstName = 'Colton'
    const lastName = 'Rhodenbaugh'
    const email = 'crhodenbaugh2204@gmail.com'
    //act
    const fNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(fNameInput, firstName);

    const lNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lNameInput, lastName);

    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, email);

    const messInput = screen.getByLabelText(/Message/i);
    userEvent.type(messInput, 'Hello World');

    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn)
    //assert
    await waitFor(() => {
        const youSubmitted = screen.queryByText(firstName, lastName, email, 'Hello World')
        expect(youSubmitted).toBeInTheDocument();
    });
});
