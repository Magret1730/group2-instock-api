# InStock Backend API

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Validation Rules](#validation-rules)
- [Contributors](#contributors)

## Overview
InStock is a warehouse management system backend API developed as a collaborative project at BrainStation. This RESTful API provides comprehensive functionality for managing warehouses and their inventory items.

## Features
- Warehouse management: Create, update, delete, and retrieve warehouse data.
- Inventory tracking: View and manage stock across multiple warehouses.
- RESTful API with structured JSON responses.
- Error handling and validation for secure and reliable operations.
- Modular and scalable backend architecture.

## Technologies
- **Node.js** - JavaScript runtime for server-side logic.
- **Express.js** - Web framework for handling API routes.
- **MySQL** - Relational database for storing inventory and warehouse data.
- **Knex.js** - ORM for database management.
- **CORS** - Middleware for handling cross-origin requests.
- **Dotenv** - Environment variable management.
- **Validation**: Custom validations

## Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/)

### Installation
1. Clone the repository:
```
    git clone https://github.com/Magret1730/group2-instock-api.git
    cd group2-instock-api
```

2. Install dependencies:
``` npm install ```

3. Create .env file using `.env-example`

4. Run migrations and seeds:
```
    npm run migrate
    npm run seed
```

5. Start the server:
``` npm start ```

6. To get the frontend running, check out the [Frontend Readme](https://github.com/kngo/group2-instock)


## API Endpoints

### Warehouses

| Method | Endpoint                      | Description                      |
|--------|-------------------------------|----------------------------------|
| GET    | `/warehouses`                 | Get all warehouses               |
| POST   | `/warehouses`                 | Create new warehouse             |
| GET    | `/warehouses/:id`             | Get specific warehouse           |
| PUT    | `/warehouses/:id`             | Update warehouse                 |
| DELETE | `/warehouses/:id`             | Delete warehouse                 |
| GET    | `/warehouses/:id/inventories` | Get warehouse inventories        |

### Inventories

| Method | Endpoint            | Description                      |
|--------|---------------------|----------------------------------|
| GET    | `/inventories`      | Get all inventory items          |
| POST   | `/inventories`      | Create new inventory item        |
| GET    | `/inventories/:id`  | Get specific inventory item      |
| PUT    | `/inventories/:id`  | Update inventory item            |
| DELETE | `/inventories/:id`  | Delete inventory item            |

## Validation Rules

### Warehouse
- **Required Fields**: All fields mandatory
- **Name**: Alphanumeric with spaces/hyphens
- **Address**: Alphanumeric with special chars
- **Phone**: International format
- **Email**: Standard email format

### Inventory
- **Required Fields**: All fields mandatory
- **Quantity**: Number ≥ 0
- **Status**: Valid status value
- **Warehouse ID**: Must exist

## Contributors
This project was developed as a collaborative effort at BrainStation by:
- [Brigid Corey](https://github.com/digibrigi)
- [Karen Ngo](https://github.com/kngo)
- [Abiodun Magret Oyedele](https://github.com/Magret1730)
