# User Registration Endpoint

## POST `/users/register`

Registers a new user in the system.

### Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `fullname.firstname` (string, required): Minimum 3 characters.
- `fullname.lastname` (string, optional): Minimum 3 characters if provided.
- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.

### Responses

- **201 Created**
  - Registration successful.
  - Returns a JSON object with a JWT token and the created user.
  - Example:
    ```json
    {
      "token": "jwt_token_here",
      "user": {
        "_id": "user_id",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **400 Bad Request**
  - Validation failed.
  - Returns a JSON object with an `errors` array describing the issues.
  - Example:
    ```json
    {
      "errors": [
        {
          "msg": "Please enter a valid email address",
          "param": "email",
          "location": "body"
        }
      ]
    }
    ```

- **500 Internal Server Error**
  - Unexpected server error.

### Example cURL

```sh
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```

# User Login Endpoint

## POST `/users/login`

Logs in a user in the system.

### Request Body

Send a JSON object with the following structure:

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.

### Responses

- **200 OK**
  - Login successful.
  - Returns a JSON object with a JWT token and the logged-in user.
  - Example:
    ```json
    {
      "token": "jwt_token_here",
      "user": {
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **400 Bad Request**
  - Invalid request body.
  - Returns a JSON object with error messages.
  - Example:
    ```json
    {
      "errors": [
        {
          "msg": "Invalid credentials",
          "param": "email",
          "location": "body"
        }
      ]
    }
    ```

- **401 Unauthorized**
  - Invalid credentials.
  - Returns a JSON object with an error message.
  - Example:
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

### Example Request

```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```



# GET `/users/logout`

Logs out a user from the system.


### Request

No request body is required.


### Responses

- **200 OK**
  - Logout successful.
  - Returns a JSON object with a success message.
  - Example:
    ```json
    {
      "message": "Logout successful"
    }
    ```


### Blacklisting Model

The blacklisting model is implemented using the `blackListToken.model.js` file. When a user logs out, their token is added to the blacklist collection in the database. This is done to prevent the token from being used again after logout.


### Blacklist Collection Schema

The blacklist collection schema is defined as follows:

```javascript
const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
		type: Date,
		default: Date.now,
		expires: 86400, // 24 hours TTL
	},
});

module.exports = mongoose.model('BlackListToken', blackListTokenSchema);
```

The `expireAfterSeconds` option is used to set a TTL (time to live) for the documents in the blacklist collection. This means that the documents will be automatically deleted after a certain amount of time (in this case, 24 hours).


### Example Request

```bash
curl -X GET http://localhost:4000/users/logout
```

### How it works

Here's a step-by-step explanation of how the logout route works:

1. When a user sends a GET request to the `/users/logout` route, the `authUser` middleware checks if the user is authenticated.
2. If the user is authenticated, the `logout` controller is called.
3. The `logout` controller extracts the token from the request headers and adds it to the blacklist collection in the database.
4. The blacklist collection has a TTL set to 1 hour, which means that the token will be automatically deleted after 1 hour.
5. The `logout` controller returns a success message to the user.

Note: The `authUser` middleware is used to protect the logout route, which means that only authenticated users can access this route.
