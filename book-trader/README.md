# Rebound 
## Book Trading Platform by Eestienne51

### Overview
As my first proper individual project, I decided to build this book trading platform. On it, users can list books and trade these with others. The app has authentication and persistent data storage functionality powered by Firebase. Upon creating an account or logging in, users are taken to the homepage, where they can check the existing listings or add a new listing using the Book Adder form. The trades page contains all of the current user's trades, separated by those that they have received and those that they have themselves requested. 

### Tech Stack
I used Typescript with Node.js for the backend functionality and React.js for the frontend. As previously mentioned, Firebase is used for authentication and persistent data storage. I used CSS for styling throughout and Vite in order to run my frontend. 
![agxfi9](https://github.com/user-attachments/assets/2fa8de22-70cc-4242-8b79-e34a1a023c94)

### Design Choices

#### Protected Routes
I decided to use protected routes for all of my endpoints that are not "GET" endpoints. I decided to do this as I felt that some sort of authentication was needed for updating this formation. Although these are just books, this was good practice for how to handle more sensitive data in the future. In order to achieve these protected routes, I created an AuthRequest interface that extended the normal Express Request functionality. Then, I passed in the user's token in the frontend when calling the endpoint, and this was then checked by the firebase admin to be legitimate. I could then use the decoded user Id and email in backend endpoints. 

#### Trade Status
I decided to display the trades in only two categories, Requested and Received. However, each of these also has a field in the backend that can only be pending, declined or accepted. Then depending on the trade status, it is coloured in a different colour on the trades page.

#### Usernames
This was initially pretty tricky to implement, but I thought it was necessary as it added a more personal touch to the book listings and made it a lot simpler for users to navigate, as they wouldn't be looking at emails or userIds for the listings, but rather a username. These are stored under the userId in the database for ease of access. 

#### Book Condition Pop-Up
Before undertaking this project, I didn't actually realise that there was such a wide range of book condition, hence I thought it would be useful for users to be able to see a description of the different options, in order to pick he correct one.

#### Delete/ Trade Request
When a user clicks on a book that isn't theirs, they see an option to trade for that book, an option that they cannot see if it is their own book. When they click the trade button, they are taken to another pop-up, where they can select which of their books to trade against the selected ones. If it is their own book, they can instead delete this book. This allows users to delete their book listing if they no longer want it displayed, or, if it is another persons's book, they can request a trade, but naturally not delete it. In addition, they can leave/ cancel at any time with the x button.

### How to
When first opening the website, you may log-in/ create an account by clicking on the log-in button. Before logging in, you may check out any of the listings, but will be unable to request any trades. After logging in, you can add a book using the form, check out a book by clicking on it, or navigate to the trades page by clicking on the icon in the header. If you want to request a trade, click on a book that isn't yours and the Request Trade button. There, you can choose one of your books to trade and submit the trade offer. You can delete one of you books by clicking on the listing and pressing the delete button. On Trade page, you may remove your own trade offers and accept or decline trade offers that users have submitted to you, by clicking on a trade and pressing the appropriate buttons. 



## Link to repo (under book-trader): https://github.com/Eestienne51/my-projects

