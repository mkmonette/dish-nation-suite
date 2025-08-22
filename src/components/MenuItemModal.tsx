import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MenuItem, MenuVariation, MenuAddOn } from '@/lib/storage';
import { Plus, Minus } from 'lucide-react';

interface MenuItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, selectedVariation?: MenuVariation, selectedAddOns?: MenuAddOn[]) => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<MenuVariation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<MenuAddOn[]>([]);

  const handleAddOnChange = (addOn: MenuAddOn, checked: boolean) => {
    if (checked) {
      setSelectedAddOns(prev => [...prev, addOn]);
    } else {
      setSelectedAddOns(prev => prev.filter(a => a.id !== addOn.id));
    }
  };

  const calculatePrice = () => {
    let price = selectedVariation?.price || item.price;
    const addOnPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return (price + addOnPrice) * quantity;
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedVariation, selectedAddOns);
    onClose();
    // Reset form
    setQuantity(1);
    setSelectedVariation(item.variations?.[0]);
    setSelectedAddOns([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Item Description */}
          <div>
            <p className="text-muted-foreground">{item.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold text-primary">
                ${item.price.toFixed(2)}
              </span>
              <Badge variant={item.available ? 'default' : 'secondary'}>
                {item.available ? 'Available' : 'Sold Out'}
              </Badge>
            </div>
          </div>

          {/* Variations */}
          {item.variations && item.variations.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Size/Variation</h4>
              <RadioGroup 
                value={selectedVariation?.id} 
                onValueChange={(value) => {
                  const variation = item.variations?.find(v => v.id === value);
                  setSelectedVariation(variation);
                }}
              >
                {item.variations.map((variation) => (
                  <div key={variation.id} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={variation.id} id={variation.id} />
                      <Label htmlFor={variation.id} className="font-medium">
                        {variation.name}
                      </Label>
                    </div>
                    <span className="text-sm font-medium">
                      ${variation.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Add-ons */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Add-ons</h4>
              <div className="space-y-2">
                {item.addOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={addOn.id}
                        checked={selectedAddOns.some(a => a.id === addOn.id)}
                        onCheckedChange={(checked) => handleAddOnChange(addOn, checked as boolean)}
                      />
                      <Label 
                        htmlFor={addOn.id} 
                        className={`font-medium ${addOn.required ? 'text-destructive' : ''}`}
                      >
                        {addOn.name} {addOn.required && '*'}
                      </Label>
                    </div>
                    <span className="text-sm font-medium">
                      +${addOn.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h4 className="font-semibold">Quantity</h4>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-8 text-center font-semibold">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Total Price & Add to Cart */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">
                ${calculatePrice().toFixed(2)}
              </span>
            </div>
            <Button 
              variant="order"
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!item.available}
            >
              Add to Cart - ${calculatePrice().toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;