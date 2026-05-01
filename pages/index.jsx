import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";
import { useEffect, useState } from "react";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Home(props) {
  const router = useRouter();
  const logout = useLogout();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [savedTitles, setSavedTitles] = useState([]);

  async function handleSearch(event) {
    event.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        `/api/books?q=${encodeURIComponent(searchTerm)}`
      );

      const data = await response.json();

      setSearchResults(data);
    } catch (error) {
      setMessage("Error searching for books");
    }
  }

  async function saveBook(book) {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      const data = await response.json();

      setMessage(data.message);
      setSavedTitles([...savedTitles, book.title]);
      loadSavedBooks();
    } catch (error) {
      setMessage("Error saving book");
    }
  }

  async function deleteBook(id) {
    try {
      const response = await fetch(`/api/books?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      setMessage(data.message);
      loadSavedBooks();
    } catch (error) {
      setMessage("Error deleting book")
    }
  }

  async function loadSavedBooks() {
    try {
      const response = await fetch("/api/books");
      const data = await response.json();

      setSavedBooks(data);
      } catch (error) {
      setMessage("Error loading saved books");
      }
    }

    useEffect(() => {
      loadSavedBooks();
    }, []);

  return (
    <div className={styles.container}>
      <Head>
        <img src="/banner.jpg" alt="Book Banner" className={styles.banner} />
        <title>Book Saver</title>
        <meta name="description" content="A simple app for searching and saving books" />
        <link rel="icon" href="/BookSaverIcon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>Book Saver</h1>
          
          <p className={styles.description}>
            Search for books and save titles to a simple reading list.</p>

          <form className={styles.form} onSubmit={handleSearch}>
            <input
              className={styles.input}
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search titles or authors"
            />

            <button className={styles.button} type="submit">Search</button>
          </form>

          <section className={styles.section}>
            <h2>Search Results</h2>

            <div className={styles.cardGrid}>
            {searchResults.map((book, index) => (
              <div className={styles.bookCard} key={index}>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <button className={styles.button} type="button" onClick={() => saveBook(book)}>
                {savedTitles.includes(book.title) ? "Saved!" : "Save Book"}
                </button>
                </div>
            ))}
            </div>

            {message && <p>{message}</p>}
          </section>

          <section className={styles.section}>  
            <h2>Saved Books</h2>

            <div className={styles.cardGrid}>
            {savedBooks.map((book) => (
              <div className={styles.bookCard} key={book._id}>
                <h3>{book.title}</h3>
                <p>{book.author}</p>

                <button
              className={styles.button}
              type="button"
              onClick={() => deleteBook(book._id)}>
              Delete</button>
              </div>
            ))}
            </div>
            </section>
      </main>

      <footer className={styles.footer}>
        <Image
          src="/BookSaverIcon.png"
          alt="Book Saver Logo"
          width={60}
          height={60}
          />
          <p>Booker Saver</p>
      </footer>
    </div>
  );
}
