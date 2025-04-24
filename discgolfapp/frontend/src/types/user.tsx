/**
 * User Type Definition
 * Represents a user with their details, including name, email, and role.
 * @author Andreas Nilsen & Ibrahim Queeum
 */
type User = {
    id: string
    displayName: string
    name: string
    email: string
    role: string
    oldEmail: string
}

export default User;
