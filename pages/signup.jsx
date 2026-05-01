import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Signup(props) {
  const router = useRouter();
  const [
    { username, password, "confirm-password": confirmPassword },
    setForm,
  ] = useState({
    username: "",
    password: "",
    "confirm-password": "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      username,
      password,
      "confirm-password": confirmPassword,
      ...{ [e.target.name]: e.target.value.trim() },
    });
  }
  async function handleCreateAccount(e) {
    e.preventDefault();
    if (!username) return setError("Must include username");
    if (password !== confirmPassword) return setError("Passwords must Match");

    try {
      const res = await fetch("/api/auth/signup", {
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
        <link rel="icon" href="/BookSaverIcon.ico" />
      </Head>

      <main className={styles.main}>
        <img src="/banner.jpg" alt="Book Banner" className={styles.banner} />
        <h1 className={styles.title}>
           Create your Book Nook account!</h1>
           <p className={styles.description}>
            Sign up to start saving books to your reading list</p>

        <form
          className={[styles.card, styles.form].join(" ")}
          onSubmit={handleCreateAccount}
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
            autoComplete="new-password"
            onChange={handleChange}
            value={password}
          />
          <label htmlFor="confirm-password">Confirm Password: </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            autoComplete="confirm-password"
            onChange={handleChange}
            value={confirmPassword}
          />
          <button className={styles.button}>Submit</button>
          {error && <p>{error}</p>}
        </form>
        <Link href="/login">
          <p>Login instead?</p>
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
