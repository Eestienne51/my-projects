# Rebound 
## Book Trading Platform by Eestienne51

### Overview
This project is my first fully independent application: a book trading platform that allows users to list books and trade them with others. The app uses Firebase for authentication and persistent data storage. After creating an account or logging in, users are directed to the homepage, where they can browse existing listings or add a new one using the Book Adder form. The Trades page displays all trades associated with the current user, clearly separated into incoming trade requests and trades they have initiated.

### Getting Started
- Clone the my-projects repository at https://github.com/Eestienne51/my-projects
- On your device open the book-trader folder within my-projects
- Open a terminal and run npm i, then do the same for the backend and frontend 
- In the fronted add the following environment variables from your Firebase codebase: 
    - VITE_FIREBASE_API_KEY= 
    - VITE_FIREBASE_AUTH_DOMAIN= 
    - VITE_FIREBASE_PROJECT_ID=
    - VITE_FIREBASE_STORAGE_BUCKET=
    - VITE_FIREBASE_MESSAGING_SENDER_ID=
    - VITE_FIREBASE_APP_ID=
- In the backend, from your Firebase codebase, add the following environment variables: 
    - FIREBASE_PROJECT_ID=
    - FIREBASE_CLIENT_EMAIL=
    - FIREBASE_PRIVATE_KEY=
- To run the project:
    - Open two terminal windows
    - Navigate to the backend folder in one and to the backend folder in the other
    - Run "npm run dev" in both windows
    - Navigate to http://localhost:8000/

### Tech Stack
The backend is built with TypeScript and Node.js, while the frontend is developed using React. Firebase is used for user authentication and persistent data storage. Styling is handled with CSS, and the frontend is bundled and served using Vite.

### Design Choices

#### Security
All non-GET endpoints are protected using authentication middleware. This ensures that only authenticated users can create, update, or modify data. While the application manages book listings rather than sensitive information, implementing protected routes reflects best practice and provides a foundation for handling more sensitive data in future projects.

To support this, I created a custom AuthRequest interface that extends the standard Express Request type. The frontend includes the user’s authentication token with each protected request, which is then verified using the Firebase Admin SDK. Once validated, the decoded user ID and email are made available to backend endpoints for authorization and request handling.

#### Trades
Trades are displayed in two main categories: Requested and Received. Each trade also has a backend status (pending, accepted, or declined) which is reflected visually on the Trades page using different colours to make trade states immediately clear to the user.

When a user views a book they do not own, they are given the option to initiate a trade. Selecting this option opens a pop-up where they can choose one of their own books to offer in exchange. If the book belongs to the current user, the trade option is hidden and replaced with the ability to delete the listing instead. This ensures users can only request trades for other users’ books, while retaining full control over their own listings.

At any point during the process, users can exit or cancel the action using the close (“×”) button.

#### Usernames
Although initially challenging to implement, adding usernames significantly improved the user experience. Usernames give book listings a more personal feel and make them easier to navigate, as users see readable identifiers instead of email addresses or user IDs. For efficient access, usernames are stored in the database under each user’s unique ID.

#### Book Condition Pop-Up
Before starting this project, I hadn’t realised how many different book condition categories exist. To make this clearer for users, the app provides short descriptions for each condition, helping them select the most accurate option when listing a book.

### How to
When first visiting the site, users can log in or create an account using the Log In button. Before signing in, they may browse existing book listings but cannot request trades.

Once logged in, users can add a book using the listing form, view book details by clicking on a listing, or navigate to the Trades page via the header icon. To request a trade, users select a book they do not own and click Request Trade, then choose one of their own books to offer and submit the request. If the selected book belongs to the current user, a Delete option is shown instead, allowing them to remove their own listing.

On the Trades page, users can manage all trade activity: they may cancel their own trade requests and accept or decline trade offers submitted by other users.

### Photos

Homepage

<img width="800" height="400" alt="Homepage" src="https://github.com/user-attachments/assets/124e0a74-4700-4f0f-8b0f-0885741bff6a" />


Trades Page

<img width="800" height="400" alt="Trades Page" src="https://github.com/user-attachments/assets/2c7a7c06-7d99-4644-8844-fc6275e4204c" />


Book Pop-up

<img width="800" height="400" alt="Expanded Book View" src="https://github.com/user-attachments/assets/620166b7-a1ef-456d-96a4-04a03502c660" />


Trade Information Pop-up

<img width="800" height="400" alt="Trade View" src="https://github.com/user-attachments/assets/cf23a965-f3f0-4b8e-91ed-15d091aec10d" />


Trade Sumbmission Pop-up

<img width="800" height="400" alt="Trade Sumbmission" src="https://github.com/user-attachments/assets/a64cf827-a5ba-4475-8a9d-ab61782ba274" />


## Link to repo (under book-trader): https://github.com/Eestienne51/my-projects

