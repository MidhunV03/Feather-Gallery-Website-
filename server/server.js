const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend: HTML + CSS + browser-side UI JavaScript
app.use(express.static(path.join(__dirname, "..", "public")));

// -----------------------------
// API helpers
// -----------------------------

async function geminiBirdInfo(birdName) {
const prompt = `
            You are an ornithology expert. 
            If the user's input "${birdName}" is NOT a bird, return exactly this string: "{}"
            If it IS a bird, return a JSON object with these fields:

            Return ONLY valid JSON.

            Bird Name: ${birdName}

            Return this format exactly.

            {
            "commonName": "",
            "scientificName": "",
            "family": "",
            "appearance": "",
            "habitat": "",
            "diet": "",
            "behavior": "",
            "lifespan": "",
            "conservationStatus": "",
            "migration": "",
            "interestingFact": "",
            "ecology": ""
            }

            Do not add markdown.
            Do not add explanation.
            Return only JSON.
            CRITICAL CONSTRAINTS:
            - "diet" must be strictly a single-word answer (e.g., "Carnivore", "Granivore", "Insectivore", or "Omnivore").
            - "habitat" must be strictly a single-word answer (e.g., "Forest", "Wetland", "Grassland", or "Marine").
            - "lifespan" must be strictly a short, concise answer representing average years (e.g., "10 years", "5-15 years", or "Unknown").
            - "appearance" must be a descriptive paragraph.
            - "ecology" must be a descriptive paragraph.
            `;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) throw new Error("Gemini returned an empty response.");

    // Be tolerant if the model accidentally wraps JSON in ```json ... ```
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    return JSON.parse(cleaned);
}

async function groqRequest(prompt) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 1,
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Groq returned an empty response.");

    return JSON.parse(content);
}

async function getUnsplashImages(birdName, count = 3, orientation = "landscape") {
    const url =
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(birdName + " bird")}` +
        `&per_page=${Math.min(Number(count) || 3, 10)}&orientation=${encodeURIComponent(orientation)}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    if (data?.results?.length) {
        return data.results.map(photo => `${photo.urls.raw}&auto=format`);
    }

    return ["https://images.unsplash.com/photo-1552728089-57bdde30beb3"];
}

const categoryFallbacks = {
    eagle: "Bald eagle",
    hawk: "Red-tailed hawk",
    falcon: "Peregrine falcon",
    owl: "Barn owl",
    vulture: "Turkey vulture",
    osprey: "Osprey",
    harrier: "Northern harrier",
    kite: "Black-winged kite",
    hummingbird: "Anna's hummingbird",
    parrot: "Rose-ringed parakeet",
    woodpecker: "Great spotted woodpecker",
    crow: "American crow",
    raven: "Common raven",
    sparrow: "House sparrow",
    pigeon: "Rock pigeon",
    dove: "Mourning dove",
    jay: "Blue jay",
    magpie: "Eurasian magpie",
    robin: "American robin",
    starling: "European starling",
    finch: "House finch",
    swallow: "Barn swallow",
    swift: "Common swift",
    kingfisher: "Common kingfisher",
    "bee-eater": "European bee-eater",
    hoopoe: "Eurasian hoopoe",
    cuckoo: "Common cuckoo",
    duck: "Mallard",
    goose: "Canada goose",
    swan: "Mute swan",
    pelican: "Brown pelican",
    gull: "Herring gull",
    tern: "Arctic tern",
    heron: "Great blue heron",
    egret: "Great egret",
    stork: "White stork",
    flamingo: "Greater flamingo",
    penguin: "Emperor penguin",
    albatross: "Wandering albatross",
    loon: "Common loon",
    cormorant: "Great cormorant",
    turkey: "Wild turkey",
    pheasant: "Common pheasant",
    quail: "Common quail",
    peacock: "Indian peafowl",
    ostrich: "Common ostrich",
    emu: "Emu"
};

