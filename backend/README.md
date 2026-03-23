# YelpCamp Backend API

> The Node.js and Express RESTful API powering YelpCamp. 

This backend service manages user authentication, authorization, session persistence (via cookies), and the integration with MongoDB for Campground and Review resources. It also handles direct file uploads and connects with Cloudinary.

## 🛠 Tech Stack

- **Framework**: Express.js
- **Database Engine**: MongoDB (via Mongoose ODM)
- **Security**: 
  - `cors` (Configured to accept cross-origin credentials from `http://localhost:5173`)
  - `express-mongo-sanitize` (Protects against NoSQL injection)
  - `sanitize-html` (XSS Attack protection)
- **Authentication**: `passport`, `passport-local`, and `passport-local-mongoose`
- **Validation Rules**: `joi`
- **Assets**: `multer`, `multer-storage-cloudinary`, and `cloudinary`

## 🧩 Key API Endpoints

- `GET /campgrounds`: Retrieve all campgrounds.
- `GET /campgrounds/:id`: Fetch specific campground details and populated reviews.
- `POST /campgrounds`: Create a new campground (Requires authenticated session & allows multipart form-data).
- `PUT /campgrounds/:id`: Update an existing campground.
- `DELETE /campgrounds/:id`: Remove a campground (auth required).
- `POST /campgrounds/:id/reviews`: Post a campground review.
- `PUT /campgrounds/:id/reviews/:reviewId`: Edit and update an existing review (auth and strict authorship required).
- `DELETE /campgrounds/:id/reviews/:reviewId`: Remove a review.
- `POST /register`: Create a new user account and establish a session.
- `POST /login`: Authenticate an existing user and return a secure cookie session.

## ⚙️ Configuration Setup

Create a `.env` file at the root of the `./backend` folder:
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
NODE_ENV=development
```

Ensure your local `mongod` server is running on the default port (27017). The app points to `mongodb://127.0.0.1:27017/yelp-camp`.

## ▶️ Running the Server

Install all Node modules:
```bash
npm install
```

Start the Express application:
```bash
npm start
```
*The API handles requests on `http://localhost:3000`.*
