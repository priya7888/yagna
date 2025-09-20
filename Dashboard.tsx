import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Zap, 
  BookOpen, 
  DollarSign,
  Leaf,
  Star,
  Plus,
  ArrowRight,
  Gift,
  Calendar,
  Users,
  Activity
} from 'lucide-react';

interface DashboardProps {
  userProfile: any;
  updateUserProfile: (updates: any) => void;
}

export function Dashboard({ userProfile, updateUserProfile }: DashboardProps) {
  const [completedAction, setCompletedAction] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  const userStats = {
    level: userProfile?.level || 7,
    xp: userProfile?.total_xp || 2450,
    xpToNext: 3000,
    streak: userProfile?.streak_days || 12,
    totalPoints: userProfile?.total_points || 15670,
    completedLessons: 24,
    sustainableActions: 18,
    savedMoney: 1240
  };

  // Interactive chart data
  const weeklyProgressData = [
    { day: 'Mon', xp: 150, ecoPoints: 45, spending: 320 },
    { day: 'Tue', xp: 280, ecoPoints: 60, spending: 450 },
    { day: 'Wed', xp: 190, ecoPoints: 35, spending: 280 },
    { day: 'Thu', xp: 350, ecoPoints: 80, spending: 600 },
    { day: 'Fri', xp: 420, ecoPoints: 95, spending: 380 },
    { day: 'Sat', xp: 300, ecoPoints: 70, spending: 520 },
    { day: 'Sun', xp: 250, ecoPoints: 55, spending: 290 }
  ];

  const categorySpendingData = [
    { name: 'Food & Dining', value: 35, amount: 8750, color: '#3b82f6' },
    { name: 'Transportation', value: 20, amount: 5000, color: '#10b981' },
    { name: 'Shopping', value: 25, amount: 6250, color: '#8b5cf6' },
    { name: 'Housing', value: 15, amount: 3750, color: '#f59e0b' },
    { name: 'Entertainment', value: 5, amount: 1250, color: '#ef4444' }
  ];

  const monthlyTrends = [
    { month: 'Aug', income: 25000, expenses: 18500, savings: 6500 },
    { month: 'Sep', income: 26000, expenses: 19200, savings: 6800 },
    { month: 'Oct', income: 25500, expenses: 17800, savings: 7700 },
    { month: 'Nov', income: 27000, expenses: 20100, savings: 6900 },
    { month: 'Dec', income: 26500, expenses: 19500, savings: 7000 }
  ];

  const recentAchievements = [
    { id: 1, title: "Budget Master", description: "Created your first budget", icon: "🏆", earned: "2 days ago", clickable: true, points: 100 },
    { id: 2, title: "Eco Warrior", description: "10 sustainable purchases", icon: "🌱", earned: "1 week ago", clickable: true, points: 250 },
    { id: 3, title: "Streak Champion", description: "7-day learning streak", icon: "🔥", earned: "3 days ago", clickable: true, points: 150 }
  ];

  const weeklyGoals = [
    { id: 1, title: "Complete 3 lessons", progress: 67, current: 2, target: 3, actionable: true, reward: 100 },
    { id: 2, title: "Track daily expenses", progress: 86, current: 6, target: 7, actionable: true, reward: 50 },
    { id: 3, title: "Make 2 sustainable purchases", progress: 50, current: 1, target: 2, actionable: true, reward: 75 },
    { id: 4, title: "Save 15% of income", progress: 80, current: 12, target: 15, actionable: false, reward: 200 }
  ];

  const quickActions = [
    { id: 1, title: "Continue Learning", icon: BookOpen, color: "bg-blue-600 hover:bg-blue-700", tab: "learn", points: 25 },
    { id: 2, title: "Add Expense", icon: Plus, color: "border-purple-200 text-purple-700 hover:bg-purple-50", tab: "budget", points: 10 },
    { id: 3, title: "Log Eco Purchase", icon: Leaf, color: "border-green-200 text-green-700 hover:bg-green-50", tab: "sustainable", points: 15 }
  ];

  const upcomingChallenges = [
    { id: 1, title: "Weekend Saver Challenge", description: "Spend less than ₹1000 this weekend", reward: 200, timeLeft: "2 days", difficulty: "Medium" },
    { id: 2, title: "Green Shopping Spree", description: "Make 3 eco-friendly purchases", reward: 150, timeLeft: "5 days", difficulty: "Easy" },
    { id: 3, title: "Financial Quiz Master", description: "Score 90%+ on investment quiz", reward: 300, timeLeft: "1 week", difficulty: "Hard" }
  ];

  const handleQuickAction = (action: any) => {
    setCompletedAction(action.title);
    setTimeout(() => setCompletedAction(null), 2000);
    
    // Award points for quick actions
    updateUserProfile({
      total_points: (userProfile?.total_points || 0) + action.points
    });
    
    console.log(`Navigate to ${action.tab} tab`);
  };

  const handleAchievementClick = (achievement: any) => {
    console.log(`Showing details for ${achievement.title}`);
  };

  const handleGoalAction = (goal: any) => {
    console.log(`Taking action for goal: ${goal.title}`);
  };

  const handleChallengeJoin = (challenge: any) => {
    console.log(`Joining challenge: ${challenge.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 size-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Level</CardTitle>
              <Zap className="size-4 group-hover:animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl mb-1">{userStats.level}</div>
            <Progress 
              value={(userStats.xp / userStats.xpToNext) * 100} 
              className="h-2 bg-blue-400/30 [&>div]:bg-white"
            />
            <p className="text-xs mt-1 text-blue-100">
              {userStats.xp}/{userStats.xpToNext} XP
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 size-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Streak</CardTitle>
              <Target className="size-4 group-hover:rotate-12 transition-transform" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl mb-1">{userStats.streak} days</div>
            <p className="text-xs text-green-100">Keep it going!</p>
            <div className="flex mt-2 gap-1">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`size-2 rounded-full ${i < userStats.streak % 7 ? 'bg-white' : 'bg-green-400/50'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 size-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Total Points</CardTitle>
              <Star className="size-4 group-hover:animate-spin" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl mb-1">{userStats.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-purple-100">All-time earnings</p>
            <Badge className="mt-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
              Top 5%
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 size-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Money Saved</CardTitle>
              <TrendingUp className="size-4 group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl mb-1">₹{userStats.savedMoney}</div>
            <p className="text-xs text-orange-100">This month</p>
            <div className="text-xs mt-1 flex items-center gap-1">
              <ArrowRight className="size-3" />
              +12% vs last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5 text-blue-600" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Your learning and spending patterns</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant={timeRange === '7d' ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange('7d')}>
                  7D
                </Button>
                <Button variant={timeRange === '30d' ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange('30d')}>
                  30D
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="xp" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="ecoPoints" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-3 bg-blue-500 rounded-full"></div>
                <span>XP Earned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 bg-green-500 rounded-full"></div>
                <span>Eco Points</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending Categories Pie Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5 text-purple-600" />
              Spending Breakdown
            </CardTitle>
            <CardDescription>Where your money goes this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categorySpendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categorySpendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`₹${props.payload.amount}`, props.payload.name]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categorySpendingData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="truncate">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Financial Trends */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-green-600" />
            Financial Trends
          </CardTitle>
          <CardDescription>Income, expenses, and savings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="income" fill="#3b82f6" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="#10b981" name="Savings" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 bg-blue-500 rounded-full"></div>
              <span>Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 bg-red-500 rounded-full"></div>
              <span>Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 bg-green-500 rounded-full"></div>
              <span>Savings</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Weekly Goals */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-blue-600" />
              Weekly Goals
              <Badge variant="secondary" className="ml-auto">
                <Gift className="size-3 mr-1" />
                {weeklyGoals.reduce((sum, goal) => sum + goal.reward, 0)} pts available
              </Badge>
            </CardTitle>
            <CardDescription>Complete goals to earn rewards and build habits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="space-y-2 p-3 rounded-lg border hover:bg-muted/30 transition-colors group">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{goal.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={goal.progress === 100 ? "default" : "secondary"}>
                      {goal.current}/{goal.target}
                    </Badge>
                    <span className="text-xs text-green-600">+{goal.reward} pts</span>
                    {goal.actionable && goal.progress < 100 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleGoalAction(goal)}
                      >
                        <Plus className="size-3 mr-1" />
                        Do
                      </Button>
                    )}
                  </div>
                </div>
                <Progress value={goal.progress} className="h-2" />
                {goal.progress === 100 && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Star className="size-3" />
                    Goal completed! Reward claimed.
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Challenges */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5 text-yellow-600" />
              Upcoming Challenges
            </CardTitle>
            <CardDescription>Limited-time events with bonus rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingChallenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 hover:shadow-sm transition-shadow cursor-pointer group"
                onClick={() => handleChallengeJoin(challenge)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm">{challenge.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1 text-orange-600">
                      <Calendar className="size-3" />
                      {challenge.timeLeft} left
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <Star className="size-3" />
                      +{challenge.reward} pts
                    </span>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Achievements */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5 text-yellow-600" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Your latest accomplishments and earned rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAchievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                achievement.clickable ? 'cursor-pointer hover:bg-muted hover:shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' : 'bg-muted/50'
              }`}
              onClick={() => achievement.clickable && handleAchievementClick(achievement)}
            >
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <p className="text-sm">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  +{achievement.points} pts
                </Badge>
                <span className="text-xs text-muted-foreground">{achievement.earned}</span>
                {achievement.clickable && <ArrowRight className="size-3 text-muted-foreground" />}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Enhanced Quick Actions */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into your learning journey and earn instant points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const isCompleted = completedAction === action.title;
              
              return (
                <Button 
                  key={action.id}
                  className={`h-20 flex-col gap-2 relative overflow-hidden ${
                    action.id === 1 ? action.color : ''
                  }`}
                  variant={action.id === 1 ? "default" : "outline"}
                  onClick={() => handleQuickAction(action)}
                  disabled={isCompleted}
                >
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500 flex items-center justify-center text-white animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full bg-white flex items-center justify-center">
                          <div className="size-2 bg-green-500 rounded-full"></div>
                        </div>
                        +{action.points} pts!
                      </div>
                    </div>
                  )}
                  <Icon className="size-5" />
                  <div className="text-center">
                    <div className="text-sm">{action.title}</div>
                    <div className="text-xs opacity-70">+{action.points} points</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Daily Challenge */}
      <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="size-5" />
            Daily Challenge
            <Badge className="bg-white/20 text-white border-white/30 ml-auto">
              24h left
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg mb-1">Complete a Financial Quiz</h3>
              <p className="text-sm text-violet-100 mb-2">Test your knowledge and earn bonus XP</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="size-4" />
                  1,247 completed today
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="size-4" />
                  Double XP weekend!
                </span>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white text-purple-600 hover:bg-white/90 shadow-lg"
              onClick={() => console.log('Starting daily challenge')}
            >
              Start Challenge
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}