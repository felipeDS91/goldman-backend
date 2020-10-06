import path from 'path';
import fs from 'fs';
import Company from '../models/Company';
import uploadConfig from '../../config/upload';

class CompanyLogoController {
  async update(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const company = await Company.findOne({});

    if (company.logo_name) {
      const filePath = path.resolve(
        uploadConfig.uploadsFolder,
        company.logo_name
      );

      try {
        await fs.promises.unlink(filePath);
      } catch (e) {
        // console.log(e);
      }
    }

    await company.update({ logo_name: req.file.filename });

    return res.json({ logo_name: req.file.filename });
  }
}

export default new CompanyLogoController();
