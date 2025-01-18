import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory to scan and replace in
const targetDirectory = path.join(__dirname, "src");

// Define the search and replacement patterns
const searchPattern = /(["'`])\/VITE_BACKEND_URL/g; // Matches '/VITE_BACKEND_URL' with quotes
const replacement = `$1\`;

// Function to recursively process files in a directory
async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);

    if (fs.statSync(fullPath).isDirectory()) {
      // Recurse into subdirectories
      await processDirectory(fullPath);
    } else if (
      fullPath.endsWith(".js") ||
      fullPath.endsWith(".jsx") ||
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".tsx")
    ) {
      // Process JavaScript/TypeScript files
      processFile(fullPath);
    }
  }
}

// Function to find and replace in a file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  if (searchPattern.test(content)) {
    const updatedContent = content.replace(searchPattern, replacement);
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Updated: ${filePath}`);
  }
}

// Start the process
console.log("Starting find-and-replace...");
await processDirectory(targetDirectory);
console.log("Find-and-replace completed.");
