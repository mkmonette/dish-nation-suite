import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { loyaltyStorage, LoyaltySettings } from '@/lib/storage';
import { Plus, Trash2, Gift, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LoyaltyManagerProps {
  vendorId: string;
}

const LoyaltyManager: React.FC<LoyaltyManagerProps> = ({ vendorId }) => {
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);
  const [pointsPerPeso, setPointsPerPeso] = useState('1');
  const [newRule, setNewRule] = useState({ pointsRequired: '', discountAmount: '', maxRedemption: '' });

  useEffect(() => {
    loadSettings();
  }, [vendorId]);

  const loadSettings = () => {
    const loyaltySettings = loyaltyStorage.get(vendorId);
    if (loyaltySettings) {
      setSettings(loyaltySettings);
      setPointsPerPeso(loyaltySettings.pointsPerPeso.toString());
    }
  };

  const handleSaveSettings = () => {
    const data = {
      vendorId,
      pointsPerPeso: parseFloat(pointsPerPeso) || 1,
      redemptionRules: settings?.redemptionRules || [],
      isActive: settings?.isActive || false,
    };

    if (settings) {
      const updated = loyaltyStorage.update(data, vendorId);
      setSettings(updated);
    } else {
      const created = loyaltyStorage.create(data, vendorId);
      setSettings(created);
    }

    toast({
      title: "Settings saved",
      description: "Loyalty program settings have been updated.",
    });
  };

  const handleToggleActive = (active: boolean) => {
    if (settings) {
      const updated = loyaltyStorage.update({ isActive: active }, vendorId);
      setSettings(updated);
    }
  };

  const handleAddRule = () => {
    if (!newRule.pointsRequired || !newRule.discountAmount) {
      toast({
        title: "Invalid rule",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }

    const rule = {
      pointsRequired: parseInt(newRule.pointsRequired),
      discountAmount: parseFloat(newRule.discountAmount),
      maxRedemption: newRule.maxRedemption ? parseFloat(newRule.maxRedemption) : undefined,
    };

    const existingRules = settings?.redemptionRules || [];
    const updated = loyaltyStorage.update({ 
      redemptionRules: [...existingRules, rule] 
    }, vendorId);
    
    setSettings(updated);
    setNewRule({ pointsRequired: '', discountAmount: '', maxRedemption: '' });
    
    toast({
      title: "Rule added",
      description: "New redemption rule has been created.",
    });
  };

  const handleDeleteRule = (index: number) => {
    if (!settings) return;

    const updatedRules = settings.redemptionRules.filter((_, i) => i !== index);
    const updated = loyaltyStorage.update({ redemptionRules: updatedRules }, vendorId);
    setSettings(updated);

    toast({
      title: "Rule deleted",
      description: "Redemption rule has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Loyalty & Rewards</h2>
        <p className="text-muted-foreground">Manage your customer loyalty program</p>
      </div>

      {/* Program Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Loyalty Program
              </CardTitle>
              <CardDescription>
                Enable and configure your customer loyalty program
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings?.isActive || false}
                onCheckedChange={handleToggleActive}
              />
              <Badge variant={settings?.isActive ? "default" : "secondary"}>
                {settings?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pointsPerPeso">Points per Peso Spent</Label>
              <Input
                id="pointsPerPeso"
                type="number"
                step="0.1"
                min="0"
                value={pointsPerPeso}
                onChange={(e) => setPointsPerPeso(e.target.value)}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How many points customers earn per peso spent
              </p>
            </div>
          </div>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Redemption Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Redemption Rules
          </CardTitle>
          <CardDescription>
            Set how customers can redeem their points for discounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Rules */}
          {settings?.redemptionRules && settings.redemptionRules.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Current Rules</h4>
              {settings.redemptionRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {rule.pointsRequired} points = ₱{rule.discountAmount} off
                    </p>
                    {rule.maxRedemption && (
                      <p className="text-sm text-muted-foreground">
                        Max ₱{rule.maxRedemption} per order
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Rule */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Add New Rule</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="pointsRequired">Points Required</Label>
                <Input
                  id="pointsRequired"
                  type="number"
                  min="1"
                  value={newRule.pointsRequired}
                  onChange={(e) => setNewRule({ ...newRule, pointsRequired: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="discountAmount">Discount Amount (₱)</Label>
                <Input
                  id="discountAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newRule.discountAmount}
                  onChange={(e) => setNewRule({ ...newRule, discountAmount: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="maxRedemption">Max Redemption (₱)</Label>
                <Input
                  id="maxRedemption"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newRule.maxRedemption}
                  onChange={(e) => setNewRule({ ...newRule, maxRedemption: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <Button 
              onClick={handleAddRule} 
              className="mt-3"
              disabled={!newRule.pointsRequired || !newRule.discountAmount}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardContent>
      </Card>

      {!settings?.isActive && (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Enable the loyalty program to start rewarding your customers with points!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoyaltyManager;
