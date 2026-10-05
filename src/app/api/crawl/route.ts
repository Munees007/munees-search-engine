import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Fetch HTML
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: 500 });
    }
    
    const html = await response.text();

    console.log(html)
    // 2. Load into Cheerio for parsing
    const $ = cheerio.load(html);

    // 3. Extract content
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    
    // Extract keywords
    const keywordsStr = $('meta[name="keywords"]').attr('content') || '';
    const keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k.length > 0);

    // Extract main text (simplified: grab text from body, removing scripts/styles)
    $('script, style, noscript, iframe').remove();
    const content = $('body').text().replace(/\s+/g, ' ').trim();

    // Create the index object
    const pageData = {
      url,
      title,
      description,
      content,
      keywords,
    };

    return NextResponse.json({ success: true, data: pageData });
  } catch (error) {
    console.error('Crawl Error:', error);
    return NextResponse.json({ error: 'Failed to crawl the URL' }, { status: 500 });
  }
}

