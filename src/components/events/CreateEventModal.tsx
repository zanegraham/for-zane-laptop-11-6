import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Event, ChecklistTemplate } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: Omit<Event, 'id'>) => void;
}

export default function CreateEventModal({ isOpen, onClose, onCreate }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'concert' as Event['type'],
    checklist: [],
    details: {
      ticketing: {},
      promotion: {
        channels: [],
        materials: [],
        targetAudience: []
      }
    },
    budget: {
      income: {},
      expenses: {}
    }
  });

  const [templates] = useState<ChecklistTemplate[]>([
    {
      id: '1',
      name: 'Basic Concert Setup',
      type: 'concert',
      categories: ['Audio', 'Lighting'],
      items: ['1', '2'],
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const template = templates.find(t => t.id === selectedTemplate);
    const checklist = template
      ? template.items.map(itemId => ({ itemId, completed: false }))
      : [];

    onCreate({
      ...formData,
      date: new Date(formData.date),
      checklist,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input
                type="text"
                required
                className="input-primary"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Summer Indie Night"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                required
                className="input-primary"
                value={formData.type}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, type: e.target.value as Event['type'] }));
                  setSelectedTemplate('');
                }}
              >
                <option value="concert">Concert</option>
                <option value="exhibition">Exhibition</option>
                <option value="workshop">Workshop</option>
                <option value="festival">Festival</option>
                <option value="party">Party</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input
                type="datetime-local"
                required
                className="input-primary"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
              <input
                type="number"
                className="input-primary"
                min="0"
                placeholder="e.g., 100"
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  expectedAttendees: parseInt(e.target.value) 
                }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input
              type="text"
              className="input-primary"
              placeholder="e.g., The Underground Club"
              onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              className="input-primary"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">No template</option>
              {templates
                .filter(template => template.type === formData.type)
                .map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
            </select>
            {selectedTemplate && (
              <p className="mt-2 text-sm text-gray-500">
                This template includes {templates.find(t => t.id === selectedTemplate)?.items.length} items
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Setup</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-primary"
                  placeholder="e.g., 15.00"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      ticketing: {
                        ...prev.details.ticketing,
                        price: parseFloat(e.target.value)
                      }
                    }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  min="0"
                  className="input-primary"
                  placeholder="e.g., 200"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      ticketing: {
                        ...prev.details.ticketing,
                        capacity: parseInt(e.target.value)
                      }
                    }
                  }))}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}