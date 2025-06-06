export default function handler(req, res) {
  if (req.method === 'POST') {
    const { timestamp, coords } = req.body;
    console.log('Received location:', timestamp, coords);
    res.status(200).json({ message: 'Location received' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}