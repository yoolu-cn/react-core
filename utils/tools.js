export function findParent(work) {
    if (!work.parent) {
        return;
    }
    return work.parent?.sibling || findParent(work.parent);
}