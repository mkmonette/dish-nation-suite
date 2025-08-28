import React, { useState } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { menuStorage, MenuItem, MenuVariation, MenuAddOn, MenuCategory, categoryStorage } from '@/lib/storage';
import { Plus, Trash2, Package, Edit, ImageIcon } from 'lucide-react';
import { validateImageFile, compressImage, getImageProcessingOptions } from '@/utils/imageUtils';

interface EnhancedMenuManagerProps {
  vendorId: string;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  onMenuUpdate: () => void;
}

const EnhancedMenuManager: React.FC<EnhancedMenuManagerProps> = ({ 
  vendorId, 
  menuItems, 
  categories,
  onMenuUpdate 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [variations, setVariations] = useState<MenuVariation[]>([]);
  const [addOns, setAddOns] = useState<MenuAddOn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleImageUpload = async (file: File) => {
    try {
      const validation = validateImageFile(file, 2);
      if (!validation.isValid) {
        toast({ title: 'Invalid image', description: validation.error, variant: 'destructive' });
        return;
      }

      const compressedImage = await compressImage(file, getImageProcessingOptions('banner'));
      setSelectedImage(compressedImage);
      toast({ title: 'Image uploaded!', description: 'Image has been processed and ready to save.' });
    } catch (error) {
      toast({ title: 'Upload failed', description: 'Failed to process image. Please try again.', variant: 'destructive' });
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    const newItem = menuStorage.create({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      image: selectedImage || undefined,
      available: true,
      variations: variations.length > 0 ? variations : undefined,
      addOns: addOns.length > 0 ? addOns : undefined,
      vendorId,
    }, vendorId);

    onMenuUpdate();
    setIsAddModalOpen(false);
    resetForm();
    toast({ title: 'Menu item added!', description: `${newItem.name} has been added to your menu.` });
    setIsLoading(false);
  };

  const handleDeleteItem = (itemId: string) => {
    const success = menuStorage.delete(itemId, vendorId);
    if (success) {
      onMenuUpdate();
      toast({ title: 'Menu item deleted', description: 'The item has been removed from your menu.' });
    }
  };

  const resetForm = () => {
    setVariations([]);
    setAddOns([]);
    setEditingItem(null);
    setSelectedImage('');
  };

  const addVariation = () => {
    const newVariation: MenuVariation = {
      id: Date.now().toString(),
      name: '',
      price: 0,
    };
    setVariations(prev => [...prev, newVariation]);
  };

  const updateVariation = (index: number, field: keyof MenuVariation, value: string | number) => {
    setVariations(prev => prev.map((variation, i) => 
      i === index ? { ...variation, [field]: value } : variation
    ));
  };

  const removeVariation = (index: number) => {
    setVariations(prev => prev.filter((_, i) => i !== index));
  };

  const addAddOn = () => {
    const newAddOn: MenuAddOn = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      required: false,
    };
    setAddOns(prev => [...prev, newAddOn]);
  };

  const updateAddOn = (index: number, field: keyof MenuAddOn, value: string | number | boolean) => {
    setAddOns(prev => prev.map((addOn, i) => 
      i === index ? { ...addOn, [field]: value } : addOn
    ));
  };

  const removeAddOn = (index: number) => {
    setAddOns(prev => prev.filter((_, i) => i !== index));
  };

  // Group menu items by category
  const categorizedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Enhanced Menu Management ({menuItems.length})</h2>
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Base Price ($)</Label>
                    <Input id="price" name="price" type="number" step="0.01" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No categories available. Please create categories first.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Product Image (Optional)</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    {selectedImage ? (
                      <div className="space-y-2">
                        <img src={selectedImage} alt="Product preview" className="h-24 w-24 object-cover rounded-lg mx-auto" />
                        <div className="flex justify-center space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => document.getElementById('product-image')?.click()}
                          >
                            Change Image
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedImage('')}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById('product-image')?.click()}
                        >
                          Upload Image
                        </Button>
                      </div>
                    )}
                    <input
                      id="product-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-2">PNG/JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Variations */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Size/Variations (Optional)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVariation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variation
                  </Button>
                </div>
                
                {variations.map((variation, index) => (
                  <Card key={variation.id} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Variation Name</Label>
                        <Input
                          value={variation.name}
                          onChange={(e) => updateVariation(index, 'name', e.target.value)}
                          placeholder="e.g., Small, Large, Extra Large"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price ($)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={variation.price}
                            onChange={(e) => updateVariation(index, 'price', parseFloat(e.target.value))}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeVariation(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Add-ons */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Add-ons (Optional)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAddOn}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Add-on
                  </Button>
                </div>
                
                {addOns.map((addOn, index) => (
                  <Card key={addOn.id} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Add-on Name</Label>
                        <Input
                          value={addOn.name}
                          onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                          placeholder="e.g., Extra Cheese, Bacon"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price ($)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={addOn.price}
                            onChange={(e) => updateAddOn(index, 'price', parseFloat(e.target.value))}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeAddOn(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Menu Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Display */}
      {menuItems.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No menu items yet. Add your first item to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(categorizedItems).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">{category}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Badge variant={item.available ? 'default' : 'secondary'}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {item.image && (
                        <div className="mb-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                      {!item.image && (
                        <div className="mb-3 w-full h-32 bg-muted rounded-md flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
                      
                      {item.variations && item.variations.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Variations:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.variations.map((variation) => (
                              <Badge key={variation.id} variant="outline" className="text-xs">
                                {variation.name} (${variation.price.toFixed(2)})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.addOns && item.addOns.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Add-ons:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.addOns.map((addOn) => (
                              <Badge key={addOn.id} variant="outline" className="text-xs">
                                {addOn.name} (+${addOn.price.toFixed(2)})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedMenuManager;