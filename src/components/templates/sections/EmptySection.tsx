import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

interface EmptySectionProps {
  sectionName: string;
  message?: string;
}

const EmptySection: React.FC<EmptySectionProps> = ({ 
  sectionName, 
  message = "This section has no content yet" 
}) => {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-gray-400">
            <div className="w-16 h-16 bg-gray-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">{sectionName}</h3>
            <p className="text-sm opacity-75">{message}</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>Configure this section in the dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmptySection;