import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Skill {
  id: string;
  name: string;
  category: string;
  skill_level: string;
  is_offering: boolean;
  user_id: string;
  description?: string;
}

interface Profile {
  id: string;
  full_name: string;
  location_city?: string;
  location_state?: string;
}

function calculateSkillSimilarity(skill1: string, skill2: string): number {
  const s1 = skill1.toLowerCase().trim();
  const s2 = skill2.toLowerCase().trim();
  
  if (s1 === s2) return 1.0;
  
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  const commonWords = words1.filter(w => words2.includes(w));
  if (commonWords.length > 0) {
    return commonWords.length / Math.max(words1.length, words2.length);
  }
  
  const bigrams1 = getBigrams(s1);
  const bigrams2 = getBigrams(s2);
  const intersection = bigrams1.filter(b => bigrams2.includes(b));
  const union = [...new Set([...bigrams1, ...bigrams2])];
  
  return intersection.length / union.length;
}

function getBigrams(str: string): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.push(str.substring(i, i + 2));
  }
  return bigrams;
}

function calculateMatchScore(
  userSkills: Skill[],
  targetSkill: Skill,
  sameLocation: boolean
): number {
  let score = 0;
  
  for (const skill of userSkills) {
    const similarity = calculateSkillSimilarity(skill.name, targetSkill.name);
    
    if (similarity > 0.3) {
      score += similarity * 40;
    }
    
    if (skill.category === targetSkill.category) {
      score += 20;
    }
    
    const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const userLevel = skillLevels.indexOf(skill.skill_level);
    const targetLevel = skillLevels.indexOf(targetSkill.skill_level);
    
    if (userLevel >= targetLevel) {
      score += 15;
    } else if (userLevel === targetLevel - 1) {
      score += 10;
    }
  }
  
  if (sameLocation) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

function recommendSkillsToLearn(userSkills: Skill[], allSkills: Skill[]): any[] {
  const userCategories = new Set(userSkills.map(s => s.category));
  const userSkillNames = new Set(userSkills.map(s => s.name.toLowerCase()));
  
  const recommendations: any[] = [];
  const categoryMap = new Map<string, Skill[]>();
  
  allSkills.forEach(skill => {
    if (!categoryMap.has(skill.category)) {
      categoryMap.set(skill.category, []);
    }
    categoryMap.get(skill.category)!.push(skill);
  });
  
  userCategories.forEach(category => {
    const categorySkills = categoryMap.get(category) || [];
    categorySkills.forEach(skill => {
      if (!userSkillNames.has(skill.name.toLowerCase()) && skill.is_offering) {
        const relevanceScore = calculateSkillRelevance(userSkills, skill);
        if (relevanceScore > 30) {
          recommendations.push({
            skill,
            reason: 'Related to your existing skills',
            relevance_score: relevanceScore,
            type: 'category_match'
          });
        }
      }
    });
  });
  
  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  userSkills.forEach(userSkill => {
    const currentLevelIndex = skillLevels.indexOf(userSkill.skill_level);
    if (currentLevelIndex < skillLevels.length - 1) {
      const nextLevel = skillLevels[currentLevelIndex + 1];
      const advancedSkills = allSkills.filter(
        s => s.name.toLowerCase() === userSkill.name.toLowerCase() && 
             s.skill_level === nextLevel &&
             s.is_offering
      );
      
      advancedSkills.forEach(skill => {
        recommendations.push({
          skill,
          reason: `Level up your ${userSkill.name} skills`,
          relevance_score: 90,
          type: 'skill_progression'
        });
      });
    }
  });
  
  return recommendations
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 10);
}

function calculateSkillRelevance(userSkills: Skill[], targetSkill: Skill): number {
  let score = 0;
  
  userSkills.forEach(skill => {
    if (skill.category === targetSkill.category) {
      score += 30;
    }
    
    const similarity = calculateSkillSimilarity(skill.name, targetSkill.name);
    score += similarity * 40;
  });
  
  return Math.min(score, 100);
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

    if (pathname.endsWith('/ai-skill-matching/find-matches') && req.method === 'POST') {
      const body = await req.json();
      const { user_id, skill_ids } = body;

      if (!user_id) {
        throw new Error('user_id is required');
      }

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id, full_name, location_city, location_state')
        .eq('id', user_id)
        .single();

      const { data: userSkills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user_id);

      let targetSkills: Skill[] = [];
      if (skill_ids && skill_ids.length > 0) {
        const { data } = await supabase
          .from('skills')
          .select('*')
          .in('id', skill_ids);
        targetSkills = data || [];
      } else {
        const { data } = await supabase
          .from('skills')
          .select('*')
          .neq('user_id', user_id)
          .eq('is_offering', !userSkills?.[0]?.is_offering);
        targetSkills = data || [];
      }

      const matches: any[] = [];

      for (const targetSkill of targetSkills) {
        const { data: targetProfile } = await supabase
          .from('profiles')
          .select('id, full_name, location_city, location_state')
          .eq('id', targetSkill.user_id)
          .single();

        const sameLocation = 
          userProfile?.location_city === targetProfile?.location_city ||
          userProfile?.location_state === targetProfile?.location_state;

        const matchScore = calculateMatchScore(
          userSkills || [],
          targetSkill,
          sameLocation
        );

        if (matchScore > 40) {
          matches.push({
            skill: targetSkill,
            profile: targetProfile,
            match_score: Math.round(matchScore),
            same_location: sameLocation,
          });
        }
      }

      matches.sort((a, b) => b.match_score - a.match_score);

      return new Response(
        JSON.stringify({
          success: true,
          data: matches.slice(0, 20),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (pathname.endsWith('/ai-skill-matching/recommendations') && req.method === 'POST') {
      const body = await req.json();
      const { user_id } = body;

      if (!user_id) {
        throw new Error('user_id is required');
      }

      const { data: userSkills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user_id);

      const { data: allSkills } = await supabase
        .from('skills')
        .select('*, profiles(id, full_name, location_city)')
        .neq('user_id', user_id);

      const recommendations = recommendSkillsToLearn(userSkills || [], allSkills || []);

      return new Response(
        JSON.stringify({
          success: true,
          data: recommendations,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (pathname.endsWith('/ai-skill-matching/match-project') && req.method === 'POST') {
      const body = await req.json();
      const { project_id } = body;

      if (!project_id) {
        throw new Error('project_id is required');
      }

      const { data: project } = await supabase
        .from('community_projects')
        .select('*, profiles(location_city, location_state)')
        .eq('id', project_id)
        .single();

      if (!project) {
        throw new Error('Project not found');
      }

      const { data: allSkills } = await supabase
        .from('skills')
        .select('*, profiles(id, full_name, location_city, location_state)')
        .eq('is_offering', true);

      const matches: any[] = [];

      for (const skill of allSkills || []) {
        let matchScore = 0;

        if (project.required_skills && Array.isArray(project.required_skills)) {
          for (const requiredSkill of project.required_skills) {
            const similarity = calculateSkillSimilarity(skill.name, requiredSkill);
            matchScore += similarity * 60;
          }
        }

        const sameLocation = 
          skill.profiles?.location_city === project.profiles?.location_city ||
          skill.profiles?.location_state === project.profiles?.location_state;

        if (sameLocation) {
          matchScore += 20;
        }

        if (matchScore > 40) {
          matches.push({
            skill,
            profile: skill.profiles,
            match_score: Math.round(matchScore),
            same_location: sameLocation,
          });
        }
      }

      matches.sort((a, b) => b.match_score - a.match_score);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            project,
            matched_skills: matches.slice(0, 15),
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