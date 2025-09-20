import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { QuizModal } from './QuizModal';
import { toast } from 'sonner@2.0.3';
import { apiService } from '../services/api';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  Lock,
  Target,
  TrendingUp,
  PiggyBank,
  Shield,
  Leaf,
  ArrowRight,
  Award,
  Users,
  Zap,
  Brain,
  Trophy,
  PlayCircle
} from 'lucide-react';

interface LearningModulesProps {
  userProfile: any;
  updateUserProfile: (updates: any) => void;
}

export function LearningModules({ userProfile, updateUserProfile }: LearningModulesProps) {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [startingLesson, setStartingLesson] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizModule, setCurrentQuizModule] = useState<any>(null);

  const modules = [
    {
      id: 1,
      title: "Financial Basics",
      description: "Learn the fundamentals of money management",
      icon: <PiggyBank className="size-6 text-blue-600" />,
      lessons: 8,
      duration: "45 min",
      difficulty: "Beginner",
      progress: 100,
      completed: true,
      xpReward: 250,
      topics: ["Budgeting Basics", "Saving Strategies", "Understanding Interest", "Banking Fundamentals"],
      participants: 1247,
      hasQuiz: true,
      quizQuestions: 12,
      averageScore: 85
    },
    {
      id: 2,
      title: "Smart Spending",
      description: "Make informed purchasing decisions",
      icon: <Target className="size-6 text-green-600" />,
      lessons: 6,
      duration: "35 min",
      difficulty: "Beginner",
      progress: 67,
      completed: false,
      xpReward: 200,
      topics: ["Needs vs Wants", "Price Comparison", "Quality Assessment", "Avoiding Impulse Buys"],
      participants: 892,
      hasQuiz: true,
      quizQuestions: 10,
      averageScore: 78
    },
    {
      id: 3,
      title: "Investment Fundamentals",
      description: "Start your investment journey safely",
      icon: <TrendingUp className="size-6 text-purple-600" />,
      lessons: 10,
      duration: "60 min",
      difficulty: "Intermediate",
      progress: 20,
      completed: false,
      xpReward: 400,
      topics: ["Types of Investments", "Risk Management", "Portfolio Basics", "Long-term Planning"],
      participants: 654,
      hasQuiz: true,
      quizQuestions: 15,
      averageScore: 72
    },
    {
      id: 4,
      title: "Sustainable Finance",
      description: "Align money with environmental values",
      icon: <Leaf className="size-6 text-green-500" />,
      lessons: 7,
      duration: "40 min",
      difficulty: "Intermediate",
      progress: 0,
      completed: false,
      xpReward: 300,
      topics: ["Green Investing", "Eco-friendly Spending", "Carbon Footprint", "Sustainable Brands"],
      participants: 423,
      hasQuiz: true,
      quizQuestions: 8,
      averageScore: 81
    },
    {
      id: 5,
      title: "Financial Security",
      description: "Protect yourself from financial risks",
      icon: <Shield className="size-6 text-red-600" />,
      lessons: 9,
      duration: "50 min",
      difficulty: "Advanced",
      progress: 0,
      completed: false,
      locked: true,
      xpReward: 450,
      topics: ["Insurance Basics", "Emergency Funds", "Identity Protection", "Fraud Prevention"],
      participants: 156,
      hasQuiz: true,
      quizQuestions: 18,
      averageScore: 68
    }
  ];

  const currentLesson = {
    title: "Understanding Credit Scores",
    description: "Learn how credit scores work and how to improve them",
    duration: "8 min",
    type: "Interactive Quiz",
    questions: 12,
    xpReward: 50,
    moduleId: 2
  };

  // Sample quiz questions for different modules
  const quizQuestions = {
    1: [ // Financial Basics
      {
        id: 1,
        question: "What is the recommended percentage of income to save each month?",
        options: ["5-10%", "10-20%", "20-30%", "30-40%"],
        correctAnswer: 1,
        explanation: "Financial experts generally recommend saving 10-20% of your income each month. This creates a good balance between current needs and future security.",
        difficulty: 'easy' as const,
        points: 25
      },
      {
        id: 2,
        question: "What is compound interest?",
        options: [
          "Interest only on the principal amount",
          "Interest on both principal and previously earned interest",
          "A type of loan interest",
          "Interest that decreases over time"
        ],
        correctAnswer: 1,
        explanation: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. This creates exponential growth over time.",
        difficulty: 'medium' as const,
        points: 35
      },
      {
        id: 3,
        question: "Which of these is NOT a good budgeting strategy?",
        options: [
          "The 50/30/20 rule",
          "Zero-based budgeting",
          "Spending first, saving what's left",
          "Envelope method"
        ],
        correctAnswer: 2,
        explanation: "Spending first and saving what's left is not a good strategy. You should prioritize saving by paying yourself first, then spending what remains.",
        difficulty: 'easy' as const,
        points: 20
      }
    ],
    2: [ // Smart Spending
      {
        id: 1,
        question: "What's the best way to avoid impulse purchases?",
        options: [
          "Shop when you're hungry",
          "Use the 24-hour rule",
          "Shop without a list",
          "Buy everything you want immediately"
        ],
        correctAnswer: 1,
        explanation: "The 24-hour rule involves waiting a day before making non-essential purchases. This helps you distinguish between wants and needs.",
        difficulty: 'easy' as const,
        points: 25
      },
      {
        id: 2,
        question: "When comparing prices, what should you consider besides the initial cost?",
        options: [
          "Only the brand name",
          "Total cost of ownership including maintenance",
          "The most expensive option is always best",
          "Only the cheapest option matters"
        ],
        correctAnswer: 1,
        explanation: "Total cost of ownership includes purchase price, maintenance, operating costs, and disposal costs. This gives you the true cost comparison.",
        difficulty: 'medium' as const,
        points: 35
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartLesson = () => {
    setStartingLesson(currentLesson.moduleId);
    setTimeout(() => {
      setStartingLesson(null);
      // Award XP for starting lesson
      const xpGained = currentLesson.xpReward;
      updateUserProfile({
        total_xp: (userProfile?.total_xp || 0) + xpGained,
        total_points: (userProfile?.total_points || 0) + xpGained
      });
      toast.success(`Lesson started! +${xpGained} XP earned!`);
      console.log('Starting lesson:', currentLesson.title);
    }, 1500);
  };

  const handleModuleAction = (module: any) => {
    if (module.locked) return;
    
    console.log(`${module.completed ? 'Reviewing' : module.progress > 0 ? 'Continuing' : 'Starting'} module:`, module.title);
    // In real app, this would navigate to the module
  };

  const handleStartQuiz = (module: any) => {
    setCurrentQuizModule(module);
    setShowQuiz(true);
  };

  const handleQuizComplete = async (score: number, xpEarned: number) => {
    try {
      // Update learning progress
      await apiService.updateLearningProgress(
        currentQuizModule.id,
        currentQuizModule.title,
        Math.min(currentQuizModule.progress + 20, 100), // Increase progress by 20%
        currentQuizModule.lessons,
        currentQuizModule.lessons
      );

      // Update user profile
      updateUserProfile({
        total_xp: (userProfile?.total_xp || 0) + xpEarned,
        total_points: (userProfile?.total_points || 0) + xpEarned
      });

      // Check for achievements
      if (score >= 90) {
        toast.success('🏆 Achievement: Quiz Master! Perfect score!');
      } else if (score >= 75) {
        toast.success('⭐ Great job on the quiz!');
      }

      setShowQuiz(false);
      setCurrentQuizModule(null);
    } catch (error) {
      console.log('Quiz completion error:', error);
      toast.error('Failed to save quiz results');
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Current Lesson Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="mb-2 flex items-center gap-2">
                {currentLesson.title}
                <Badge className="bg-white/20 text-white border-white/30">
                  NEW
                </Badge>
              </CardTitle>
              <CardDescription className="text-blue-100">
                {currentLesson.description}
              </CardDescription>
            </div>
            <div className="relative">
              <PlayCircle className="size-12 text-white hover:scale-110 transition-transform cursor-pointer" />
              <div className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                <div className="size-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {currentLesson.duration}
              </span>
              <span className="flex items-center gap-1">
                <Brain className="size-4" />
                {currentLesson.questions} questions
              </span>
              <span className="flex items-center gap-1">
                <Star className="size-4" />
                +{currentLesson.xpReward} XP
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              className="bg-white text-blue-600 hover:bg-blue-50 relative overflow-hidden"
              onClick={handleStartLesson}
              disabled={startingLesson === currentLesson.moduleId}
            >
              {startingLesson === currentLesson.moduleId ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Starting...
                </div>
              ) : (
                <>
                  <Play className="size-4 mr-2" />
                  Continue Lesson
                </>
              )}
            </Button>
            <Button 
              variant="secondary"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              onClick={() => handleStartQuiz(modules.find(m => m.id === currentLesson.moduleId))}
            >
              <Trophy className="size-4 mr-2" />
              Take Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className={`transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
              module.locked ? 'opacity-60' : ''
            } ${selectedModule === module.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}  group relative overflow-hidden`}
            onClick={() => !module.locked && setSelectedModule(module.id)}
          >
            <div className="absolute top-0 right-0 size-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-8 translate-x-8"></div>
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between mb-2">
                {module.icon}
                <div className="flex items-center gap-2">
                  {module.locked ? (
                    <Lock className="size-5 text-muted-foreground" />
                  ) : module.completed ? (
                    <CheckCircle className="size-5 text-green-600" />
                  ) : (
                    <div className="size-5" />
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="size-4" />
                  {module.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {module.duration}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="size-4 text-yellow-500" />
                  +{module.xpReward} XP
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3" />
                  {module.participants} learners
                </span>
                {module.hasQuiz && (
                  <span className="flex items-center gap-1">
                    <Brain className="size-3" />
                    {module.quizQuestions} quiz
                  </span>
                )}
              </div>

              {module.hasQuiz && !module.locked && (
                <div className="text-xs text-muted-foreground">
                  Avg. Quiz Score: <span className="text-blue-600">{module.averageScore}%</span>
                </div>
              )}

              {!module.locked && (
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 group" 
                    variant={module.completed ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleAction(module);
                    }}
                  >
                    {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                    <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {module.hasQuiz && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartQuiz(module);
                      }}
                    >
                      <Trophy className="size-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Module Details */}
      {selectedModule && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5 text-blue-600" />
              Module Topics
            </CardTitle>
            <CardDescription>
              What you'll learn in {modules.find(m => m.id === selectedModule)?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modules.find(m => m.id === selectedModule)?.topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow cursor-pointer group">
                  <CheckCircle className="size-4 text-green-600" />
                  <span className="text-sm flex-1">{topic}</span>
                  <ArrowRight className="size-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="size-5 text-yellow-600" />
                <span className="text-sm">Quiz Available</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Test your knowledge with {modules.find(m => m.id === selectedModule)?.quizQuestions} interactive questions
              </p>
              <Button 
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
                onClick={() => handleStartQuiz(modules.find(m => m.id === selectedModule))}
              >
                <Brain className="size-4 mr-2" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer group bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <div className="text-2xl group-hover:scale-110 transition-transform">24</div>
              <Zap className="size-4 text-yellow-500 ml-1" />
            </div>
            <p className="text-sm text-muted-foreground">Lessons Completed</p>
            <div className="text-xs text-blue-600 mt-1">+15 this week</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer group bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <div className="text-2xl group-hover:scale-110 transition-transform">180</div>
              <Clock className="size-4 text-blue-500 ml-1" />
            </div>
            <p className="text-sm text-muted-foreground">Minutes Learned</p>
            <div className="text-xs text-green-600 mt-1">Daily goal: 30min</div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer group bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <div className="text-2xl group-hover:scale-110 transition-transform">85%</div>
              <Target className="size-4 text-green-500 ml-1" />
            </div>
            <p className="text-sm text-muted-foreground">Quiz Average</p>
            <div className="text-xs text-purple-600 mt-1">12 quizzes taken</div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentQuizModule && (
        <QuizModal
          isOpen={showQuiz}
          onClose={() => {
            setShowQuiz(false);
            setCurrentQuizModule(null);
          }}
          onComplete={handleQuizComplete}
          moduleTitle={currentQuizModule.title}
          questions={quizQuestions[currentQuizModule.id as keyof typeof quizQuestions] || []}
        />
      )}
    </div>
  );
}