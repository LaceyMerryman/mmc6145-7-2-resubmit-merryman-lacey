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

  const getBookKey = (book) => `${book.title}-${book.author}`;

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
    if (!props.isLoggedIn) {
      setMessage("Please log in to save books.");
      router.push("/login");
      return;
    }

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
      setSavedTitles((prev) => [...prev, getBookKey(book)]);
      setSavedBooks((prev) => [data.data, ...prev]);
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

      if (response.ok) {
        setSavedBooks((prev) => prev.filter((book) => book._id !== id));
        setMessage(data.message);
      } else {
        setMessage(data.message || "Error deleting book");
      }
    } catch (error) {
      setMessage("Error deleting book")
    }
  }

  async function loadSavedBooks() {
    if (!props.isLoggedIn) {
      return;
    }
    
    try {
      const response = await fetch("/api/books");
      const data = await response.json();

      if (Array.isArray(data)) {
        setSavedBooks(data);
      } else {
        setSavedBooks([]);
        setMessage(data.message || "No saved books found.");
      }
    } catch (error) {
      setMessage("Error loading saved books");
      setSavedBooks([]);
    }
  }

    useEffect(() => {
      if (props.isLoggedIn) {
        loadSavedBooks();
      }
    }, [props.isLoggedIn]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Book Nook</title>
        <meta name="description" content="A simple app for searching and saving books" />
        <link rel="icon" href="/BookSaverIcon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <img src="/banner.jpg" alt="Book Banner" className={styles.banner} />
        <h1 className={styles.title}>Book Nook</h1>
          
          <p className={styles.description}>
            Search for books and save titles to a simple reading list.</p>

            {!props.isLoggedIn ? (
              <section className={styles.section}>
                <h2 className={styles.centerText}>Please log in or create an account to use Book Nook.</h2>

                <div className={styles.authButtons}>
                <Link href="/login">
                  <button className={styles.button} type="button">
                    Login
                  </button>
                </Link>

                <Link href="/signup">
                  <button className={styles.button} type="button">
                    Sign Up
                  </button>
                </Link>
                </div>
              </section>
            ) : (
              <>
          <form className={styles.form} onSubmit={handleSearch}>
            <input
              className={styles.input}
              id="bookSearch"
              name="bookSearch"
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
              <div className={styles.bookCard} key={`${book.title}-${book.author}-${index}`}>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <button className={styles.button} type="button" onClick={() => saveBook(book)}>
                {savedTitles.includes(getBookKey(book)) ? "Saved!" : "Save Book"}
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

                <button className={styles.button} type="button" onClick={() => deleteBook(book._id)}>
                Delete</button>
              </div>
            ))}
            </div>
            </section>
            </>
            )}
      </main>

      <footer className={styles.footer}>
        <Image
          src="/BookSaverIcon.png"
          alt="Book Nook Logo"
          width={60}
          height={60}
          />
          <p>Book Nook</p>
      </footer>
    </div>
  );
}
