# Sharnbasva University BCA Co-Education Admission Portal

A complete, production-ready full-stack web application for managing online admission applications.

## Features

* **Student Features**:
  * Registration with Email OTP Verification
  * Multi-step admission application form with save draft capability
  * Document upload (PDF, JPG, PNG)
  * Application preview and cross-verification
  * Final submission with a second layer of Email OTP verification
  * Real-time status tracking via Dashboard
* **Admin Features**:
  * Secure Admin Dashboard with analytics
  * Complete application and document review
  * Verification workflows (Approve, Reject, Request Correction)
  * Extensive Audit Logs for history tracking
* **System**:
  * MongoDB for persistent data storage
  * Express.js server & API routes
  * JWT based Authentication
  * Role-based access control (Student vs. Admin)
  * Email notifications via Nodemailer

## Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Router, React Hook Form, Zod, Lucide React
* **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, Nodemailer, Multer

## Database / Setup

This repository uses **mongodb-memory-server** to emulate a fully functional MongoDB instance locally in the AI Studio environment without requiring Docker or a dedicated Mongo installation. 
All data is stored in memory and completely volatile on server restart, but it provides a 100% genuine MongoDB querying environment. 

To use a persistent MongoDB instance, update the `MONGODB_URI` environment variable.

## Development Commands

* `npm run dev` - Starts the development server using `tsx` and `vite` on port 3000.
* `npm run build` - Builds both the React frontend and compiles the Node.js backend.
* `npm run start` - Starts the production build.
* `npm run seed:admin` - Pre-seeds a default admin account (if not automatically created at boot).

## Default Admin Credentials
When the server boots up, a default admin is created automatically:
* **Email**: admin@sharnbasva.edu.in
* **Password**: admin123
