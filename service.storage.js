import entries from './directory-data.js'

const knownPaths = new Set(entries.map((entry) => entry.path))
const knownIds = new Set(entries.map((entry) => entry.id))

function delay() {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * 500))
}

function paginate(items, page, pageSize) {
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const offset = (page - 1) * pageSize

  return {
    data: items.slice(offset, offset + pageSize),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  }
}

/**
 * Returns entries whose parentPath matches the given path.
 *
 * @param {string} path - The directory path to list (e.g. "/projects/alpha/src")
 * @param {{ page?: number, pageSize?: number }} options
 */
export async function getDirectory(path, { page = 1, pageSize = 50 } = {}) {
  await delay()

  if (path !== '/' && !knownPaths.has(path)) {
    throw new Error(`Directory not found: "${path}"`)
  }

  const matches = entries
    .filter((entry) => entry.parentPath === path)

  return paginate(matches, page, pageSize)
}

/**
 * Returns entries whose parentId matches the given GUID.
 *
 * @param {string | null} parentId - The GUID of the parent directory, or null for the root
 * @param {{ page?: number, pageSize?: number }} options
 */
export async function getDirectoryByParentId(parentId, { page = 1, pageSize = 50 } = {}) {
  await delay()

  if (parentId !== null && !knownIds.has(parentId)) {
    throw new Error(`Parent ID not found: "${parentId}"`)
  }

  const matches = entries
    .filter((entry) => entry.parentId === parentId)

  return paginate(matches, page, pageSize)
}
