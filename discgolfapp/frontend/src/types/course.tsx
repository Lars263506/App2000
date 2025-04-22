import Review from './review';

type Course = {
    id: string;
    _id: string;
    name: string;
    courseOwner: string;
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
