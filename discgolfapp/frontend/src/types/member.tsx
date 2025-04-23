/**
 * @author Adrian Johansen
 * @description This type defines the structure for a club member.
 * It includes properties for the member's display name, role, profile picture, and an optional position field.
 */

type Member = {
    displayName: string;
    role: string;
    profilePicture?: string | null;
    position?: string; // Nytt valgfritt fritekstfelt
  };

export default Member;
