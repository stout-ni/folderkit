import fs from 'node:fs';
import path from 'node:path';

const RESOURCE_EXTNAME = '.png';
const RESOURCE_DIR = path.resolve(import.meta.dirname, '../src/resources');

fs.readdirSync(RESOURCE_DIR, { recursive: true })
  .filter(
    (filePath): filePath is string =>
      path.extname(filePath as string) === RESOURCE_EXTNAME,
  )
  .forEach((filePath) => {
    const fullFilePath = path.join(RESOURCE_DIR, filePath);
    const base64 = fs.readFileSync(fullFilePath, 'base64');

    const fileName = path.basename(filePath, RESOURCE_EXTNAME);
    const bundleFilePath = path.join(
      RESOURCE_DIR,
      filePath,
      '..',
      `${fileName}.ts`,
    );

    fs.writeFileSync(bundleFilePath, `export default '${base64}';`);
  });
