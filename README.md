```markdown
# Aeonaxy Course API

This Node.js application provides a RESTful API for managing courses and users. It offers functionalities such as user registration, course management, enrollment, and more.

## Installation

1. **Node.js and npm:** Ensure you have Node.js and npm installed on your machine. You can download them from [nodejs.org](https://nodejs.org/).

2. **Clone Repository:** Clone this repository to your local machine:
   ```bash
[   git clone https://github.com/ARBHARADWAJ/Aeonaxy.git](https://github.com/ARBHARADWAJ/Aeonaxy.git)

   ```

3. **Install Dependencies:** Navigate to the project directory and install dependencies:
   ```bash
   cd course-api
   npm install
   ```

## Usage

To run the application, use the following command:
```bash
npm start
```

## Routes

### /login

- **Method:** POST
- **Description:** Logs in a user with provided email and password.
- **Parameters:**
  - `email`: User's email
  - `password`: User's password
- **Returns:** JWT token for authentication.

### /register

- **Method:** POST
- **Description:** Registers a new user.
- **Parameters:**
  - `name`: User's name
  - `email`: User's email
  - `password`: User's password
  - `role`: User's role (e.g., admin, user)
- **Returns:** Message indicating successful registration or error.

### /validate

- **Method:** POST
- **Description:** Validates a user's JWT token.
- **Parameters:**
  - `token`: JWT token
  - `key`: Key for validation
- **Returns:** Response indicating token validity.

### /allcourses

- **Method:** GET
- **Description:** Retrieves all courses.
- **Returns:** List of all courses.

### /course/:name

- **Method:** GET
- **Description:** Retrieves details of a specific course by name.
- **Parameters:**
  - `name`: Name of the course
- **Returns:** Details of the course or message if not found.

### /addCourse

- **Method:** POST
- **Description:** Adds a new course.
- **Parameters:**
  - `token`: JWT token for authorization
  - `name`: Name of the course
  - `rating`: Rating of the course
  - `category`: Category of the course
  - `level`: Level of the course
- **Returns:** Message indicating success.

### /filter

- **Method:** GET
- **Description:** Filters courses based on rating or category.
- **Parameters:**
  - `rating`: Rating to filter by
  - `category`: Category to filter by
- **Returns:** Filtered list of courses.

### /enrole/:name

- **Method:** POST
- **Description:** Enrolls a user in a course.
- **Parameters:**
  - `name`: Name of the course
  - `token`: JWT token for authorization
- **Returns:** Enrollment details.

### /viewcourses

- **Method:** POST
- **Description:** Retrieves courses enrolled by a user.
- **Parameters:**
  - `token`: JWT token for authorization
- **Returns:** List of enrolled courses.

## Code Snippet

```javascript
// Sample route handling from the application

app.post("/login", async (req, res) => {
  // Logic for user login
});

// More route handlers...
## Here is the deployed api link
[https://csproject14assignment.onrender.com](https://csproject14assignment.onrender.com)
