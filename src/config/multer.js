import multer from "multer";

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'public/images')
    },
    filename:(req, file, cb)=>{
        cb(null, `${file.originalname}_${Date.now().getTime()}`)      
    }
})

const upload = multer({storage})

export default upload