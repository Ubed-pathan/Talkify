import express from 'express';
import {handleGetAllUsers} from '../controller/handleGetAllUsers'

const router = express.Router();

router.get('/', handleGetAllUsers);

export default router;