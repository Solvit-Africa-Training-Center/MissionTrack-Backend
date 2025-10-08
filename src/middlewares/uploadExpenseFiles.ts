import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';



const ENV = process.env.ENV || "DEV";

// Base upload directory
const baseUploadDir = "uploads/expense-logs";

// Ensure subdirectories exist
const subDirs = ["accommodation", "meals", "transport"];
subDirs.forEach((dir) => {
  const fullPath = path.join(baseUploadDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    if (file.fieldname === "accommodationFile") folder = "accommodation";
    if (file.fieldname === "mealsFile") folder = "meals";
    if (file.fieldname === "transportFile") folder = "transport";

    cb(null, path.join(baseUploadDir, folder));
  },
  filename: (req, file, cb) => {
    // Unique filename
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);

    // Clean filename
    const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, cleanName + "-" + uniqueSuffix + extension);
  },
});

// Cloudinary storage configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const cloudinaryStorage = new CloudinaryStorage({
   cloudinary,
  params: async (req, file) => {
    let folder = "others";

    if (file.fieldname === "accommodationFile") folder = "accommodation";
    if (file.fieldname === "mealsFile") folder = "meals";
    if (file.fieldname === "transportFile") folder = "transport";

   
    return {
      folder: `expense-logs/${folder}`,
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
      resource_type: 'auto',
      format: (file.mimetype === 'application/pdf') ? 'pdf' : undefined, // Convert to pdf if it's a PDF
    };
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF and image files are allowed for expense documents")
    );
  }
};

// Use Cloudinary storage in production, local storage otherwise
const storage = ENV === "PROD" ? cloudinaryStorage : localStorage;

// Allow multiple fields upload
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
}).fields([
  { name: "accommodationFile", maxCount: 1 },
  { name: "mealsFile", maxCount: 1 },
  { name: "transportFile", maxCount: 1 },
]);

export default upload;
