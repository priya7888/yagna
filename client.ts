import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type UserProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  level: number;
  total_xp: number;
  streak_days: number;
  total_points: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  earned_at: string;
  points_earned: number;
};

export type LearningProgress = {
  id: string;
  user_id: string;
  module_id: number;
  module_name: string;
  progress_percentage: number;
  lessons_completed: number;
  total_lessons: number;
  last_accessed: string;
};

export type EcoAction = {
  id: string;
  user_id: string;
  item_name: string;
  amount: number;
  category: string;
  eco_points: number;
  co2_saved: number;
  created_at: string;
};

export type ExpenseEntry = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
};