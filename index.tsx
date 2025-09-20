import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Initialize Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to verify user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return null;
  }
  
  return user;
}

// Routes
app.get('/make-server-75f8bc31/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Auth Routes
app.post('/make-server-75f8bc31/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm since no email server configured
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Create user profile
    if (data.user) {
      await kv.set(`profile:${data.user.id}`, {
        user_id: data.user.id,
        name,
        email,
        level: 1,
        total_xp: 0,
        streak_days: 0,
        total_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// User Profile Routes
app.get('/make-server-75f8bc31/profile', async (c) => {
  const user = await verifyUser(c.req);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const profile = await kv.get(`profile:${user.id}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put('/make-server-75f8bc31/profile', async (c) => {
  const user = await verifyUser(c.req);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const updates = await c.req.json();
    const existingProfile = await kv.get(`profile:${user.id}`);
    
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`profile:${user.id}`, updatedProfile);
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Learning Progress Routes
app.post('/make-server-75f8bc31/learning/progress', async (c) => {
  const user = await verifyUser(c.req);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const { module_id, module_name, progress_percentage, lessons_completed, total_lessons } = await c.req.json();
    
    const progressData = {
      user_id: user.id,
      module_id,
      module_name,
      progress_percentage,
      lessons_completed,
      total_lessons,
      last_accessed: new Date().toISOString()
    };
    
    await kv.set(`progress:${user.id}:${module_id}`, progressData);
    
    // Award XP for progress
    const xpGained = lessons_completed * 25; // 25 XP per lesson
    await updateUserXP(user.id, xpGained);
    
    return c.json({ progress: progressData, xp_gained: xpGained });
  } catch (error) {
    console.log('Learning progress error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/make-server-75f8bc31/learning/progress', async (c) => {
  const user = await verifyUser(c.req);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const progressData = await kv.getByPrefix(`progress:${user.id}:`);
    return c.json({ progress: progressData });
  } catch (error) {
    console.log('Get learning progress error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Eco Actions Routes
app.post('/make-server-75f8bc31/eco-actions', async (c) => {
  const user = await verifyUser(c.req);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const { item_name, amount, category, eco_rating } = await c.req.json();
    
    // Calculate eco points and CO2 saved based on category and rating
    const ecoPoints = Math.floor(eco_rating * amount * 0.1);
    const co2Saved = eco_rating * 0.5; // Simplified calculation
    
    const ecoAction = {
      id: crypto.randomUUID(),
      user_id: user.id,
      item_name,
      amount,
      category,
      eco_points: ecoPoints,
      co2_saved: co2Saved,
      created_at: new Date().toISOString()
    };
    
    await kv.set(`eco:${user.id}:${ecoAction.id}`, ecoAction);
    
    // Update user's eco stats
    await updateUserEcoStats(user.id, ecoPoints, co2Saved);
    
    return c.json({ eco_action: ecoAction, eco_points: ecoPoints });
  } catch (error) {
    console.log('Eco action error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Expenses Routes
app.post('/make-server-75f8bc31/expenses', async (c) => {
  const user = await verifyUser(c.req);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const { description, amount, category, date } = await c.req.json();
    
    const expense = {
      id: crypto.randomUUID(),
      user_id: user.id,
      description,
      amount,
      category,
      date,
      created_at: new Date().toISOString()
    };
    
    await kv.set(`expense:${user.id}:${expense.id}`, expense);
    return c.json({ expense });
  } catch (error) {
    console.log('Add expense error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/make-server-75f8bc31/expenses', async (c) => {
  const user = await verifyUser(c.req);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const expenses = await kv.getByPrefix(`expense:${user.id}:`);
    return c.json({ expenses });
  } catch (error) {
    console.log('Get expenses error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Achievements Routes
app.post('/make-server-75f8bc31/achievements', async (c) => {
  const user = await verifyUser(c.req);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const { badge_name, badge_description, badge_icon, points_earned } = await c.req.json();
    
    // Check if achievement already exists
    const existingAchievements = await kv.getByPrefix(`achievement:${user.id}:`);
    const alreadyEarned = existingAchievements.some(a => a.badge_name === badge_name);
    
    if (alreadyEarned) {
      return c.json({ error: 'Achievement already earned' }, 400);
    }
    
    const achievement = {
      id: crypto.randomUUID(),
      user_id: user.id,
      badge_name,
      badge_description,
      badge_icon,
      points_earned,
      earned_at: new Date().toISOString()
    };
    
    await kv.set(`achievement:${user.id}:${achievement.id}`, achievement);
    
    // Update user points
    await updateUserPoints(user.id, points_earned);
    
    return c.json({ achievement });
  } catch (error) {
    console.log('Add achievement error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Leaderboard Routes
app.get('/make-server-75f8bc31/leaderboard', async (c) => {
  try {
    const profiles = await kv.getByPrefix('profile:');
    
    // Sort by total points (descending)
    const leaderboard = profiles
      .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
      .slice(0, 50) // Top 50
      .map((profile, index) => ({
        rank: index + 1,
        name: profile.name,
        level: profile.level,
        total_points: profile.total_points || 0,
        user_id: profile.user_id
      }));
    
    return c.json({ leaderboard });
  } catch (error) {
    console.log('Leaderboard error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Helper functions
async function updateUserXP(userId: string, xpGained: number) {
  try {
    const profile = await kv.get(`profile:${userId}`);
    if (profile) {
      const newXP = (profile.total_xp || 0) + xpGained;
      const newLevel = Math.floor(newXP / 1000) + 1; // Level up every 1000 XP
      
      profile.total_xp = newXP;
      profile.level = newLevel;
      profile.updated_at = new Date().toISOString();
      
      await kv.set(`profile:${userId}`, profile);
    }
  } catch (error) {
    console.log('Update XP error:', error);
  }
}

async function updateUserPoints(userId: string, pointsGained: number) {
  try {
    const profile = await kv.get(`profile:${userId}`);
    if (profile) {
      profile.total_points = (profile.total_points || 0) + pointsGained;
      profile.updated_at = new Date().toISOString();
      
      await kv.set(`profile:${userId}`, profile);
    }
  } catch (error) {
    console.log('Update points error:', error);
  }
}

async function updateUserEcoStats(userId: string, ecoPoints: number, co2Saved: number) {
  try {
    const ecoStats = await kv.get(`eco_stats:${userId}`) || {
      total_eco_points: 0,
      total_co2_saved: 0,
      sustainable_purchases: 0
    };
    
    ecoStats.total_eco_points += ecoPoints;
    ecoStats.total_co2_saved += co2Saved;
    ecoStats.sustainable_purchases += 1;
    
    await kv.set(`eco_stats:${userId}`, ecoStats);
    
    // Also update user points
    await updateUserPoints(userId, ecoPoints);
  } catch (error) {
    console.log('Update eco stats error:', error);
  }
}

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

Deno.serve(app.fetch);