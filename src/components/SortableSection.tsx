import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from '@/components/ui/switch';
import { GripVertical } from 'lucide-react';
import { SectionConfig } from '@/lib/storage';

interface SortableSectionProps {
  section: SectionConfig;
  onToggle: (id: string, enabled: boolean) => void;
}

const SortableSection: React.FC<SortableSectionProps> = ({ section, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="font-medium text-sm">{section.name}</span>
      </div>
      <Switch
        checked={section.enabled}
        onCheckedChange={(checked) => onToggle(section.id, checked)}
      />
    </div>
  );
};

export default SortableSection;