import multer from "multer";
import path from "path";
import fs from "fs";

const makeStorage = (folder: string) => {
  const uploadDir = `uploads/${folder}/`;

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, extension);
      cb(null, baseName + '-' + uniqueSuffix + extension);
    }
  });
};

export const uploadDailyReport = multer({
  storage: makeStorage("daily-reports"),
  limits: { fileSize: 10 * 1024 * 1024 } 
});

export const uploadCompanyProof = multer({
  storage: makeStorage("company-proofs"),
  limits: { fileSize: 10 * 1024 * 1024 } 
});

export const uploadCompanyLogo = multer({
  storage: makeStorage("company-logos"),
  limits: { fileSize: 10 * 1024 * 1024 } 
});

export const uploadMissionFiles = multer({
  storage: makeStorage("missions"),
  limits: { fileSize: 10 * 1024 * 1024 } 
});

export const uploadProfilePhoto = multer({
  storage: makeStorage("profile-photos"),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});
