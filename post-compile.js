import * as fs from 'fs/promises';
import * as path from 'path';

async function clearDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await fs.rm(filePath, { recursive: true, force: true });
      } else {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function main() {
  const sourceDir = 'C:/Users/Shane/OneDrive/Documents/Development/tw-client/dist';
  const targetDir =
    'C:/Users/Shane/Source/Repos/TWMainSolutionCore/ReportsWeb/wwwroot/lib/tw-client';

  try {
    await fs.mkdir(targetDir, { recursive: true });
    await clearDirectory(targetDir);

    const files = await fs.readdir(sourceDir);

    for (const file of files) {
      const sourceFilePath = path.join(sourceDir, file);
      const targetFilePath = path.join(targetDir, file);

      await fs.rename(sourceFilePath, targetFilePath);
    }

    console.log(`Files moved from ${sourceDir} to ${targetDir}.`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
