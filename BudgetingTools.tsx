import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { apiService } from '../services/api';
import { 
  PlusCircle, 
  TrendingDown, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  GamepadIcon,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface BudgetingToolsProps {
  userProfile: any;
  updateUserProfile: (updates: any) => void;
}

export function BudgetingTools({ userProfile, updateUserProfile }: BudgetingToolsProps) {
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', description: '' });
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const { expenses: userExpenses } = await apiService.getExpenses();
      setExpenses(userExpenses || []);
    } catch (error) {
      console.log('Load expenses error:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const monthlyBudget = {
    total: 25000,
    spent: expenses.reduce((sum, exp) => {
      const expDate = new Date(exp.date);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
        return sum + exp.amount;
      }
      return sum;
    }, 0),
    get remaining() { return this.total - this.spent; }
  };

  const categories = [
    { 
      name: 'Food & Dining', 
      icon: <Utensils className="size-4" />, 
      budget: 8000, 
      spent: expenses.filter(e => e.category === 'Food & Dining').reduce((sum, e) => sum + e.amount, 0), 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Transportation', 
      icon: <Car className="size-4" />, 
      budget: 5000, 
      spent: expenses.filter(e => e.category === 'Transportation').reduce((sum, e) => sum + e.amount, 0), 
      color: 'bg-green-500' 
    },
    { 
      name: 'Shopping', 
      icon: <ShoppingCart className="size-4" />, 
      budget: 4000, 
      spent: expenses.filter(e => e.category === 'Shopping').reduce((sum, e) => sum + e.amount, 0), 
      color: 'bg-purple-500' 
    },
    { 
      name: 'Housing', 
      icon: <Home className="size-4" />, 
      budget: 6000, 
      spent: expenses.filter(e => e.category === 'Housing').reduce((sum, e) => sum + e.amount, 0), 
      color: 'bg-orange-500' 
    },
    { 
      name: 'Entertainment', 
      icon: <GamepadIcon className="size-4" />, 
      budget: 2000, 
      spent: expenses.filter(e => e.category === 'Entertainment').reduce((sum, e) => sum + e.amount, 0), 
      color: 'bg-pink-500' 
    }
  ];

  const recentTransactions = expenses
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const savingsGoals = [
    { name: 'Emergency Fund', target: 50000, current: 32000, color: 'bg-red-500' },
    { name: 'Vacation Trip', target: 15000, current: 8500, color: 'bg-blue-500' },
    { name: 'New Laptop', target: 60000, current: 45000, color: 'bg-green-500' }
  ];

  const getSpendingStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'good';
  };

  const handleAddExpense = async () => {
    if (newExpense.category && newExpense.amount && newExpense.description) {
      setAddingExpense(true);
      try {
        const { expense } = await apiService.addExpense(
          newExpense.description,
          parseFloat(newExpense.amount),
          newExpense.category,
          new Date().toISOString().split('T')[0]
        );
        
        setExpenses(prev => [expense, ...prev]);
        setNewExpense({ category: '', amount: '', description: '' });
        toast.success('Expense added successfully!');

        // Award points for tracking expense
        const pointsEarned = 10;
        updateUserProfile({
          total_points: (userProfile?.total_points || 0) + pointsEarned
        });
        toast.success(`+${pointsEarned} points for tracking expense!`);

      } catch (error) {
        console.log('Add expense error:', error);
        toast.error('Failed to add expense');
      } finally {
        setAddingExpense(false);
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-6" />
            Monthly Budget Overview
          </CardTitle>
          <CardDescription className="text-green-100">
            December 2024 Budget Status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl mb-1">₹{monthlyBudget.total.toLocaleString()}</div>
              <p className="text-sm text-green-100">Total Budget</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">₹{monthlyBudget.spent.toLocaleString()}</div>
              <p className="text-sm text-green-100">Spent</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">₹{monthlyBudget.remaining.toLocaleString()}</div>
              <p className="text-sm text-green-100">Remaining</p>
            </div>
          </div>
          <Progress 
            value={(monthlyBudget.spent / monthlyBudget.total) * 100} 
            className="h-3 bg-green-400/30 [&>div]:bg-white"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Add Expense</TabsTrigger>
          <TabsTrigger value="goals">Savings Goals</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Your spending across different categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : (
                categories.map((category) => {
                  const percentage = (category.spent / category.budget) * 100;
                  const status = getSpendingStatus(category.spent, category.budget);
                  
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">₹{category.spent.toLocaleString()} / ₹{category.budget.toLocaleString()}</span>
                          {status === 'danger' && <AlertTriangle className="size-4 text-red-500" />}
                          {status === 'warning' && <AlertTriangle className="size-4 text-yellow-500" />}
                          {status === 'good' && <CheckCircle className="size-4 text-green-500" />}
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${
                          status === 'danger' ? '[&>div]:bg-red-500' : 
                          status === 'warning' ? '[&>div]:bg-yellow-500' : 
                          '[&>div]:bg-green-500'
                        }`} 
                      />
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          {/* Add Expense */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="size-5 text-blue-600" />
                Add New Expense
              </CardTitle>
              <CardDescription>Track your spending to stay within budget and earn points!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category"
                    className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input 
                    id="amount"
                    type="number" 
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description"
                    placeholder="What did you buy?"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddExpense} 
                className="w-full" 
                disabled={addingExpense}
              >
                {addingExpense ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Adding Expense...
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4 mr-2" />
                    Add Expense (+10 pts)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Savings Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Savings Goals</CardTitle>
              <CardDescription>Track your progress towards financial goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savingsGoals.map((goal) => {
                const percentage = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{goal.name}</span>
                      <span className="text-sm">₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage.toFixed(0)}% complete</span>
                      <span>₹{(goal.target - goal.current).toLocaleString()} remaining</span>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full mt-4">
                <PlusCircle className="size-4 mr-2" />
                Add New Goal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet. Add your first expense to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="size-4 text-red-600" />
                        <div>
                          <p className="text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-red-600">
                        -₹{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}