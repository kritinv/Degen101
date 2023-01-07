class TreeNode {
  constructor(key, value = key, parent = null, isFolder = false) {
    this.key = key;
    this.isFolder = isFolder;
    this.value = value;
    this.parent = parent.key;
    // this.parent = parent;
    this.children = [];
  }

  get isLeaf() {
    return this.children.length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}

class Tree {
  constructor(key, value = key, isFolder = false, data = null) {
    this.root = new TreeNode(key, value, isFolder);

    if (data != null) {
      this.fillNode(this.root, data.root.children);
    }
  }

  fillNode(parentNode, childrenNodes) {
    // insert children into parentnode
    for (let item in childrenNodes) {
      item = childrenNodes[item];
      var newNode = new TreeNode(
        item.key,
        item.value,
        parentNode,
        item.isFolder
      );
      parentNode.children.push(newNode);
      if (item.children.length > 0) {
        this.fillNode(newNode, item.children);
      }
    }
  }

  *preOrderTraversal(node = this.root) {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(node = this.root) {
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  insert(parentNodeKey, key, value = key, isFolder = false) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(key, value, node, isFolder));
        return true;
      }
    }
    return false;
  }

  remove(key) {
    for (let node of this.preOrderTraversal()) {
      const filtered = node.children.filter((c) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
}

function deepCopyTree(tree) {
  let copy = structuredClone(tree);
  let newTree = new Tree("root", "root", true, copy);
  return newTree;
}

export { Tree, TreeNode, deepCopyTree };
