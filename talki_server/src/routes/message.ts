import express, {Express, Router} from 'express'
import { handleSendMessage, handleGetMessage, handleSendImage } from '../controller/message';

const router : Router = express.Router();

router.post('/', handleSendMessage);
router.post('/getMessages', handleGetMessage);
router.post('/image', handleSendImage);

export default router;