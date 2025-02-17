import express, {Express} from 'express';
import {handleAddProfileImage} from '../controller/addProfileImage';

const router = express.Router();

router.post('/', handleAddProfileImage);

export default router;