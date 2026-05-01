![Image](public/banner.jpg)

# Book Nook
## Description:
Are you ever asked "What are you reading at the moment?" and suddenly, your mind goes completely blank?

The Book Nook App is your new favorite app! Developed for those who can't seem to remember exactly ALL of the book titles or authors in their current reading list. 

Users can search for titles and authors, save books to their Saved Books section, and delete books from their list if needed. 

Turn to your Book Nook when you need a little reminder or when you're looking forward to the next great read!

---
## Logo
![Image](public/BookNookLogo.png)

## Functions
**Signup**

![image](public/Signup.png)
> New users may use the Signup page to create a new account in order to begin adding books to their Saved Books!

---
**Login**

![image](public/Login.png)
> Users may use the Login page to login to their account to access their Saved Books section!

---
**Book Nook Search**

![image](public/BookSaverSearch.png)
> When searching for a book, you need only enter the book title or author name and Book Nook will utilize OpenLibraryAPI to search for your book. 

> Select "Save Book" when you'd like to add the book to your Saved Books.

---
**Saved Books**

![image](public/SavedBooks.png)
> When the Save Book button is selected, the book will appear at the bottom of the page as a list. Users can delete any book they'd like if it was a mistake or they don't wish to keep it!

---
## Installation Instructions
**If deploying locally:**
1. Run the development server:

    > `npm install`

    > `npm run dev`

2. Open [http://localhost:3000](http://localhost:3000) to run the local dev server and see the application.

**Deployment & access with Vercel:**

1. Deploy your applicaiton by adding a new **Project** in Vercel. 
2. You will need to import the Git Repository and possibly configure your GitHub Respository to allow access to Vercel.
3. When your GitHub Repo populates in Vercel, select "Import".
4. Add your environment variables (listed below) then deploy your app by selecting "Deploy"!
5. Allow time to load then view your new site.
6. Test the application is running smoothly. Troubleshoot any issues like missing environment variables or incorrect repository and begin using your website!

---
## Features
* **Home button:** takes user home
* **Login button:** login page for users with acounts
* **Signup button:** signup page for a new account
* **Search bar:** search for titles or authors to add to your saved section
* **Saved Books:**  shows your listed saved books in order of addition
* **Logout button:** logout of your experience until next time
* **Styling:** enjoy the calm colors of the application, styled to be easy on the eyes similarly to reading
* **API:** utilizes OpenLibraryAPI to search for books

---
## Tech Stack
* Next.js
* MongoDB
* React
* Open Library API
* CSS Modules
* Vercel

## API 
* Open Library API was used as it's very user-friendly and quick to integrate
* No API key is required for use and the database is vast and can be narrowed down if needed
* Link: [OpenLibrary.org](https://openlibrary.org)

---
## Environment Variables
> `MONGODB_URI=mongodb+srv://merrymanlacey_db_user:ZePrG4NdHOYBqpUh@cluster0.z5rwpoq.mongodb.net/book-app?retryWrites=true&w=majority`

> `IRON_PASS=supersecurelongpassword1234567890abcd`

> `NEXT_PUBLIC_APP_NAME=Book Save List`

---
## Future Improvements
* Add Saved Books page
* Be able to leave a review of each book
* Be able to give a star rating to each book
* Add read/unread status
* Add search filters
* Add book cover images
* Workshop new/catchy name for the app

---
## Author
**Lacey Merryman**

Graduate Student, Unviersity of Florida

*Expected 2026*

---
