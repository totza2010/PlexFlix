export default function handler(req, res) {
  const { params, hash } = req.query;

  if (!hash) {
    res.status(400).json({ error: 'Hash key is missing' });
    return;
  }

  if (params.length === 1) {
    // Handle requests to /api/tv/:id
    const [id] = params;
    res.status(200).json({ tvName: id, hash: hash });
  } else if (params.length === 2) {
    // Handle requests to /api/tv/:id/:season
    const [id, season] = params;
    res.status(200).json({ tvName: id, season: season, hash: params });
  } else if (params.length === 3) {
    // Handle requests to /api/tv/:id/:season/:episode
    const [id, season, episode] = params;
    res.status(200).json({ tvName: id, season: season, episode: episode, hash: hash });
  } else {
    res.status(400).json({ error: 'Invalid request' });
  }
}
