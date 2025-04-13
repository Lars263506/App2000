const getInvitations = async (req, res) => {
    try {
        const { userId } = req.user;
        const invitations = await invitationsService.getInvitations(userId);
        res.status(200).json(invitations);
    } catch (error) {
        console.error('Error fetching invitations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const addInvitation = async (req, res) => {
    try {
        const { userId } = req.user;
        const { email, clubId } = req.body;
        const invitation = await invitationsService.addInvitation(userId, email, clubId);
        res.status(201).json(invitation);
    } catch (error) {
        console.error('Error adding invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteInvitation = async (req, res) => {
    try {
        const { userId } = req.user;
        const { invitationId } = req.body;
        await invitationsService.deleteInvitation(userId, invitationId);
        res.status(200).send();
    } catch (error) {
        console.error('Error deleting invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateInvitation = async (req, res) => {
    try {
        const { userId } = req.user;
        const { invitationId, status } = req.body;
        const updatedInvitation = await invitationsService.updateInvitation(userId, invitationId, status);
        res.status(200).json(updatedInvitation);
    } catch (error) {
        console.error('Error updating invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { getInvitations, addInvitation, deleteInvitation, updateInvitation };
