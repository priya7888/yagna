import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { apiService } from '../services/api';
import { 
  Leaf, 
  Award, 
  TrendingUp, 
  Recycle, 
  TreePine, 
  Droplets,
  Zap,
  PlusCircle,
  Star,
  Target,
  Loader2
} from 'lucide-react';

interface SustainableTrackerProps {
  userProfile: any;
  updateUserProfile: (updates: any) => void;
}

export function SustainableTracker({ userProfile, updateUserProfile }: SustainableTrackerProps) {
  const [newPurchase, setNewPurchase] = useState({ item: '', amount: '', category: '', ecoRating: 5 });
  const [addingPurchase, setAddingPurchase] = useState(false);

  // These would be calculated from backend data in a real app
  const ecoStats = {
    totalEcoPoints: userProfile?.total_points || 1250,
    monthlyGoal: 2000,
    carbonSaved: 45.2,
    treesEquivalent: 12,
    waterSaved: 1200,
    ecoRank: 'Eco Warrior'
  };

  const sustainableCategories = [
    { 
      name: 'Renewable Energy', 
      icon: <Zap className="size-4 text-yellow-500" />, 
      points: 420, 
      purchases: 3,
      impact: '15kg CO₂ saved'
    },
    { 
      name: 'Organic Food', 
      icon: <Leaf className="size-4 text-green-500" />, 
      points: 380, 
      purchases: 12,
      impact: '8kg CO₂ saved'
    },
    { 
      name: 'Eco Transport', 
      icon: <Recycle className="size-4 text-blue-500" />, 
      points: 290, 
      purchases: 8,
      impact: '12kg CO₂ saved'
    },
    { 
      name: 'Sustainable Fashion', 
      icon: <TreePine className="size-4 text-purple-500" />, 
      points: 160, 
      purchases: 2,
      impact: '5kg CO₂ saved'
    }
  ];

  const recentEcoPurchases = [
    { 
      id: 1, 
      item: 'Solar Power Bank', 
      amount: 1500, 
      ecoPoints: 50, 
      date: '2024-12-19',
      category: 'Renewable Energy',
      impact: 'Reduces electronic waste'
    },
    { 
      id: 2, 
      item: 'Organic Vegetables', 
      amount: 450, 
      ecoPoints: 25, 
      date: '2024-12-18',
      category: 'Organic Food',
      impact: 'Pesticide-free farming'
    },
    { 
      id: 3, 
      item: 'Bamboo Toothbrush Set', 
      amount: 200, 
      ecoPoints: 15, 
      date: '2024-12-17',
      category: 'Sustainable Products',
      impact: 'Biodegradable alternative'
    },
    { 
      id: 4, 
      item: 'Public Transport Pass', 
      amount: 800, 
      ecoPoints: 40, 
      date: '2024-12-16',
      category: 'Eco Transport',
      impact: 'Reduces carbon footprint'
    }
  ];

  const ecoTips = [
    { tip: 'Buy local produce to reduce transportation emissions', points: 10, action: 'Shop Local' },
    { tip: 'Choose products with minimal packaging', points: 15, action: 'Reduce Waste' },
    { tip: 'Invest in energy-efficient appliances', points: 25, action: 'Save Energy' },
    { tip: 'Support brands with sustainability certifications', points: 20, action: 'Choose Certified' }
  ];

  const rewards = [
    { name: 'Eco Beginner', description: 'First sustainable purchase', achieved: true, points: 100 },
    { name: 'Green Shopper', description: '10 eco-friendly purchases', achieved: true, points: 250 },
    { name: 'Carbon Saver', description: 'Saved 50kg CO₂', achieved: false, points: 500 },
    { name: 'Eco Champion', description: '100 sustainable actions', achieved: false, points: 1000 }
  ];

  const handleAddPurchase = async () => {
    if (newPurchase.item && newPurchase.amount && newPurchase.category) {
      setAddingPurchase(true);
      try {
        const { eco_action, eco_points } = await apiService.addEcoAction(
          newPurchase.item,
          parseFloat(newPurchase.amount),
          newPurchase.category,
          newPurchase.ecoRating
        );
        
        setNewPurchase({ item: '', amount: '', category: '', ecoRating: 5 });
        toast.success(`Eco purchase logged! +${eco_points} eco points earned!`);

        // Update user profile with new eco points
        updateUserProfile({
          total_points: (userProfile?.total_points || 0) + eco_points
        });

        // Check for achievements
        if (eco_points >= 50) {
          toast.success('🌱 Achievement: High Impact Purchase!');
        }

      } catch (error) {
        console.log('Add eco purchase error:', error);
        toast.error('Failed to log eco purchase');
      } finally {
        setAddingPurchase(false);
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleTipAction = (tip: any) => {
    // In a real app, this would provide guidance or track the action
    toast.success(`Great choice! ${tip.action} can earn you +${tip.points} eco points!`);
  };

  return (
    <div className="space-y-6">
      {/* Eco Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Eco Points</CardTitle>
              <Leaf className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">{ecoStats.totalEcoPoints.toLocaleString()}</div>
            <Progress 
              value={(ecoStats.totalEcoPoints / ecoStats.monthlyGoal) * 100} 
              className="h-2 bg-green-400/30 [&>div]:bg-white"
            />
            <p className="text-xs mt-1 text-green-100">
              {ecoStats.totalEcoPoints}/{ecoStats.monthlyGoal} monthly goal
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">CO₂ Saved</CardTitle>
              <Droplets className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">{ecoStats.carbonSaved}kg</div>
            <p className="text-xs text-blue-100">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Trees Equivalent</CardTitle>
              <TreePine className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">{ecoStats.treesEquivalent}</div>
            <p className="text-xs text-emerald-100">CO₂ absorption</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Eco Rank</CardTitle>
              <Award className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl mb-1">{ecoStats.ecoRank}</div>
            <p className="text-xs text-purple-100">Level {userProfile?.level || 7}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Sustainable Purchase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="size-5 text-green-600" />
              Log Eco Purchase
            </CardTitle>
            <CardDescription>Track your sustainable spending and earn eco points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="item">Item/Service</Label>
              <Input 
                id="item"
                placeholder="Solar charger, organic food, etc."
                value={newPurchase.item}
                onChange={(e) => setNewPurchase({ ...newPurchase, item: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input 
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newPurchase.amount}
                  onChange={(e) => setNewPurchase({ ...newPurchase, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                  value={newPurchase.category}
                  onChange={(e) => setNewPurchase({ ...newPurchase, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Organic Food">Organic Food</option>
                  <option value="Eco Transport">Eco Transport</option>
                  <option value="Sustainable Fashion">Sustainable Fashion</option>
                  <option value="Eco-friendly Products">Eco-friendly Products</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Eco Impact Rating: {newPurchase.ecoRating}/5</Label>
              <input
                type="range"
                min="1"
                max="5"
                value={newPurchase.ecoRating}
                onChange={(e) => setNewPurchase({ ...newPurchase, ecoRating: parseInt(e.target.value) })}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low Impact</span>
                <span>High Impact</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Higher ratings earn more eco points!
              </p>
            </div>
            <Button 
              onClick={handleAddPurchase} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={addingPurchase}
            >
              {addingPurchase ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Logging Purchase...
                </>
              ) : (
                <>
                  <Leaf className="size-4 mr-2" />
                  Add Eco Purchase
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Eco Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Sustainable Categories</CardTitle>
            <CardDescription>Your eco-friendly spending breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sustainableCategories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  {category.icon}
                  <div>
                    <p className="text-sm">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.impact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{category.points} pts</p>
                  <p className="text-xs text-muted-foreground">{category.purchases} purchases</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Eco Purchases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Eco Purchases</CardTitle>
          <CardDescription>Your latest sustainable spending activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEcoPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Leaf className="size-4 text-green-600" />
                  <div>
                    <p className="text-sm">{purchase.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {purchase.category} • {purchase.impact}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">₹{purchase.amount}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Star className="size-3" />
                    +{purchase.ecoPoints} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eco Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-blue-600" />
              Eco Tips
            </CardTitle>
            <CardDescription>Earn more points with these sustainable actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ecoTips.map((tip, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <div className="flex-1">
                  <p className="text-sm">{tip.tip}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600">+{tip.points} pts</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => handleTipAction(tip)}
                  >
                    {tip.action}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Eco Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5 text-yellow-600" />
              Eco Achievements
            </CardTitle>
            <CardDescription>Unlock rewards for sustainable behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rewards.map((reward) => (
              <div 
                key={reward.name} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  reward.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                } border hover:shadow-sm transition-shadow cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${reward.achieved ? '' : 'grayscale'}`}>
                    {reward.achieved ? '🏆' : '🔒'}
                  </div>
                  <div>
                    <p className={`text-sm ${reward.achieved ? 'text-green-800' : 'text-gray-600'}`}>
                      {reward.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                  </div>
                </div>
                <Badge variant={reward.achieved ? "default" : "secondary"}>
                  {reward.points} pts
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}