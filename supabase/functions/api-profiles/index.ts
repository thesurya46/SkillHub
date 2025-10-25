import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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

    if (pathname.match(/\/api-profiles\/[a-f0-9-]+$/) && req.method === 'GET') {
      const profileId = pathname.split('/').pop();

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, bio, location_city, location_state, location_country, credits, created_at')
        .eq('id', profileId)
        .single();

      if (error) throw error;

      const { data: skillsData } = await supabase
        .from('skills')
        .select('id, name, description, category, is_offering, skill_level')
        .eq('user_id', profileId);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            ...data,
            skills: skillsData || [],
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (pathname.endsWith('/api-profiles') && req.method === 'GET') {
      const location_city = url.searchParams.get('location_city');
      const location_state = url.searchParams.get('location_state');
      const location_country = url.searchParams.get('location_country');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = supabase
        .from('profiles')
        .select('id, full_name, bio, location_city, location_state, location_country, created_at', { count: 'exact' });

      if (location_city) query = query.eq('location_city', location_city);
      if (location_state) query = query.eq('location_state', location_state);
      if (location_country) query = query.eq('location_country', location_country);

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

    if (pathname.endsWith('/api-profiles/stats') && req.method === 'GET') {
      const { count: profileCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { count: skillCount } = await supabase
        .from('skills')
        .select('id', { count: 'exact', head: true });

      const { count: projectCount } = await supabase
        .from('community_projects')
        .select('id', { count: 'exact', head: true });

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            total_profiles: profileCount,
            total_skills: skillCount,
            total_projects: projectCount,
          },
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