import React, { useState } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { categoryStorage, MenuCategory } from '@/lib/storage';
import { Plus, Trash2, GripVertical, Edit } from 'lucide-react';

interface CategoryManagerProps {
  vendorId: string;
  categories: MenuCategory[];
  onCategoriesUpdate: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  vendorId, 
  categories, 
  onCategoriesUpdate 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    const newCategory = categoryStorage.create({
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      order: categories.length,
      vendorId,
    }, vendorId);

    onCategoriesUpdate();
    setIsAddModalOpen(false);
    toast({ title: 'Category added!', description: `${newCategory.name} has been created.` });
    setIsLoading(false);
  };

  const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    categoryStorage.update(editingCategory.id, {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
    }, vendorId);

    onCategoriesUpdate();
    setEditingCategory(null);
    toast({ title: 'Category updated!', description: 'Category has been updated successfully.' });
    setIsLoading(false);
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    const success = categoryStorage.delete(categoryId, vendorId);
    if (success) {
      onCategoriesUpdate();
      toast({ title: 'Category deleted', description: `${categoryName} has been removed.` });
    }
  };

  const moveCategory = (fromIndex: number, toIndex: number) => {
    const reorderedCategories = [...categories];
    const [moved] = reorderedCategories.splice(fromIndex, 1);
    reorderedCategories.splice(toIndex, 0, moved);
    
    const categoryIds = reorderedCategories.map(cat => cat.id);
    categoryStorage.reorder(vendorId, categoryIds);
    onCategoriesUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Menu Categories ({categories.length})</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" name="name" required placeholder="e.g., Appetizers, Main Courses, Desserts" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" placeholder="Brief description of this category" />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Category'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
            <p className="text-muted-foreground">No categories yet. Add your first category to organize your menu!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {categories.map((category, index) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="cursor-move">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Order: {index + 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveCategory(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="text-xs px-2 py-1"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveCategory(index, Math.min(categories.length - 1, index + 1))}
                        disabled={index === categories.length - 1}
                        className="text-xs px-2 py-1"
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                required 
                defaultValue={editingCategory?.name || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                defaultValue={editingCategory?.description || ''}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;