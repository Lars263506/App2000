import Review from './review';

type Course = {
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
  export default Course;
