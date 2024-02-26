# Voting Application
This is a backend application for a voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

## Features
User sign up and login with Aadhar Card Number and password
User can see all the candidates.
User can vote for a one favourit candidaes.(only one time).
Admin can manage all the candidates details means:-(add, update, delete) the candidate.
Admin cannot vote any candidate.
# Technologies Used are:-
Node.js
Express.js
MongoDB
JSON Web Tokens (JWT) for authentication

Installation
## Clone the repository:

`git clone` https://github.com/Shiv-cybr03/voting_app_backend

# API Endpoints
## Authentication
# Sign Up
POST /signup: Sign up a user
# Login
POST /login: Login a user
Candidates
# Get Candidates
GET /candidates: Get the list of candidates
# Add Candidate
POST /candidates: Add a new candidate (Admin only)
# Update Candidate
PUT /candidates/:id: Update a candidate by ID (Admin only)
# Delete Candidate
DELETE /candidates/:id: Delete a candidate by ID (Admin only)
Voting
# Get Vote Count
GET /candidates/vote/count: Get the count of votes for each candidate
# Vote for Candidate
POST /candidates/vote/:id: Vote for a candidate (User only)
User Profile
# Get Profile
GET /users/profile: Get user profile information
# Change Password
PUT /users/profile/password: Change user password
