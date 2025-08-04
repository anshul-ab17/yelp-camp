# YelpCamp - TypeScript Edition

A modern, full-featured web application for exploring, sharing, and reviewing campgrounds.

## Features
- **TypeScript Core:** Refactored from JavaScript to clean, typed TypeScript for robust server operation.
- **Modern UI Redesign:** Implemented a custom forest-emerald design system with Outfit & Inter typography.
- **Responsive Layout:** Responsive templates using Bootstrap 5.3.3.
- **Authentication:** Local user signup and login utilizing Passport.js and secure sessions.
- **Interactive Mapping:** Location geocoding and map rendering (cluster map & show page pin) powered by Mapbox SDK.
- **Cloud Uploads:** Safe campground image uploads using Multer and Cloudinary integration.
- **Security:** Helmet CSP header controls and Express Mongo Sanitize protection.
- **Database:** MongoDB persistence with Mongoose ODM.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Yarn
- MongoDB Local/Atlas instance

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/anshul-ab17/yelp-camp.git
   cd yelp-camp
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   MAPBOX_TOKEN=your_mapbox_token
   SECRET=your_session_secret
   DB_URL=mongodb://localhost:27017/yelp-camp
   ```
4. Seed the database (optional):
   ```bash
   yarn seed
   ```
5. Run the dev server:
   ```bash
   yarn dev
   ```
