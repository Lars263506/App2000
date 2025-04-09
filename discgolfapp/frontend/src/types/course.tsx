export interface Course {
    _id: string;
    name: string;
    town: string;
    location: string;
    url: string;
    postCode: string;
    latitude: number;
    longitude: number;
    difficulty: string;
    familyFriendly: boolean;
    holes: number;
    reviews: Review[];
  }
  
  export interface Review {
    username: string
    rating: number
    comment: string
  }
