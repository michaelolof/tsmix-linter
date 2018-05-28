import * as fs from "fs"
import * as path from 'path';

const flags = process.argv.splice(2);

updateVersion(flags);




// -------------------------------------------------------------------------------  
function update(version: string, locationIndex: number) {
  const versionArr = version.split(".").map( str => parseInt( str) );
  let v = versionArr[locationIndex];
  v = v + 1;
  versionArr[locationIndex] = v;
  return versionArr.join(".");
}

function majorUpdate(version: string) { return update(version, 0) };

function minorUpdate(version: string) { return update(version, 1) };

function newVersion(version: string) { return update(version, 2) };

function helpLogger() {
  console.log("This program updates the version number of package.json");
  console.log("Example:")
  console.log("ts-node update-version.ts 'major' './package.json' for a major update.");
  console.log("ts-node update-version.ts 'min' '../package.json' for a minimum update.");
  console.log("ts-node update-version.ts 'new' '../package.json' for a new version.");
}

function updateVersion(flags: string[]) {
  const updateType = flags[0] || "";
  const packageJSONLocation = flags[1] || "./package.json";
  const packageJSON = require(packageJSONLocation);
  
  if (packageJSON === undefined) {
    console.log("package.json file not found")
    helpLogger();
    return "done";
  }
  
  let version = packageJSON.version as string;
  if (version === undefined) {
    console.log("Package.json version not defined in " + packageJSONLocation);
    helpLogger();
    return
  }

  switch (updateType) {
    case "major":
      version = majorUpdate(version) + "";
      break
    case "min":
      version = minorUpdate(version) + "";
      break
    case "new":
      version = newVersion(version) + "";
      break
    default:
      helpLogger();
      break
  }
  packageJSON.version = version
  const filePath = path.join( __dirname, packageJSONLocation );
  fs.closeSync(fs.openSync(filePath, "w"));
  fs.writeFile(filePath, JSON.stringify(packageJSON, null, 2 ), err => { if(err !== null ) console.log( err ) });
  return
}






