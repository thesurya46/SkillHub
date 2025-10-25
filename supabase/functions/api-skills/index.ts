import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface SkillsQuery {
  category?: string;
  is_offering?: boolean;
  location_city?: string;
  skill_level?: string;
  limit?: number;
  offset?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname.endsWith('/api-skills') && req.method === 'GET') {
      const category = url.searchParams.get('category');
      const is_offering = url.searchParams.get('is_offering');
      const location_city = url.searchParams.get('location_city');
      const skill_level = url.searchParams.get('skill_level');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = supabase
        .from('skills')
        .select('id, name, description, category, is_offering, skill_level, hourly_rate_credits, created_at, profiles(id, full_name, location_city)');

      if (category) query = query.eq('category', category);
      if (is_offering !== null) query = query.eq('is_offering', is_offering === 'true');
      if (location_city) query = query.eq('profiles.location_city', location_city);
      if (skill_level) query = query.eq('skill_level', skill_level);

      query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          data,
          pagination: {
            limit,
            offset,
            total: count,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (pathname.endsWith('/api-skills/categories') && req.method === 'GET') {
      const { data, error } = await supabase
        .from('skills')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;

      const categories = [...new Set(data.map(item => item.category))];

      return new Response(
        JSON.stringify({
          success: true,
          data: categories,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Endpoint not found',
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});