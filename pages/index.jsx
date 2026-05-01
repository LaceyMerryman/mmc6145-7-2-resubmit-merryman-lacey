import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

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

  return (
    <div className={styles.container}>
      <Head>
        <title>Book Saver</title>
        <meta name="description" content="A simple app for searching and saving books" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>Book Saver</h1>
          
          <p className={styles.description}>
            Search for books and save titles to a simple reading list.</p>

          <form onSubmit={handleSearch}>
            <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search for a book"
            />
            <button type="submit">Search</button>
          </form>

          <section>
            <h2>Search Results</h2>

            {searchResults.map((book, index) => (
              <div key={index}>
                <h3>{book.title}</h3>
                <p>{book.author}</p></div>
            ))}
          </section>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
