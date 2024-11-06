import React from 'react';
import { Calendar, Clock, CheckSquare, Users, MapPin, Music } from 'lucide-react';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const completedItems = event.checklist.filter(item => item.completed).length;
  const totalItems = event.checklist.length;
  const progress = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getEventTypeIcon = () => {
    switch (event.type) {
      case 'concert':
        return 'bg-purple-100 text-purple-800';
      case 'exhibition':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'festival':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-indigo-100 text-indigo-800';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeIcon()}`}>
            {event.type}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatTime(event.date)}</span>
          </div>
          {event.venue && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.venue}</span>
            </div>
          )}
          {event.artists && event.artists.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Music className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.artists.length} artists</span>
            </div>
          )}
          {event.expectedAttendees && (
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.expectedAttendees} expected</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <CheckSquare className="w-4 h-4 mr-2" />
            <span className="text-sm">{completedItems} of {totalItems} items complete</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {event.details?.ticketing?.price && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tickets from</span>
              <span className="font-medium text-gray-900">
                ${event.details.ticketing.price.toFixed(2)}
              </span>
            </div>
            {event.details.ticketing.capacity && (
              <div className="mt-1 text-xs text-gray-500">
                Capacity: {event.details.ticketing.capacity} people
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}