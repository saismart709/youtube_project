import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl } = await req.json();
    
    if (!videoUrl) {
      return new Response(
        JSON.stringify({ error: 'Video URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch video data from YouTube API
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    const youtubeResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!youtubeResponse.ok) {
      console.error('YouTube API error:', await youtubeResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to fetch video data from YouTube' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const youtubeData = await youtubeResponse.json();
    
    if (!youtubeData.items || youtubeData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const video = youtubeData.items[0];
    
    // Prepare video data for AI analysis
    const videoData = {
      title: video.snippet.title,
      description: video.snippet.description,
      tags: video.snippet.tags || [],
      thumbnailUrl: video.snippet.thumbnails.high.url,
      viewCount: parseInt(video.statistics.viewCount || '0'),
      likeCount: parseInt(video.statistics.likeCount || '0'),
      commentCount: parseInt(video.statistics.commentCount || '0'),
      duration: video.contentDetails.duration,
      publishedAt: video.snippet.publishedAt,
      categoryId: video.snippet.categoryId,
      channelTitle: video.snippet.channelTitle
    };

    // Use Lovable AI to analyze the video
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const systemPrompt = `You are a YouTube video optimization expert. Analyze the provided video data and provide:
1. ADVANTAGES: List 3-5 specific things the video does well (e.g., good title structure, strong engagement metrics, effective tags)
2. DRAWBACKS: List 3-5 specific problems or areas for improvement (e.g., missing keywords, poor description, low engagement)
3. RECOMMENDATIONS: Provide 5-7 actionable recommendations with priority levels (High/Medium)

Format your response as JSON with this structure:
{
  "advantages": ["advantage 1", "advantage 2", ...],
  "drawbacks": ["drawback 1", "drawback 2", ...],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed actionable suggestion",
      "priority": "High" or "Medium",
      "icon": "FileText" or "ImageIcon" or "Tag" or "Clock" or "ThumbsUp" or "Eye"
    }
  ],
  "metrics": {
    "titleScore": 0-100,
    "thumbnailScore": 0-100,
    "descriptionScore": 0-100,
    "tagsScore": 0-100,
    "retentionScore": 0-100
  }
}

Be specific and actionable. Reference actual data from the video.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Analyze this YouTube video:\n\nTitle: ${videoData.title}\n\nDescription: ${videoData.description}\n\nTags: ${videoData.tags.join(', ')}\n\nStats:\n- Views: ${videoData.viewCount}\n- Likes: ${videoData.likeCount}\n- Comments: ${videoData.commentCount}\n- Duration: ${videoData.duration}\n- Published: ${videoData.publishedAt}\n- Channel: ${videoData.channelTitle}\n\nProvide detailed analysis with advantages, drawbacks, recommendations, and scores.` 
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to analyze video' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse AI response (extract JSON from markdown if needed)
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = aiContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        analysis = JSON.parse(aiContent);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e, 'Content:', aiContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-video function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}
