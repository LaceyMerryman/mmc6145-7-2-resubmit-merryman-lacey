import dbConnect from '../../db/connection'
import Book from '../../db/models/Book'

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  if (method === 'GET') {
    try {
      if (query && query.q) {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query.q)}`);
        const data = await response.json();

        const books = data.docs.slice(0,10).map((book) => ({
            title: book.title,
            author: book.author_name ? book.author_name[0] : 'Unknown author'
        }));

        return res.status(200).json(books);
      } else {
        const books = await Book.find();
        return res.status(200).json(books);
      }

    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  if (method === 'POST') {
    try {
      const bookData = req.body;

      const newBook = await Book.create(bookData);

      return res.status(201).json({ message: 'Book saved successfully', data: newBook });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save book' });
    }
  }

  if (method === 'DELETE') {
    try {
      const { id } = req.query;
    
      await Book.findByIdAndDelete(id);
  
      return res.status(200).json({ message: 'Book deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete book' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}