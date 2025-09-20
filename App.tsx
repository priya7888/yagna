import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { Dashboard } from "./components/Dashboard";
import { LearningModules } from "./components/LearningModules";
import { BudgetingTools } from "./components/BudgetingTools";
import { SustainableTracker } from "./components/SustainableTracker";
import { Leaderboard } from "./components/Leaderboard";
import { UserProfile } from "./components/UserProfile";
import { AuthModal } from "./components/AuthModal";
import { apiService } from "./services/api";
import {
  GraduationCap,
  DollarSign,
  Leaf,
  Trophy,
  User,
  BarChart3,
  LogOut,
  LogIn,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await apiService.getCurrentSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile();
      }
    } catch (error) {
      console.log("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { profile } = await apiService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.log("Profile load error:", error);
    }
  };

  const handleAuthSuccess = async () => {
    await checkAuth();
  };

  const handleSignOut = async () => {
    try {
      await apiService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.log("Sign out error:", error);
    }
  };

  const updateUserProfile = (updates: any) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading FinanceQuest...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              FinanceQuest
            </h1>
            <p className="text-muted-foreground">
              Gamified Financial Literacy & Sustainable Spending
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm">
                    {userProfile?.name || user.email}
                  </p>
                  {userProfile && (
                    <p className="text-xs text-muted-foreground">
                      Level {userProfile.level} •{" "}
                      {userProfile.total_points} pts
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                <LogIn className="size-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {user ? (
          /* Navigation Tabs */
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <BarChart3 className="size-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="learn"
                className="flex items-center gap-2"
              >
                <GraduationCap className="size-4" />
                Learn
              </TabsTrigger>
              <TabsTrigger
                value="budget"
                className="flex items-center gap-2"
              >
                <DollarSign className="size-4" />
                Budget
              </TabsTrigger>
              <TabsTrigger
                value="sustainable"
                className="flex items-center gap-2"
              >
                <Leaf className="size-4" />
                Eco-Track
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="flex items-center gap-2"
              >
                <Trophy className="size-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2"
              >
                <User className="size-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="dashboard"
              className="space-y-6"
            >
              <Dashboard
                userProfile={userProfile}
                updateUserProfile={updateUserProfile}
              />
            </TabsContent>

            <TabsContent value="learn" className="space-y-6">
              <LearningModules
                userProfile={userProfile}
                updateUserProfile={updateUserProfile}
              />
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              <BudgetingTools
                userProfile={userProfile}
                updateUserProfile={updateUserProfile}
              />
            </TabsContent>

            <TabsContent
              value="sustainable"
              className="space-y-6"
            >
              <SustainableTracker
                userProfile={userProfile}
                updateUserProfile={updateUserProfile}
              />
            </TabsContent>

            <TabsContent
              value="leaderboard"
              className="space-y-6"
            >
              <Leaderboard userProfile={userProfile} />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <UserProfile
                userProfile={userProfile}
                updateUserProfile={updateUserProfile}
              />
            </TabsContent>
          </Tabs>
        ) : (
          /* Guest View */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl mb-4">
                Start Your Financial Journey
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of learners improving their
                financial literacy through gamified lessons,
                budgeting tools, and sustainable spending
                tracking.
              </p>
              <Button
                size="lg"
                onClick={() => setShowAuthModal(true)}
              >
                Get Started Free
              </Button>

              <div className="grid grid-cols-3 gap-4 mt-8 text-sm">
                <div className="p-4 rounded-lg bg-white/50">
                  <GraduationCap className="size-6 mx-auto mb-2 text-blue-600" />
                  <p>Interactive Lessons</p>
                </div>
                <div className="p-4 rounded-lg bg-white/50">
                  <Trophy className="size-6 mx-auto mb-2 text-yellow-600" />
                  <p>Earn Achievements</p>
                </div>
                <div className="p-4 rounded-lg bg-white/50">
                  <Leaf className="size-6 mx-auto mb-2 text-green-600" />
                  <p>Eco-Friendly Goals</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>

      <Toaster position="top-right" />
    </div>
  );
}