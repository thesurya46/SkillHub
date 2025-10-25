import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    if (pathname.match(/\/api-projects\/[a-f0-9-]+$/) && req.method === 'GET') {
      const projectId = pathname.split('/').pop();

      const { data, error } = await supabase
        .from('community_projects')
        .select('id, title, description, status, required_skills, estimated_credits, location_city, created_at, profiles(id, full_name)')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          data,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (pathname.endsWith('/api-projects') && req.method === 'GET') {
      const status = url.searchParams.get('status');
      const location_city = url.searchParams.get('location_city');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = supabase
        .from('community_projects')
        .select('id, title, description, status, required_skills, estimated_credits, location_city, created_at, profiles(id, full_name)', { count: 'exact' });

      if (status) query = query.eq('status', status);
      if (location_city) query = query.eq('location_city', location_city);

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

    if (pathname.endsWith('/api-projects') && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        throw new Error('Authorization header required');
      }

      const body = await req.json();
      const { title, description, required_skills, estimated_credits, location_city, creator_id } = body;

      if (!title || !description || !creator_id) {
        throw new Error('Missing required fields: title, description, creator_id');
      }

      const { data, error } = await supabase
        .from('community_projects')
        .insert({
          title,
          description,
          required_skills: required_skills || [],
          estimated_credits: estimated_credits || 0,
          location_city: location_city || '',
          creator_id,
          status: 'proposed',
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          data,
        }),
        {
          status: 201,
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