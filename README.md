# Wavestone Recruitment Task: React Native Developer

## Application Overview

Develop a React Native application for managing products in a store. This application will feature user authentication and CRUD (Create, Read, Update, Delete) operations for products. The application will utilize Redux for state management and include middleware to interact with an API for product management.

## Features

1. **Authentication**:

   - **Login Screen**: User login with JWT token-based authorization.

2. **Product Management**:

   - **Product Screen**: Display a list of products with options to add, edit, delete, sort, and filter products.
   - **Add Product Screen**: Form to add a new product with validation.

3. **Navigation**:
   - Navbar to navigate between Login, Add Product, and Product screens.

## Detailed Requirements

### 1. Screens

- **Login Screen**:

  - Form fields for username and password.
  - Authentication using JWT tokens.
  - Error handling for incorrect login credentials.

- **Product Screen**:

  - Display a list of products after successful login.
  - Each product item should display name, price, date added, and category.
  - Options to add a new product, delete a product, and update an existing product.
  - Sorting options by name, price, date added, and category.
  - Filtering options by category (Electronics, Clothing, Food).

- **Add Product Screen**:
  - Form fields for product name, price, category, and date.
  - Validation:
    - **Name**: Required, minimum 3 characters.
    - **Price**: Required, must be a number.
    - **Category**: Required, must be one of the enum values [Electronics, Clothing, Food].
    - **Date added**: Required, must be a valid date.
  - Error handling for invalid inputs.

### 2. State Management

- Use Redux for state management.
- Include middleware to handle asynchronous API calls for CRUD operations.

### 3. API Integration

- Use middleware to interact with an API for:
  - Fetching the list of products.
  - Creating a new product.
  - Updating an existing product.
  - Deleting a product.
- Ensure all API interactions are secured with JWT tokens for authorized access.

## Project Structure

### 1. App Folder

The application code resides in the `app` folder, which contains an `Index.tsx` file as the entry point.

### 2. API Folder

The API code resides in the `api` folder.

**API Setup**:

1. Navigate to the `api` folder:
   ```bash
   cd api
   ```
2. Install dependencies:

```bash
npm install
```

3. Start the API server:

```bash
npm start
```

4. Access the Swagger documentation at http://localhost:3000/api-docs.

## Project Setup

1. Prerequisites

- Ensure you have Node.js and npm installed.
- Install Expo CLI for React Native development.
- Note: This application runs only on Android and iOS platforms.

2. Installation

Install dependencies in the app folder:

```bash
cd app
npm install
```

3. Running the Application

- Start the development server from the app folder:

```bash
npm start
```

- Use the Expo Go app on your mobile device to scan the QR code and run the application.

Feel free to reach out if you have any questions or need further clarifications regarding the task. Good luck!
