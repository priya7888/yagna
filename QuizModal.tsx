import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  Trophy, 
  Zap,
  ArrowRight,
  RotateCcw,
  Target
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number, xpEarned: number) => void;
  moduleTitle: string;
  questions: Question[];
}

export function QuizModal({ isOpen, onClose, onComplete, moduleTitle, questions }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [perfectAnswers, setPerfectAnswers] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (isOpen && !timerActive) {
      setTimerActive(true);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, quizCompleted]);

  const handleTimeUp = () => {
    setTimerActive(false);
    if (!quizCompleted) {
      completeQuiz();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    // Show explanation immediately after selection
    setShowExplanation(true);
    
    // Update score and streak
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + currentQuestion.points);
      setStreak(prev => prev + 1);
      if (timeLeft > 240) { // Perfect answer if answered within 1 minute
        setPerfectAnswers(prev => prev + 1);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    setTimerActive(false);
    
    // Calculate bonus points
    let bonusXP = 0;
    if (perfectAnswers === questions.length) bonusXP += 100; // Perfect quiz bonus
    if (timeLeft > 150) bonusXP += 50; // Speed bonus
    if (streak >= 3) bonusXP += 25 * streak; // Streak bonus
    
    const totalXP = score + bonusXP;
    
    setTimeout(() => {
      onComplete(score, totalXP);
      toast.success(`Quiz completed! +${totalXP} XP earned!`);
    }, 2000);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
    setQuizCompleted(false);
    setTimeLeft(300);
    setTimerActive(true);
    setScore(0);
    setStreak(0);
    setPerfectAnswers(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const percentage = (score / (questions.length * 50)) * 100; // Assuming max 50 points per question
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = () => {
    const percentage = (score / (questions.length * 50)) * 100;
    if (percentage >= 90) return { message: "Outstanding! 🌟", color: "text-green-600" };
    if (percentage >= 70) return { message: "Great job! 🎉", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Good effort! 👍", color: "text-yellow-600" };
    return { message: "Keep practicing! 💪", color: "text-red-600" };
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-yellow-600" />
            {moduleTitle} Quiz
          </DialogTitle>
          <DialogDescription>
            Test your knowledge and earn XP!
          </DialogDescription>
        </DialogHeader>

        {!quizCompleted ? (
          <div className="space-y-6">
            {/* Progress and Timer */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="text-sm">Score: {score}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="ml-4 flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className={`text-sm ${timeLeft < 60 ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Streak and Stats */}
            <div className="flex items-center gap-4">
              {streak > 0 && (
                <Badge className="bg-orange-100 text-orange-800">
                  <Zap className="size-3 mr-1" />
                  {streak} streak
                </Badge>
              )}
              {perfectAnswers > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  <Star className="size-3 mr-1" />
                  {perfectAnswers} perfect
                </Badge>
              )}
            </div>

            {currentQuestion && (
              <Card>
                <CardContent className="p-6">
                  {/* Question */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={
                        currentQuestion.difficulty === 'easy' ? 'border-green-500 text-green-700' :
                        currentQuestion.difficulty === 'medium' ? 'border-yellow-500 text-yellow-700' :
                        'border-red-500 text-red-700'
                      }>
                        {currentQuestion.difficulty}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        +{currentQuestion.points} points
                      </span>
                    </div>
                    <h3 className="text-lg mb-4">{currentQuestion.question}</h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrectOption = index === currentQuestion.correctAnswer;
                      const showResult = showExplanation;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showExplanation}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                            showResult
                              ? isCorrectOption
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : isSelected
                                ? 'border-red-500 bg-red-50 text-red-800'
                                : 'border-gray-200 bg-gray-50'
                              : isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`size-6 rounded-full border-2 flex items-center justify-center ${
                              showResult
                                ? isCorrectOption
                                  ? 'border-green-500 bg-green-500'
                                  : isSelected
                                  ? 'border-red-500 bg-red-500'
                                  : 'border-gray-300'
                                : isSelected
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {showResult && isCorrectOption && <CheckCircle className="size-4 text-white" />}
                              {showResult && isSelected && !isCorrectOption && <XCircle className="size-4 text-white" />}
                              {isSelected && !showResult && <div className="size-2 bg-white rounded-full" />}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showExplanation && (
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="size-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="size-5 text-red-600 mt-0.5" />
                        )}
                        <div>
                          <p className={`text-sm ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Button */}
                  {showExplanation && (
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex < questions.length - 1 ? (
                          <>
                            Next Question
                            <ArrowRight className="size-4 ml-2" />
                          </>
                        ) : (
                          <>
                            Complete Quiz
                            <Trophy className="size-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Results */
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <Trophy className="size-16 text-yellow-500 mx-auto" />
              <div>
                <h2 className="text-2xl mb-2">Quiz Complete!</h2>
                <p className={`text-lg ${getPerformanceMessage().color}`}>
                  {getPerformanceMessage().message}
                </p>
              </div>
            </div>

            {/* Results Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className={`text-2xl ${getScoreColor()}`}>{score}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-2xl text-green-600">{selectedAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="text-2xl text-purple-600">{perfectAnswers}</div>
                <div className="text-sm text-muted-foreground">Perfect</div>
              </div>
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <div className="text-2xl text-orange-600">{formatTime(300 - timeLeft)}</div>
                <div className="text-sm text-muted-foreground">Time Used</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              {perfectAnswers === questions.length && (
                <Badge className="px-4 py-2 bg-yellow-100 text-yellow-800">
                  🌟 Perfect Score! +100 bonus XP
                </Badge>
              )}
              {timeLeft > 150 && (
                <Badge className="px-4 py-2 bg-blue-100 text-blue-800">
                  ⚡ Speed Bonus! +50 XP
                </Badge>
              )}
              {streak >= 3 && (
                <Badge className="px-4 py-2 bg-orange-100 text-orange-800">
                  🔥 Streak Master! +{25 * streak} XP
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleRestart}>
                <RotateCcw className="size-4 mr-2" />
                Retake Quiz
              </Button>
              <Button onClick={onClose}>
                Continue Learning
                <Target className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}