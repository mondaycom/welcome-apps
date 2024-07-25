const { open } = require("node:fs/promises");
const fs = require("node:fs");
const path = require("path");

const filesToGenerateSamples = [
  {
    componentName: "OpenItemCard",
    sourceFile: "../examples/OpenItemCard/OpenItemCard.jsx",
  },
  {
    componentName: "Confirmation",
    sourceFile: "../examples/Confirmation/Confirmation.jsx",
  },
  { componentName: "Notice", 
    sourceFile: "../examples/Notice/Notice.jsx" 
  },
  { componentName: "OpenSettingsPane", 
    sourceFile: "../examples/OpenSettingsPane/OpenSettingsPane.jsx" 
  },
  { componentName: "FilePreview", 
    sourceFile: "../examples/FilePreview/FilePreview.jsx" 
  },
  { componentName: "DeleteItem", 
    sourceFile: "../examples/DeleteItem/DeleteItem.jsx" 
  },
  { componentName: "StorageApi", 
    sourceFile: "../examples/StorageApi/StorageApi.jsx" 
  },
];

readFilesAndGenerate();

const startPattern = /@mondaycom-codesample-start/;
const endPattern = /@mondaycom-codesample-end/;
const startSkipBlockPattern = /@mondaycom-codesample-skip-block-start/;
const endSkipBlockPattern = /@mondaycom-codesample-skip-block-end/;

async function readFilesAndGenerate() {
  let finalCodeSamples = {};
  for (let component of filesToGenerateSamples) {
    const { componentName, sourceFile } = component;

    const file = await open(path.join(__dirname, sourceFile));

    let currentIndex = 0;
    let codeSample = "";
    let includeCurrentLine = false;

    for await (const line of file.readLines()) {
      if (line.match(startPattern) || line.match(endSkipBlockPattern)) {
        includeCurrentLine = true;
      } else if (line.match(endPattern) || line.match(startSkipBlockPattern)) {
        includeCurrentLine = false;
      } else if (includeCurrentLine) {
        codeSample += "\n" + line;
      }
      // eslint-disable-next-line no-unused-vars
      currentIndex++;
    }
    finalCodeSamples[componentName] = { componentName, sourceFile, codeSample };
  }
  fs.writeFile(path.join(__dirname, '../constants/codeSamples.json'), JSON.stringify(finalCodeSamples), 'utf8', (err, data) => {
    console.log(`Code samples updated in 'src/constants/codeSamples.json'`);
  });
}
