// src/controllers/image-controller.js
export const handleUpload = (req, res, next) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];

    if (files.length === 0) {
      return res.status(400).json({ message: 'File should be an image file' });
    }
    const baseUrl = process.env.BASE_URL || '';

    const urls = files.map((f) => `${baseUrl}/uploads/${f.filename}`);

    return res.status(200).json({ urls });
  } catch (e) {
    return next(e);
  }
};
