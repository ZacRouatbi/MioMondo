import { render } from "../preset/react.js";
export const bridgeData = {
    "workspaceFolder": "file:///c%3A/Users/Brandbox/Desktop/MioMondoHome/MioMondo",
    "serverRootDir": "",
    "previewFolderRelPath": "preview",
    "activeFileRelPath": "components/layout/Navbar.tsx",
    "mapFileRelPath": "components/layout/Navbar.tsx",
    "presetName": "react",
    "workspaceFolderName": "MioMondo"
};
export const preview = () => render(getMod);
const getMod = () => import("../../components/layout/Navbar.tsx");