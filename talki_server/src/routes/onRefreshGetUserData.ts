import express, {Router} from 'express';
import { handleOnRefreshGetUserData } from '../controller/onRefreshGetUserData';


const router: Router = express.Router();

router.get('/', handleOnRefreshGetUserData);

export default router;
