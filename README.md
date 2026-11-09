# E-Commerce REST API

A Node.js and Express REST API for an e-commerce platform featuring JWT authentication, role-based access control, product management with Cloudinary image uploads, order processing, and Bakong KHQR payment integration.

---

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express v5 (`^5.2.1`)
- **Database:** MongoDB with Mongoose (`^9.0.2`)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcrypt`
- **File Uploads:** `multer` & `cloudinary` (`multer-storage-cloudinary`)
- **Payments:** Bakong KHQR (`bakong-khqr`) & `axios`
- **Environment & CORS:** `dotenv` & `cors`

---

## Architecture & Project Structure

The project follows a layered architecture separating HTTP handling, business logic, and data access:

- **Controllers:** Handle HTTP requests (`req`, `res`), parse parameters/body/query, invoke services, and return responses.
- **Services:** Contain business logic independent of Express and call repositories/models.
- **Repositories & Models:** Encapsulate Mongoose schemas and database queries.

```text
src/
├── app.js                                  # Express app setup, CORS, and route registration
├── server.js                               # Entry point starting the HTTP server
├── configs/
│   └── env.js                              # Environment variable exports (PORT, MONGO_URL)
├── controllers/
│   ├── auth.controller.js                  # Auth HTTP handlers
│   ├── order.controller.js                 # Order HTTP handlers
│   ├── payment.controller.js               # Bakong KHQR generation and verification handlers
│   ├── product.controller.js               # Product CRUD HTTP handlers
│   └── user.controller.js                  # User listing HTTP handlers
├── database/
│   ├── connection.js                       # MongoDB connection setup
│   ├── models/
│   │   ├── order.model.js                  # Order schema
│   │   ├── payment.model.js                # Payment schema (KHQR MD5 & transaction hash)
│   │   ├── product.model.js                # Product schema
│   │   └── user.model.js                   # User schema (with user/admin roles)
│   └── repositories/
│       ├── order.respository.js            # Order database queries
│       ├── prodouct.repository.js          # Product database queries
│       └── user.repository.js              # User database queries
├── middlewares/
│   ├── auth.middleware.js                  # JWT access token verification
│   ├── image.middleware.js                 # Multer + Cloudinary storage configuration
│   ├── protect.middleware.js               # Auth + DB user check + role-based guard
│   └── validate.middleware.js              # Request payload validation for products & orders
├── routes/
│   └── v1/
│       ├── auth.route.js                   # /api/v1/auth routes
│       ├── order.routes.js                 # /api/v1/order routes
│       ├── payment.route.js                # /api/v1/payment routes
│       ├── product.routes.js               # /api/v1/product routes
│       └── user.route.js                   # /api/v1/users routes
├── services/
│   ├── auth.service.js                     # Registration, login, token refresh logic
│   ├── order.service.js                    # Order calculation and creation logic
│   ├── product.service.js                  # Product management and filtering logic
│   └── user.service.js                     # User retrieval logic
└── utils/
    └── token.js                            # Access and refresh JWT generators
```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server & Database
PORT=4000
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>/<dbname>

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration (Product Images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Bakong KHQR Payment Configuration
BAKONG_ACCOUNT_ID=your_bakong_account_id
BAKONG_API_TOKEN=your_bakong_api_token
```

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode (with Nodemon):**
   ```bash
   npm run dev
   ```

3. **Run in production mode:**
   ```bash
   npm start
   ```

---

## API Endpoints

All routes are prefixed with `/api/v1`. Protected routes require an `Authorization: Bearer <accessToken>` header.

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new user (`name`, `email`, `password`, optional `role`) |
| `POST` | `/login` | Public | Authenticate user and receive `accessToken`, `refreshToken`, and user info |
| `POST` | `/refresh` | Public | Exchange a `refreshToken` for a new `accessToken` |
| `POST` | `/logout` | Public | Return logout confirmation |
| `GET` | `/me` | Authenticated | Get the currently authenticated user's profile |

### Users (`/api/v1/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/all` | Admin | Retrieve all registered users (excluding passwords) |

### Products (`/api/v1/product`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | List products with pagination (`page`, `limit`), `search`, and `category` filters |
| `GET` | `/categories` | Public | Retrieve a list of distinct product categories |
| `GET` | `/:id` | Authenticated | Retrieve details for a single product by ID |
| `POST` | `/` | Authenticated | Create a product (`multipart/form-data` with `image` file, `name`, `price`, `category`, `stock`) |
| `PUT` | `/:id` | Authenticated | Update a product by ID (supports optional new `image` upload) |
| `DELETE` | `/:id` | Authenticated | Delete a product by ID |

### Orders (`/api/v1/order`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Authenticated | Place a new order (`products: [{ product, quantity }]`); calculates total automatically |
| `GET` | `/` | Authenticated | List all orders belonging to the authenticated user |
| `GET` | `/:id` | Authenticated | Get a specific order by ID (restricted to the order owner) |

### Payments (`/api/v1/payment`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/khqr` | Authenticated | Generate a Bakong KHQR string and MD5 hash for an `orderId` |
| `GET` | `/check-status/:md5` | Authenticated | Verify payment status against the Bakong API (`api-bakong.nbc.gov.kh`) using the QR MD5 hash and mark the order as `paid` |

---

## CORS Configuration

Configured in [`src/app.js`](src/app.js) to allow credentials from:
- `http://localhost:5173`
- `https://e-smart-shop.vercel.app`
- `https://e-commerce.nupheaoeun.workers.dev`
