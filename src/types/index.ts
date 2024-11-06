// Existing types remain...

export interface Artist {
  id: string;
  name: string;
  genre?: string;
  socialLinks?: {
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
    website?: string;
  };
  techRider?: string;
  stageLayout?: string;
  contactInfo: {
    email: string;
    phone?: string;
  };
}

export interface Performance {
  id: string;
  artistId: string;
  setTime: Date;
  duration: number; // in minutes
  requirements?: {
    audio?: string[];
    lighting?: string[];
    stage?: string[];
    other?: string[];
  };
  soundcheck?: {
    time: Date;
    duration: number;
  };
}

// Enhance Event type
export interface Event {
  id: string;
  name: string;
  date: Date;
  type: 'concert' | 'exhibition' | 'workshop' | 'festival' | 'party' | 'other';
  venue?: string;
  expectedAttendees?: number;
  checklist: {
    itemId: string;
    completed: boolean;
  }[];
  notes?: string;
  details?: {
    venueContact?: string;
    contactPhone?: string;
    loadInTime?: string;
    soundCheck?: string;
    timeline?: Record<string, string>;
    ticketing?: {
      provider?: string;
      url?: string;
      price?: number;
      capacity?: number;
      soldCount?: number;
    };
    promotion?: {
      budget?: number;
      channels?: string[];
      materials?: string[];
      targetAudience?: string[];
    };
    [key: string]: any;
  };
  artists?: Artist[];
  performances?: Performance[];
  merchandise?: MerchandiseItem[];
  equipment?: EquipmentRental[];
  budget?: {
    income: {
      tickets?: number;
      merchandise?: number;
      sponsorships?: number;
      other?: number;
    };
    expenses: {
      venue?: number;
      equipment?: number;
      marketing?: number;
      staff?: number;
      artists?: number;
      other?: number;
    };
  };
}