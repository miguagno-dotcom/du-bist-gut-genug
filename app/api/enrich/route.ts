import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Missing name parameter" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured on server" }, { status: 500 });
  }

  // Clean the target name (e.g. "Leana Deeb (@leanadeeb)" -> "Leana Deeb")
  const cleanName = name.split(/[(@]/)[0].trim();
  const searchNameEncoded = encodeURIComponent(cleanName);

  try {
    // 1. Fetch real-time search results from DuckDuckGo (Profile searches)
    const searchUrl = `https://html.duckduckgo.com/html/?q=${searchNameEncoded}+social+media+profile+link+instagram+tiktok`;
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 1800 } // Cache for 30 mins
    });

    let searchData = "";
    if (res.ok) {
      const html = await res.text();
      
      // Parse URLs
      const urlRegex = /<a class="result__url"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
      const snippetRegex = /<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
      
      const urls: string[] = [];
      const snippets: string[] = [];
      let match;
      
      while ((match = urlRegex.exec(html)) !== null) {
        urls.push(match[1]);
      }
      while ((match = snippetRegex.exec(html)) !== null) {
        snippets.push(match[1].replace(/<[^>]+>/g, "").trim());
      }
      
      searchData = urls.map((url, i) => `Link: ${url}\nSnippet: ${snippets[i] || ""}`).join("\n\n");
    }

    // 2. Query GPT-4o to analyze search grounding data and build the profile JSON
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert social media researcher and profile enricher.
Your job is to analyze the provided search results to find the primary active social media profile for the target influencer.

Rules & Conditions:
1. Target Search: Focus on finding profiles matching the clean name. 
2. Loose Matching & Afghan Context: If the search results do not show a direct, exact-match profile URL, look for related profiles of individuals sharing the same name who have a solid foundation of followers (typically 5K+ or 10K+ followers) and who fit the profile of an **Afghan Influencer** (e.g., cricketers, models, journalists, TV hosts, digital creators, authors, or public figures connected to Afghanistan, Afghan sports, or local media).
3. Primary Profile: Prefer Instagram first, then TikTok, then YouTube, then X (Twitter), then Facebook.
4. Clean URLs: Provide direct, clean profile links (e.g., 'https://www.instagram.com/username/'). Strictly strip off redirections, search query tags, trailing punctuation (like periods, parentheses, commas), sub-pages, or scraper directories. Ensure the username matches the actual active social media handle to avoid 404 dead links.
5. Followers: Look for the current approximate follower count on the chosen platform (e.g., '150K IG', '25K TikTok').
6. Notes: Write a brief, professional note explaining why they are suitable as an Afghan influencer, their niche, and their follower foundation.
7. Format: Return ONLY a raw JSON object matching the structure below. Do not wrap in markdown code blocks or add extra explanation.

JSON Structure:
{
  "platform": "Instagram",
  "url": "https://www.instagram.com/username/",
  "followers": "500K IG",
  "notes": "Outreach notes on why they fit the campaign as an Afghan influencer."
}`
          },
          {
            role: "user",
            content: `Influencer Name: ${cleanName}\n\nSearch Grounding Data:\n${searchData || "No search results available. Suggest best guess profiles."}`
          }
        ],
        temperature: 0.2
      })
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      throw new Error(`OpenAI API failed: ${errorText}`);
    }

    const openaiData = await openaiRes.json();
    let text = openaiData.choices[0].message.content.trim();

    // Clean up code block backticks if GPT generated them anyway
    if (text.startsWith("```")) {
      const match = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
      if (match) {
        text = match[1];
      }
    }
    text = text.trim();

    const result = JSON.parse(text);

    return NextResponse.json({
      success: true,
      url: result.url || "",
      platform: result.platform || "Instagram",
      followers: result.followers || "TBD",
      notes: result.notes || ""
    });

  } catch (error: any) {
    console.error("AI Search Enrichment Error:", error);
    
    // Offline heuristic fallback on api/network failure
    const guessedUsername = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return NextResponse.json({
      success: true,
      url: `https://www.instagram.com/${guessedUsername}/`,
      platform: "Instagram",
      followers: "TBD",
      notes: `Heuristic Suggestion: Discovered profile could not be verified online. Check @${guessedUsername} on Instagram.`
    });
  }
}
