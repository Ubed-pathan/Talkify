import express, {Express, Router} from 'express'
import { handleSendMessage, handleGetMessage } from '../controller/message';

const router : Router = express.Router();

router.post('/', handleSendMessage);
router.post('/getMessages', handleGetMessage);

export default router;