import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";

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

export default function Login(props) {
  const router = useRouter();
  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  function handleChange(e) {
    setForm({ username, password, ...{ [e.target.name]: e.target.value } });
  }
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) return router.push("/dashboard");
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Book Nook</title>
        <meta name="description" content="A simple app for searching and saving books" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <img src="/banner.jpg" alt="Book Banner" className={styles.banner} />
        <h1 className={styles.title}>
          Welcome back to Book Nook!</h1>
          <p className={styles.description}>
            Login below to continue building your reading list</p>

        <form
          className={[styles.card, styles.form].join(" ")}
          onSubmit={handleLogin}
        >
          <label htmlFor="username">Username: </label>
          <input
            className={styles.input}
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            onChange={handleChange}
            value={username}
          />

          <label htmlFor="password">Password: </label>
          <input
            className={styles.input}
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={password}
          />
          <button className={styles.button}>Login</button>
          {error && <p>{error}</p>}
        </form>
        <Link href="/signup">
          <p>Sign up instead?</p>
        </Link>
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
