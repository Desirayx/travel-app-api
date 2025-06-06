export default function handler(req, res) {
  if (req.method === 'POST') {
    const { timestamp, coords, photoBase64 } = req.body;
    console.log('Received location:', timestamp, coords);

    if (photoBase64) {
      console.log('Received photo (Base64):', photoBase64.substring(0, 100) + '...');
    }

    res.status(200).json({ message: 'Location (and photo if present) received' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
