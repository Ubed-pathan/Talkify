import express from "express";
import {handleAddAbout} from '../controller/addAbout'

const router = express.Router();

router.post('/', handleAddAbout);

export default router;