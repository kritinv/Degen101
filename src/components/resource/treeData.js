import { Tree } from "./tree";
import { vs_3betcold, rfi_vs_3bet, vs_rfi, rfi, positions } from "../../data";

const treeFileRoot = new Tree("root", "root");

// RFI Folders
positions.map((position) => {
  treeFileRoot.insert("root", position, position, true);
  return null;
});
// RFI Charts
positions.map((position, index) => {
  treeFileRoot.insert(position, position + " RFI", rfi[index], false);
  return null;
});

// vs RFI Folder
positions.slice(1).map((position) => {
  treeFileRoot.insert(position, position + " vs RFI", position, true);
  return null;
});
// vs RFI Charts
positions.map((currPosition, currIndex) => {
  positions.map((vsPosition, vsIndex) => {
    if (currIndex > vsIndex) {
      treeFileRoot.insert(
        currPosition + " vs RFI",
        currPosition + " vs " + vsPosition + " RFI",
        vs_rfi[vsIndex][currIndex - vsIndex - 1],
        false
      );
    }
    return null;
  });
  return null;
});

// RFI vs 3-bet Folder
positions.slice(0, 8).map((position) => {
  treeFileRoot.insert(position, position + " RFI vs 3-bet", position, true);
  return null;
});
// RFI vs 3-bet Charts
positions.map((currPosition, currIndex) => {
  positions.map((vsPosition, vsIndex) => {
    if (vsIndex > currIndex) {
      treeFileRoot.insert(
        currPosition + " RFI vs 3-bet",
        currPosition + " RFI vs " + vsPosition + " 3-bet",
        rfi_vs_3bet[currIndex][vsIndex - currIndex - 1],
        false
      );
    }
    return null;
  });
  return null;
});

// vs 3-bet Cold Folder
positions.slice(2).map((position) => {
  treeFileRoot.insert(position, position + " vs 3-bet Cold", position, true);
  return null;
});
// vs 3-bet Cold Charts
positions.map((currPosition, currIndex) => {
  positions.slice(1, currIndex).map((vsPosition, vsIndex) => {
    treeFileRoot.insert(
      currPosition + " vs 3-bet Cold",
      currPosition + " vs " + vsPosition + " 3-bet",
      vs_3betcold[currIndex - 2],
      false
    );
    return null;
  });
  return null;
});
export default treeFileRoot;
