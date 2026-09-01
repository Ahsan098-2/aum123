export default async function handler(req, res) {
  // CORS Headers set karein
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // 🛠️ Aapke tools ki list (Aap URLs aur names apne hisab se badal sakte hain)
  const tools = [
    {
      name: "Image Resizer / Compressor",
      description: "Compress or resize images quickly online.",
      keywords: ["photo", "image", "pic", "size", "compress", "choti", "kam", "resize", "jpg", "png"],
      url: "/tools/image-resizer.html"
    },
    {
      name: "PDF Convertor & Merger",
      description: "Convert, merge, and edit PDF documents.",
      keywords: ["pdf", "convert", "merge", "doc", "combine", "file"],
      url: "/tools/pdf-tools.html"
    },
    {
      name: "Word Counter & Text Tools",
      description: "Count words, characters, and clean up text formatting.",
      keywords: ["word", "count", "text", "character", "length"],
      url: "/tools/word-counter.html"
    },
    {
      name: "QR Code Generator",
      description: "Generate custom QR codes for websites and text.",
      keywords: ["qr", "code", "barcode", "link", "generate", "banao"],
      url: "/tools/qr-generator.html"
    }
  ];

  const searchLower = query.toLowerCase();

  // Simple search logic
  const matchingTools = tools.filter(tool => {
    const matchName = tool.name.toLowerCase().includes(searchLower);
    const matchDesc = tool.description.toLowerCase().includes(searchLower);
    const matchKeyword = tool.keywords.some(kw => searchLower.includes(kw));

    return matchName || matchDesc || matchKeyword;
  });

  return res.status(200).json({
    results: matchingTools.slice(0, 5)
  });
}
