import express, {Router} from 'express'
import { handleGetContactedUser } from '../controller/getContactedUser';

const router: Router = express.Router();

router.get('/', handleGetContactedUser);

export default router;

