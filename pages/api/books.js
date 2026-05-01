import dbConnect from '../../db/connection'
import Book from '../../db/models/Book'
import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session";

async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  if (method === 'GET') {
    try {
      if (query && query.q) {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query.q)}`);
        const data = await response.json();

        const books = data.docs.slice(0, 10).map((book) => ({
            title: book.title,
            author: book.author_name ? book.author_name[0] : 'Unknown author'
        }));

        return res.status(200).json(books);
      } 

        if (!req.session.user) {
          return res.status(401).json([]);
        }

        const books = await Book.find({
          username: req.session.user.username,
        }).sort({ _id: -1 });

        return res.status(200).json(books);
      } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  if (method === 'POST') {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Pleaselog in to save books." });
    }

      const newBook = await Book.create({
        title: req.body.title,
        author: req.body.author,
        username: req.session.user.username,
      });

      return res.status(201).json({ message: 'Book saved successfully', data: newBook });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save book' });
    }
  }

  if (method === 'DELETE') {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Please log in to delete books." });
      }
    
      await Book.deleteOne({
        _id: req.query.id,
        username: req.session.user.username,
      });
  
      return res.status(200).json({ message: 'Book deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete book' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

  export default withIronSessionApiRoute(handler, sessionOptions);