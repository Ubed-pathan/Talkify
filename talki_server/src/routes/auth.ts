import express, {Express} from 'express';
import { handleUserSignUp , handleUserSignIn, handleLogout} from '../controller/auth';

const router = express.Router();

router.post("/signup", handleUserSignUp);
router.post("/signin", handleUserSignIn);
router.get("/", handleLogout);

// export default for single value export and whenever in anyclass when we import it we can import via any custom name
export default router;