// import { apiEndpoints, blurPlaceholder, read_access_token } from "globals/constants";

// pages/api/videos.m3u8.js
export default async function handler(req, res) {
  // const { id } = req.query;
  // const listId = id.split("-")[0];
  const authToken = (req.headers.authorization || '').split("Bearer ").at(1)
  if (authToken && authToken === "eyJhbGciOiJQQkVTMi1IUzI1NitBMTI4S1ciLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwicDJjIjo2MDAwMDAsInAycyI6IjkyV01ta2g4NXZNdWd2Mk5iMTNiaXcifQ.VOUW7aFpLq2CDyFSRr2RVw_Tcr2QVOEIDS0RauXxQ8kNAj3iEw0Skg.mbhANlSHgILBdzzhhbmjNw.NRCLC9XWA8VzYdbFBZtInBNxH087tyVycg1d4T9xydaJD8uRR6dt5nQZxVljGgYCE5ez1EO_kOf5Kh3I2g2RtxC-S2_AoZwMsA-XIB-n2zZsfaMf8oGyG-nc9sG96taGYEfQYk19OUn4sr8_uxALp_I1MJIDWrndwKYTXhqBEq-f8-jfIELfP0gG4xLCUf9FCCX35O9DOhUV4X7OZaO6Wn9y_MT4I2WoYhz-xJ2SY4QYv7xpme3sK4GegmdS6KI8v15RBC_NKM0OQ1DFSd5ZpQn5wVzeTh8UNsZMXh012vlq-3TnzYZhtjpN1oePBujGfvrWHDOoTWLrq9VJafp35AMgeBskvhWtsQJIYsS6z-OFrv1WyFrOU7Atrw0cZ_V0kYasHsfJ-UuEfiauzSvw77tea90FOzGqV-81Ft_9HGAlLo26EZY3PwBMpw_9ZbA2180PKzDMcE2MCmr15mygOcT8mO-eAgBAX2SHpTmrYg9ragDJOQGUEB89HDtB-9s9MiHYPBTP_5wd8Dseo-VnCMf49c6f9rke8pwqdaGsRCsYKbGVHkZLG5T3dk6U7zHYqq40Yzbe-ymvteh1ndTgF-YGqrGrGJqLnVND8wsQLzOsYq07Bdg2Obwhm2x_31Nej5NEyv9bX2AdX3sgyXTOprFaDv4UBrxKOBrEzqCycHyF_4bPQYepCioInf01L8XXEjPhFip8tS9aMWmPkEk1pBGA8Fkql6uHO4SnyOore9M.kOdNeyVV0Tj_A8n9f5yRYw") { 
    res.status(200).json({ hello: 'world' })
  }
  
  const videos = [
    "http://localhost:8080/api/files/6kTn9p4WSMRavmv7/stream/%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B9%88%E0%B8%AD%20(2004)%20-%20S01E001.mp4?hash=95bbb2fda9eaeffdefe4cc2072957049",
    "http://localhost:8080/api/files/ap2dpajEcEfgqhHn/stream/%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B9%88%E0%B8%AD%20(2004)%20-%20S01E002.mp4?hash=95bbb2fda9eaeffdefe4cc2072957049",
    "http://localhost:8080/api/files/7UeAKQtunUOrO5gK/stream/%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B9%88%E0%B8%AD%20(2004)%20-%20S01E003.mp4?hash=95bbb2fda9eaeffdefe4cc2072957049",
    "http://localhost:8080/api/files/DoPklFDIba0oNAaA/stream/%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B9%88%E0%B8%AD%20(2004)%20-%20S01E004.mp4?hash=95bbb2fda9eaeffdefe4cc2072957049"
  ];

  const m3u8Content = `
#EXTM3U
${videos.map(video => `#EXTINF:-1,\n${video}`).join('\n')}
  `.trim();

  res.setHeader('Content-Type', 'application/x-mpegURL');
  res.status(200).send(m3u8Content);
}
