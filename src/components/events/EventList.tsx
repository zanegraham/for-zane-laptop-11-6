import React, { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import type { Event } from '../../types';
import { useStore } from '../../store';
import CreateEventModal from './CreateEventModal';
import EventCard from './EventCard';
import EventDetails from './EventDetails';

export default function EventList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { events, items, addEvent, updateEvent } = useStore();

  const handleCreateEvent = async (newEvent: Omit<Event, 'id'>) => {
    await addEvent(newEvent);
    setIsCreateModalOpen(false);
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    await updateEvent(updatedEvent);
    setSelectedEvent(updatedEvent);
  };

  if (selectedEvent) {
    return (
      <EventDetails
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
        onUpdateEvent={handleUpdateEvent}
        items={items}
      />
    );
  }

  const categorizedEvents = events.reduce((acc, event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (eventDate < now) {
      acc.past.push(event);
    } else if (eventDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) {
      acc.upcoming.push(event);
    } else {
      acc.future.push(event);
    }
    
    return acc;
  }, { upcoming: [] as Event[], future: [] as Event[], past: [] as Event[] });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize and manage your community events
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No events yet</h3>
          <p className="text-gray-500 text-center mb-4">Create your first event to start building your community</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {categorizedEvents.upcoming.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Coming Up This Week</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorizedEvents.upcoming.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </section>
          )}

          {categorizedEvents.future.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Future Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorizedEvents.future.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </section>
          )}

          {categorizedEvents.past.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                {categorizedEvents.past.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateEvent}
      />
    </div>
  );
}