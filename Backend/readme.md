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




Here is the documentation for the Captain Register endpoint:


## POST `/captains/register`

Registers a new captain in the system.


### Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "Sedan"
  }
}
```

#### Field Requirements

- `fullname.firstname` (string, required): Minimum 3 characters.
- `fullname.lastname` (string, optional): Minimum 3 characters if provided.
- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.
- `vehicle.color` (string, required): Minimum 3 characters.
- `vehicle.plate` (string, required): Minimum 3 characters.
- `vehicle.capacity` (integer, required): Minimum 1.
- `vehicle.vehicleType` (string, required): Minimum 3 characters.


### Responses

- **201 Created**
  - Registration successful.
  - Returns a JSON object with a JWT token and the created captain.
  - Example:
    ```json
    {
      "token": "jwt_token_here",
      "captain": {
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com",
        "vehicle": {
          "color": "Red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "Sedan"
        }
      }
    }
    ```

- **400 Bad Request**
  - Validation failed.
  - Returns a JSON object with error messages.
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


### Captain Model

The captain model is defined in `captain.model.js` and has the following schema:

```javascript
const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, 'First name must be at least 3 characters long'],
      trim: true,
    },
    lastname: {
      type: String,
      minlength: [3, 'Last name must be at least 3 characters long'],
      trim: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, 'Color must be at least 3 characters long'],
      trim: true,
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, 'Plate must be at least 3 characters long'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1'],
    },
    vehicleType: {
      type: String,
      required: true,
      minlength: [3, 'Vehicle type must be at least 3 characters long'],
      trim: true,
    },
  },
});
```

### Captain Service

The captain service is defined in `captain.service.js` and has a method `createCaptain` that creates a new captain document in the database.


### Captain Controller

The captain controller is defined in `captain.controller.js` and has a method `registerCaptain` that handles the registration of a new captain.


### Captain Route

The captain route is defined in `captain.routes.js` and has a route `/register` that handles the registration of a new captain.


### Example Request

```bash
curl -X POST http://localhost:4000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "yourpassword",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }}'
```