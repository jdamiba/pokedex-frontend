## Frontend: Pokemon Client

This project consists of a React application that interacts with an API to display Pokemon data.

### Features

- Display a paginated list of Pokemon
- Search for Pokemon by name
- View detailed information about each Pokemon
- User authentication (login)

### API Integration

The frontend uses Axios to make HTTP requests to the Pokemon API. Here are some examples of how the API is consumed:

1. Fetching Pokemon list:

   ```javascript
   const response = await axios.get(`${API_URL}/pokemon?page=${page}`);
   ```

2. Searching for Pokemon by name:

   ```javascript
   const response = await axios.get(`${API_URL}/pokemon/name/${name}`, {
     headers: { Authorization: `Bearer ${token}` },
   });
   ```

3. User authentication:
   ```javascript
   const response = await axios.post(`${API_URL}/auth/login`, {
     username,
     password,
   });
   const token = response.data.token;
   // Store token for subsequent authenticated requests
   ```

### State Management

The frontend uses React's useState and useEffect hooks for state management, allowing for efficient updates of the UI based on API responses and user interactions.

### Styling

The application is styled using CSS, with a responsive design that adapts to different screen sizes, including mobile devices.

## License

This project is licensed under the MIT License. All information about Pokemon is copyrighted by the Pokémon Company and its affiliates.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
