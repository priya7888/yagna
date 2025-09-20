import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  User,
  Settings,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Trophy,
  Leaf,
  DollarSign,
  BookOpen,
  Edit,
  Share2,
} from "lucide-react";

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const userProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    level: 9,
    totalXP: 7240,
    nextLevelXP: 8000,
    joinDate: "March 2024",
    streak: 12,
    rank: 6,
    totalPoints: 15670,
  };

  const stats = {
    lessonsCompleted: 24,
    totalMinutesLearned: 180,
    averageQuizScore: 85,
    sustainablePurchases: 18,
    co2Saved: 45.2,
    moneySaved: 28500,
    budgetGoalsMet: 8,
    savingsRate: 25,
  };

  const badges = [
    {
      id: 1,
      name: "Quick Learner",
      description: "Completed first 5 lessons",
      icon: "🎓",
      earned: true,
      rarity: "common",
    },
    {
      id: 2,
      name: "Eco Warrior",
      description: "10 sustainable purchases",
      icon: "🌱",
      earned: true,
      rarity: "uncommon",
    },
    {
      id: 3,
      name: "Budget Master",
      description: "Met budget goals for 3 months",
      icon: "💰",
      earned: true,
      rarity: "rare",
    },
    {
      id: 4,
      name: "Streak Champion",
      description: "30-day learning streak",
      icon: "🔥",
      earned: false,
      rarity: "epic",
    },
    {
      id: 5,
      name: "Top 10",
      description: "Ranked in top 10 globally",
      icon: "👑",
      earned: false,
      rarity: "legendary",
    },
    {
      id: 6,
      name: "Carbon Saver",
      description: "Saved 100kg CO₂",
      icon: "🌍",
      earned: false,
      rarity: "rare",
    },
  ];

  const monthlyProgress = [
    {
      month: "Jan",
      lessonsCompleted: 6,
      ecoPoints: 180,
      moneySaved: 2200,
    },
    {
      month: "Feb",
      lessonsCompleted: 8,
      ecoPoints: 220,
      moneySaved: 2800,
    },
    {
      month: "Mar",
      lessonsCompleted: 10,
      ecoPoints: 280,
      moneySaved: 3200,
    },
    {
      month: "Apr",
      lessonsCompleted: 12,
      ecoPoints: 320,
      moneySaved: 3600,
    },
    {
      month: "May",
      lessonsCompleted: 15,
      ecoPoints: 380,
      moneySaved: 4100,
    },
    {
      month: "Jun",
      lessonsCompleted: 18,
      ecoPoints: 420,
      moneySaved: 4800,
    },
  ];

  const achievements = [
    {
      title: "First Budget Created",
      date: "2024-03-15",
      points: 100,
    },
    {
      title: "Completed Financial Basics",
      date: "2024-04-02",
      points: 250,
    },
    {
      title: "First Eco Purchase",
      date: "2024-04-10",
      points: 50,
    },
    {
      title: "7-Day Learning Streak",
      date: "2024-05-01",
      points: 150,
    },
    {
      title: "10 Sustainable Actions",
      date: "2024-05-15",
      points: 200,
    },
    {
      title: "Budget Goal Met",
      date: "2024-06-01",
      points: 300,
    },
  ];

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800";
      case "uncommon":
        return "bg-green-100 text-green-800";
      case "rare":
        return "bg-blue-100 text-blue-800";
      case "epic":
        return "bg-purple-100 text-purple-800";
      case "legendary":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border-4 border-white/20">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl">
                    {userProfile.name}
                  </h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="size-4" />
                  </Button>
                </div>
                <p className="text-blue-100">
                  {userProfile.email}
                </p>
                <p className="text-sm text-blue-200">
                  Member since {userProfile.joinDate}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="size-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">
                Level {userProfile.level}
              </div>
              <Progress
                value={
                  (userProfile.totalXP /
                    userProfile.nextLevelXP) *
                  100
                }
                className="h-2 bg-blue-400/30 [&>div]:bg-white mt-2"
              />
              <p className="text-xs mt-1 text-blue-100">
                {userProfile.totalXP}/{userProfile.nextLevelXP}{" "}
                XP
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                #{userProfile.rank}
              </div>
              <p className="text-sm text-blue-100">
                Global Rank
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                {userProfile.streak}
              </div>
              <p className="text-sm text-blue-100">
                Day Streak
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                {userProfile.totalPoints.toLocaleString()}
              </div>
              <p className="text-sm text-blue-100">
                Total Points
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-5 text-blue-600" />
                  Learning Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Lessons Completed
                  </span>
                  <span className="text-sm">
                    {stats.lessonsCompleted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Minutes Learned
                  </span>
                  <span className="text-sm">
                    {stats.totalMinutesLearned}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quiz Average
                  </span>
                  <span className="text-sm">
                    {stats.averageQuizScore}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Eco Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="size-5 text-green-600" />
                  Eco Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Sustainable Purchases
                  </span>
                  <span className="text-sm">
                    {stats.sustainablePurchases}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    CO₂ Saved
                  </span>
                  <span className="text-sm">
                    {stats.co2Saved}kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Eco Rank
                  </span>
                  <span className="text-sm">Eco Warrior</span>
                </div>
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="size-5 text-purple-600" />
                  Financial Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Money Saved
                  </span>
                  <span className="text-sm">
                    ₹{stats.moneySaved.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Budget Goals Met
                  </span>
                  <span className="text-sm">
                    {stats.budgetGoalsMet}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Savings Rate
                  </span>
                  <span className="text-sm">
                    {stats.savingsRate}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="size-5 text-yellow-600" />
                Badge Collection
              </CardTitle>
              <CardDescription>
                {badges.filter((b) => b.earned).length}/
                {badges.length} badges earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border transition-all ${
                      badge.earned
                        ? "bg-white border-gray-200 shadow-sm"
                        : "bg-gray-50 border-gray-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`text-3xl ${badge.earned ? "" : "grayscale"}`}
                      >
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm">
                            {badge.name}
                          </h3>
                          <Badge
                            className={getBadgeRarityColor(
                              badge.rarity,
                            )}
                          >
                            {badge.rarity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
                    {!badge.earned && (
                      <div className="mt-2">
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          Not Earned
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5 text-blue-600" />
                Monthly Progress
              </CardTitle>
              <CardDescription>
                Your learning and eco journey over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyProgress.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {month.month}
                      </span>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>
                          {month.lessonsCompleted} lessons
                        </span>
                        <span>{month.ecoPoints} eco pts</span>
                        <span>
                          ₹{month.moneySaved.toLocaleString()}{" "}
                          saved
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Progress
                        value={
                          (month.lessonsCompleted / 20) * 100
                        }
                        className="h-2"
                      />
                      <Progress
                        value={(month.ecoPoints / 500) * 100}
                        className="h-2 [&>div]:bg-green-500"
                      />
                      <Progress
                        value={(month.moneySaved / 5000) * 100}
                        className="h-2 [&>div]:bg-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-purple-600" />
                Achievement Timeline
              </CardTitle>
              <CardDescription>
                Your journey milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Trophy className="size-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {achievement.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <Star className="size-4" />+
                      {achievement.points}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}