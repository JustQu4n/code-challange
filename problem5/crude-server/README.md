# CRUD Server - Express TypeScript API

A RESTful API server built with Express.js, TypeScript, and PostgreSQL for managing resources (Products) with full CRUD operations.

## Features

- ✅ **Create** - Add new products
- ✅ **Read** - List all products with filters and get individual product details
- ✅ **Update** - Modify product information
- ✅ **Delete** - Remove products
- 🔍 Advanced filtering (by category, price range, search)
- 📄 Pagination support
- 🐳 Docker support for PostgreSQL
- 🔒 TypeScript for type safety
- 📊 Sequelize ORM for database management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Containerization**: Docker & Docker Compose

## Prerequisites

Before running this application, make sure you have installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd crude-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following content:

```env
DB_HOST=localhost
DB_PORT=5431
DB_USER=postgres
DB_PASS=123456
DB_NAME=express_ts_db
PORT=5000
```

### 4. Start PostgreSQL database

Using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL container on port 5431.

To stop the database:

```bash
docker-compose down
```

### 5. Run the application

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create a new product |
| GET | `/products` | Get all products with filters |
| GET | `/products/:id` | Get a single product by ID |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

## API Usage Examples

### 1. Create a Product

**Request:**
```http
POST /api/products
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop for developers",
  "price": 1299.99,
  "category": "Electronics",
  "stock": 50
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop for developers",
    "price": "1299.99",
    "category": "Electronics",
    "stock": 50,
    "createdAt": "2025-10-28T10:00:00.000Z",
    "updatedAt": "2025-10-28T10:00:00.000Z"
  }
}
```

### 2. List Products (with filters)

**Request:**
```http
GET /api/products?category=Electronics&minPrice=500&maxPrice=2000&page=1&limit=10
```

**Query Parameters:**
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search in name and description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop for developers",
      "price": "1299.99",
      "category": "Electronics",
      "stock": 50,
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 3. Get Product Details

**Request:**
```http
GET /api/products/1
```

**Response:**
```json
{
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop for developers",
    "price": "1299.99",
    "category": "Electronics",
    "stock": 50,
    "createdAt": "2025-10-28T10:00:00.000Z",
    "updatedAt": "2025-10-28T10:00:00.000Z"
  }
}
```

### 4. Update a Product

**Request:**
```http
PUT /api/products/1
Content-Type: application/json

{
  "price": 1199.99,
  "stock": 45
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop for developers",
    "price": "1199.99",
    "category": "Electronics",
    "stock": 45,
    "createdAt": "2025-10-28T10:00:00.000Z",
    "updatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

### 5. Delete a Product

**Request:**
```http
DELETE /api/products/1
```

**Response:**
```json
{
  "message": "Product deleted successfully",
  "data": {
    "id": "1"
  }
}
```

## Testing the API

You can test the API using:

### Using cURL

```bash
# Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"High-performance laptop","price":1299.99,"category":"Electronics","stock":50}'

# Get all products
curl http://localhost:5000/api/products

# Get a specific product
curl http://localhost:5000/api/products/1

# Update a product
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":1199.99}'

# Delete a product
curl -X DELETE http://localhost:5000/api/products/1
```


### Using Postman or Insomnia

Import the following collection or manually create requests for each endpoint.

## Project Structure

```
crude-server/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── controllers/
│   │   └── productController.ts # Product CRUD logic
│   ├── models/
│   │   └── Product.ts           # Product model definition
│   ├── routes/
│   │   └── productRoutes.ts     # API routes
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── .env                         # Environment variables
├── docker-compose.yml           # Docker configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── README.md                    # Documentation
```

## Database Schema

### Products Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| name | VARCHAR | NOT NULL |
| description | TEXT | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL, >= 0 |
| category | VARCHAR | NOT NULL |
| stock | INTEGER | NOT NULL, DEFAULT 0, >= 0 |
| createdAt | TIMESTAMP | AUTO |
| updatedAt | TIMESTAMP | AUTO |

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
