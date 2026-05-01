import dbConnect from '../../db/connection'

export default async function handler(req, res) {
  try {
    await dbConnect()
    return res.status(200).json({ message: 'Connected to MongoDB' })
  } catch (error) {
    return res.status(500).json({ error: 'Connection failed' })
  }
}