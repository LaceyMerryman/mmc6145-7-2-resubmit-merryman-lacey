import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";

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

export default function Dashboard(props) {
  const router = useRouter();
  const logout = useLogout();
  return (
    <div className={styles.container}>
      <Head>
        <img src="/banner.jpg" alt="Book Banner" className={styles.banner} />
        <title>Book Saver</title>
        <meta name="description" content="A simple app for searching and saving books" />
        <link rel="icon" href="/BookSaverIcon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props.user.username} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the Book Saver app!
        </h1>

        <p className={styles.description}>
          Begin saving books by visiting our Home page and searching for titles or authors<br></br>to save to your personal reading list.
        </p>

        <div className={styles.grid}>
          <Link href="/" className={styles.card}>
            <h2>Home &rarr;</h2>
            <p>Return to the homepage.</p>
          </Link>
          <div
            onClick={logout}
            style={{ cursor: "pointer" }}
            className={styles.card}
          >
            <h2>Logout &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </div>
        </div>
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
