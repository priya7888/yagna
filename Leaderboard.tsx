import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { apiService } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Zap, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  Filter,
  RefreshCw,
  Flame,
  Leaf,
  BookOpen,
  DollarSign
} from 'lucide-react';

interface LeaderboardProps {
  userProfile: any;
}

export function Leaderboard({ userProfile }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('week');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadLeaderboard();
    // Auto-refresh every 30 seconds for real-time feel
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [activeTab, timeframe]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const { leaderboard } = await apiService.getLeaderboard();
      setLeaderboardData(leaderboard || mockLeaderboardData);
      setLastUpdated(new Date());
    } catch (error) {
      console.log('Leaderboard load error:', error);
      setLeaderboardData(mockLeaderboardData);
    } finally {
      setLoading(false);
    }
  };

  // Mock data with more realistic and engaging information
  const mockLeaderboardData = [
    { 
      rank: 1, 
      name: "Priya Sharma", 
      level: 12, 
      total_points: 24580, 
      user_id: "1",
      avatar: "PS",
      change: 2,
      weeklyXP: 1240,
      streak: 28,
      badges: 15,
      ecoPoints: 2450,
      lessonsCompleted: 45,
      location: "Mumbai",
      joinedDaysAgo: 45
    },
    { 
      rank: 2, 
      name: "Arjun Kumar", 
      level: 11, 
      total_points: 22340, 
      user_id: "2",
      avatar: "AK",
      change: -1,
      weeklyXP: 980,
      streak: 15,
      badges: 12,
      ecoPoints: 1980,
      lessonsCompleted: 38,
      location: "Delhi",
      joinedDaysAgo: 67
    },
    { 
      rank: 3, 
      name: "Sneha Patel", 
      level: 10, 
      total_points: 21750, 
      user_id: "3",
      avatar: "SP",
      change: 1,
      weeklyXP: 1120,
      streak: 22,
      badges: 13,
      ecoPoints: 2100,
      lessonsCompleted: 41,
      location: "Bangalore",
      joinedDaysAgo: 52
    },
    { 
      rank: 4, 
      name: "Rahul Singh", 
      level: 9, 
      total_points: 19820, 
      user_id: "4",
      avatar: "RS",
      change: 0,
      weeklyXP: 850,
      streak: 8,
      badges: 10,
      ecoPoints: 1650,
      lessonsCompleted: 35,
      location: "Pune",
      joinedDaysAgo: 38
    },
    { 
      rank: 5, 
      name: "Anita Desai", 
      level: 9, 
      total_points: 18950, 
      user_id: "5",
      avatar: "AD",
      change: 3,
      weeklyXP: 1350,
      streak: 18,
      badges: 11,
      ecoPoints: 1890,
      lessonsCompleted: 33,
      location: "Chennai",
      joinedDaysAgo: 41
    },
    { 
      rank: 6, 
      name: userProfile?.name || "You", 
      level: userProfile?.level || 7, 
      total_points: userProfile?.total_points || 15670, 
      user_id: userProfile?.user_id || "current",
      avatar: userProfile?.name?.split(' ').map((n: string) => n[0]).join('') || "YO",
      change: 1,
      weeklyXP: 720,
      streak: userProfile?.streak_days || 12,
      badges: 8,
      ecoPoints: 1250,
      lessonsCompleted: 24,
      location: "Your City",
      joinedDaysAgo: 28,
      isCurrentUser: true
    }
  ];

  const weeklyLeaders = [
    { name: "Priya Sharma", weeklyXP: 1240, change: "+2 ranks" },
    { name: "Anita Desai", weeklyXP: 1350, change: "+3 ranks" },
    { name: "Sneha Patel", weeklyXP: 1120, change: "+1 rank" },
  ];

  const categoryLeaders = {
    learning: [
      { name: "Rahul Singh", lessonsCompleted: 45, points: 1125 },
      { name: "Priya Sharma", lessonsCompleted: 42, points: 1050 },
      { name: "Sneha Patel", lessonsCompleted: 38, points: 950 },
    ],
    eco: [
      { name: "Priya Sharma", ecoPoints: 2450, co2Saved: 125 },
      { name: "Sneha Patel", ecoPoints: 2100, co2Saved: 98 },
      { name: "Anita Desai", ecoPoints: 1890, co2Saved: 87 },
    ],
    savings: [
      { name: "Arjun Kumar", savedAmount: 45000, savingsRate: 32 },
      { name: "Priya Sharma", savedAmount: 38500, savingsRate: 28 },
      { name: "Rahul Singh", savedAmount: 32000, savingsRate: 25 },
    ]
  };

  const achievements = [
    { title: "Top Performer", description: "Ranked #1 for 7 days", icon: "👑", rarity: "legendary" },
    { title: "Streak Master", description: "30-day learning streak", icon: "🔥", rarity: "epic" },
    { title: "Eco Champion", description: "Saved 100kg CO₂", icon: "🌱", rarity: "rare" },
    { title: "Quiz Master", description: "Perfect score on 10 quizzes", icon: "🧠", rarity: "uncommon" }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="size-5 text-yellow-500" />;
      case 2:
        return <Medal className="size-5 text-gray-400" />;
      case 3:
        return <Medal className="size-5 text-amber-600" />;
      default:
        return <span className="text-sm">{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="size-3 text-green-500" />;
    if (change < 0) return <ArrowDown className="size-3 text-red-500" />;
    return <Minus className="size-3 text-gray-400" />;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'uncommon': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeaderboard = leaderboardData.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Real-time Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Your Rank</CardTitle>
              <Trophy className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">#{userProfile?.rank || 6}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="size-3" />
              <span>+1 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Weekly XP</CardTitle>
              <Zap className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">720</div>
            <div className="text-xs text-purple-100">
              +85 since yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Users</CardTitle>
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">2,847</div>
            <div className="text-xs text-green-100">
              Online now
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Competition</CardTitle>
              <Target className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">Weekly</div>
            <div className="text-xs text-blue-100">
              5 days left
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-5 text-yellow-600" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-40"
                />
              </div>
              <Button variant="outline" size="sm" onClick={loadLeaderboard} disabled={loading}>
                <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-6">
          {/* Main Leaderboard */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredLeaderboard.map((user, index) => (
                  <div 
                    key={user.user_id} 
                    className={`flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors border-b last:border-b-0 ${
                      user.isCurrentUser ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center size-12">
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar and User Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="size-10">
                        <AvatarFallback className={user.isCurrentUser ? 'bg-blue-600 text-white' : ''}>
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate ${user.isCurrentUser ? 'text-blue-700' : ''}`}>
                            {user.name}
                            {user.isCurrentUser && <span className="text-xs text-blue-600 ml-1">(You)</span>}
                          </p>
                          <div className="flex items-center gap-1">
                            {getChangeIcon(user.change)}
                            {user.change !== 0 && (
                              <span className={`text-xs ${user.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(user.change)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Level {user.level}</span>
                          <span>•</span>
                          <span>{user.location}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Flame className="size-3 text-orange-500" />
                            {user.streak}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 text-right">
                      <div>
                        <p className="text-sm">{user.total_points.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Points</p>
                      </div>
                      <div>
                        <p className="text-sm">+{user.weeklyXP}</p>
                        <p className="text-xs text-muted-foreground">This Week</p>
                      </div>
                      <div>
                        <Badge variant="secondary" className="text-xs">
                          {user.badges} badges
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-green-600" />
                  Weekly Champions
                </CardTitle>
                <CardDescription>Biggest gainers this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyLeaders.map((leader, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm">{leader.name}</p>
                        <p className="text-xs text-muted-foreground">{leader.change}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">+{leader.weeklyXP} XP</p>
                      <p className="text-xs text-green-600">This week</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Challenge Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5 text-purple-600" />
                  Weekly Challenge
                </CardTitle>
                <CardDescription>Community goal progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Complete 10,000 lessons collectively</span>
                      <span className="text-sm">7,245 / 10,000</span>
                    </div>
                    <Progress value={72.45} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Save ₹1,00,000 collectively</span>
                      <span className="text-sm">₹68,500 / ₹1,00,000</span>
                    </div>
                    <Progress value={68.5} className="h-3 [&>div]:bg-green-500" />
                  </div>
                  <Badge className="w-full justify-center py-2 bg-purple-100 text-purple-800 hover:bg-purple-200">
                    🎯 Reward: 500 bonus points for all participants
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning Leaders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-5 text-blue-600" />
                  Learning Leaders
                </CardTitle>
                <CardDescription>Most lessons completed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryLeaders.learning.map((leader, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm">{leader.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{leader.lessonsCompleted}</p>
                      <p className="text-xs text-blue-600">+{leader.points} pts</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Eco Leaders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="size-5 text-green-600" />
                  Eco Champions
                </CardTitle>
                <CardDescription>Most eco points earned</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryLeaders.eco.map((leader, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="size-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm">{leader.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{leader.ecoPoints}</p>
                      <p className="text-xs text-green-600">{leader.co2Saved}kg CO₂</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Savings Leaders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="size-5 text-purple-600" />
                  Savings Masters
                </CardTitle>
                <CardDescription>Highest savings amounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryLeaders.savings.map((leader, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="size-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm">{leader.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">₹{(leader.savedAmount / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-purple-600">{leader.savingsRate}% rate</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="size-5 text-yellow-600" />
                Rare Achievements
              </CardTitle>
              <CardDescription>Special accomplishments from top performers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${getRarityColor(achievement.rarity)} hover:shadow-md transition-shadow cursor-pointer`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="text-sm">{achievement.title}</h3>
                        <p className="text-xs opacity-90">{achievement.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                      {achievement.rarity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Your Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Achievement Progress</CardTitle>
              <CardDescription>Track your progress towards rare achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Streak Master (30 days)</span>
                  <span className="text-sm">{userProfile?.streak_days || 12}/30</span>
                </div>
                <Progress value={((userProfile?.streak_days || 12) / 30) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quiz Master (10 perfect scores)</span>
                  <span className="text-sm">6/10</span>
                </div>
                <Progress value={60} className="h-2 [&>div]:bg-purple-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Eco Champion (100kg CO₂ saved)</span>
                  <span className="text-sm">45/100</span>
                </div>
                <Progress value={45} className="h-2 [&>div]:bg-green-500" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}