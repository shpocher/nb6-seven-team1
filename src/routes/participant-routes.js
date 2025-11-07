import express from 'express';
import participantController from '../controllers/participant-controller.js';

const participantRoutes = express.Router();

participantRoutes.post('/:groupId/participants', participantController.createParticipant);

participantRoutes.delete('/:groupId/participants', participantController.deleteParticipant);

export default participantRoutes;