async function getBirdAudio(query) {
    if (!query || typeof query !== "string") return null;

    let searchTerm = query.trim().replace(/:\d+$/, "").trim();
    if (!searchTerm) return null;

    const normalized = searchTerm.toLowerCase();
    if (categoryFallbacks[normalized]) searchTerm = categoryFallbacks[normalized];

    const queryString = `en:"${searchTerm}"`;
    const url =
        `https://xeno-canto.org/api/3/recordings` +
        `?query=${encodeURIComponent(queryString)}` +
        `&key=${encodeURIComponent(process.env.XENO_CANTO_API_KEY)}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const recording = data?.recordings?.find(
        record => record?.file && typeof record.file === "string"
    );

    if (!recording) return null;

    let audioUrl = recording.file;
    if (audioUrl.startsWith("//")) audioUrl = `https:${audioUrl}`;

    return {
        audioUrl,
        id: recording.id || "",
        species: recording.en || searchTerm,
        scientificName: recording.gen
            ? `${recording.gen} ${recording.sp || ""}`.trim()
            : "",
        recordist: recording.rec || "Unknown",
        location: recording.loc || "Unknown location",
        country: recording.cnt || "",
        quality: recording.q || "",
        duration: recording.length || "",
        type: recording.type || "",
        remarks: recording.rmk || "",
        license: recording.lic || ""
    };
}

// -----------------------------
// API routes
// -----------------------------

app.get("/api/birds/details", async (req, res) => {
    const birdName = String(req.query.name || "").trim();

    if (!birdName) {
        return res.status(400).json({ error: "Bird name is required." });
    }

    try {
        const bird = await geminiBirdInfo(birdName);

        if (!bird || Object.keys(bird).length === 0) {
            return res.json({});
        }

        const [landscapeImages, audio] = await Promise.all([
            getUnsplashImages(bird.commonName || birdName, 3, "landscape"),
            getBirdAudio(bird.scientificName || bird.commonName || birdName)
        ]);

        res.json({
            ...bird,
            images: landscapeImages,
            audio
        });
    } catch (error) {
        console.error("Bird details failed:", error.message);
        res.status(500).json({ error: "Failed to fetch bird details." });
    }
});

app.get("/api/birds/explore", async (_req, res) => {
    const prompt = `
You are an expert ornithologist.
Pick a completely random, obscure, or visually striking bird species.
DO NOT pick the Resplendent Quetzal.

Respond ONLY in valid JSON:
{
  "name": "Common Name of the Bird",
  "description": "One sentence about its unique appearance or habitat."
}
`;

    try {
        const bird = await groqRequest(prompt);
        const images = await getUnsplashImages(bird.name, 1, "landscape");

        res.json({
            ...bird,
            imageUrl: images[0]
        });
    } catch (error) {
        console.error("Explore bird failed:", error.message);
        res.json({
            name: "Resplendent Quetzal",
            description: "A striking symbol of the cloud forest.",
            imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3"
        });
    }
});

app.get("/api/birds/category", async (req, res) => {
    const category = String(req.query.category || "all").trim();

    const prompt = `
Provide a list of 6 distinct birds for the category: "${category}".
Respond ONLY in valid JSON object format:
{
  "birds": [
    {"name": "Bird Name", "description": "Short one-sentence description.", "category": "${category}"}
  ]
}
`;

    try {
        const result = await groqRequest(prompt);
        const birds = Array.isArray(result.birds) ? result.birds : [];

        const enriched = await Promise.all(
            birds.map(async bird => ({
                ...bird,
                category: bird.category || category,
                imageUrl: (await getUnsplashImages(bird.name, 1, "landscape"))[0]
            }))
        );

        res.json(enriched);
    } catch (error) {
        console.error("Category birds failed:", error.message);
        res.status(500).json({ error: "Failed to fetch category birds." });
    }
});

app.get("/api/images", async (req, res) => {
    const bird = String(req.query.bird || "").trim();
    const count = Number(req.query.count || 3);
    const orientation = String(req.query.orientation || "landscape");

    if (!bird) return res.status(400).json({ error: "Bird name is required." });

    try {
        const images = await getUnsplashImages(bird, count, orientation);
        res.json({ images });
    } catch (error) {
        console.error("Images failed:", error.message);
        res.status(500).json({ error: "Failed to fetch images." });
    }
});

app.get("/api/audio", async (req, res) => {
    const query = String(req.query.query || "").trim();
    if (!query) return res.status(400).json({ error: "Search query is required." });

    try {
        const audio = await getBirdAudio(query);
        res.json(audio);
    } catch (error) {
        console.error("Audio failed:", error.message);
        res.status(500).json({ error: "Failed to fetch audio." });
    }
});

// Friendly page routes
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/pages/:page", (req, res, next) => {
    const allowed = ["BirdMan.html", "Category.html", "Details.html", "Explore.html"];
    if (!allowed.includes(req.params.page)) return next();

    res.sendFile(path.join(__dirname, "..", "public", "pages", req.params.page));
});

// Basic health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Feather Gallery running at http://localhost:${PORT}`);
});
