import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuth } from '@clerk/clerk-react';
import React from 'react';
import type { Item, Event, ChecklistTemplate } from '../types';

interface Store {
  items: Item[];
  events: Event[];
  templates: ChecklistTemplate[];
  loading: boolean;
  error: string | null;
  userId: string | null;
  
  setUserId: (id: string | null) => void;
  
  // Items
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  
  // Events
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event>;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  
  // Templates
  addTemplate: (template: Omit<ChecklistTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      items: [],
      events: [],
      templates: [],
      loading: false,
      error: null,
      userId: null,

      setUserId: (id) => set({ userId: id }),

      addItem: (item) => {
        const newItem = {
          ...item,
          id: Date.now().toString(),
        };
        set(state => ({ items: [...state.items, newItem] }));
      },

      updateItem: (id, updates) => {
        set(state => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      deleteItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },

      addEvent: async (event) => {
        const newEvent = {
          ...event,
          id: Date.now().toString(),
          checklist: event.checklist || [],
          details: event.details || {},
          merchandise: event.merchandise || [],
          equipment: event.equipment || [],
        };
        set(state => ({ events: [...state.events, newEvent] }));
        return newEvent;
      },

      updateEvent: (event) => {
        set(state => ({
          events: state.events.map(e => e.id === event.id ? event : e),
        }));
      },

      deleteEvent: (id) => {
        set(state => ({
          events: state.events.filter(event => event.id !== id),
        }));
      },

      addTemplate: (template) => {
        const newTemplate = {
          ...template,
          id: Date.now().toString(),
        };
        set(state => ({ templates: [...state.templates, newTemplate] }));
      },

      deleteTemplate: (id) => {
        set(state => ({
          templates: state.templates.filter(template => template.id !== id),
        }));
      },
    }),
    {
      name: 'event-prep-storage',
      partialize: (state) => ({
        userId: state.userId,
        items: state.items,
        events: state.events,
        templates: state.templates,
      }),
    }
  )
);

// Hook to sync auth state with store
export function useSyncAuth() {
  const { userId } = useStore();
  const { user } = useAuth();
  
  React.useEffect(() => {
    if (user?.id !== userId) {
      useStore.getState().setUserId(user?.id || null);
    }
  }, [user, userId]);
}