import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-75f8bc31`;

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token || publicAnonKey;
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Auth
  async signUp(email: string, password: string, name: string) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return session;
  }

  // Profile
  async getUserProfile() {
    return this.makeRequest('/profile');
  }

  async updateUserProfile(updates: any) {
    return this.makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Learning Progress
  async updateLearningProgress(moduleId: number, moduleName: string, progressPercentage: number, lessonsCompleted: number, totalLessons: number) {
    return this.makeRequest('/learning/progress', {
      method: 'POST',
      body: JSON.stringify({
        module_id: moduleId,
        module_name: moduleName,
        progress_percentage: progressPercentage,
        lessons_completed: lessonsCompleted,
        total_lessons: totalLessons,
      }),
    });
  }

  async getLearningProgress() {
    return this.makeRequest('/learning/progress');
  }

  // Eco Actions
  async addEcoAction(itemName: string, amount: number, category: string, ecoRating: number) {
    return this.makeRequest('/eco-actions', {
      method: 'POST',
      body: JSON.stringify({
        item_name: itemName,
        amount,
        category,
        eco_rating: ecoRating,
      }),
    });
  }

  // Expenses
  async addExpense(description: string, amount: number, category: string, date: string) {
    return this.makeRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify({
        description,
        amount,
        category,
        date,
      }),
    });
  }

  async getExpenses() {
    return this.makeRequest('/expenses');
  }

  // Achievements
  async addAchievement(badgeName: string, badgeDescription: string, badgeIcon: string, pointsEarned: number) {
    return this.makeRequest('/achievements', {
      method: 'POST',
      body: JSON.stringify({
        badge_name: badgeName,
        badge_description: badgeDescription,
        badge_icon: badgeIcon,
        points_earned: pointsEarned,
      }),
    });
  }

  // Leaderboard
  async getLeaderboard() {
    return this.makeRequest('/leaderboard');
  }
}

export const apiService = new ApiService();