import express,{Router,Request,Response} from "express";
import { isAuth } from "../utils/genToken";
import { getForms,createForm,getCreateForm } from "../google_form_project/controllers/formsControllers";
const router :Router = express.Router()
router.route('/my-forms')
.get(isAuth,getForms)
export default router
router.route('/create')
.get(getCreateForm)
.post(isAuth,createForm)