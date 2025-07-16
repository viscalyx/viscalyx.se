/**
 * Remark plugin for processing GitHub-style blockquote types
 * Converts block quotes with [!TYPE] syntax into structured alert elements
 */

// Alert types configuration
const ALERT_TYPES = {
  NOTE: { className: 'github-alert-note', title: 'Note' },
  TIP: { className: 'github-alert-tip', title: 'Tip' },
  IMPORTANT: {
    className: 'github-alert-important',
    title: 'Important',
  },
  WARNING: {
    className: 'github-alert-warning',
    title: 'Warning',
  },
  CAUTION: {
    className: 'github-alert-caution',
    title: 'Caution',
  },
  QUOTE: { className: 'github-alert-quote', title: 'Quote' },
}

/**
 * Processes a blockquote node to transform it into a GitHub alert
 * @param {Object} node - The blockquote node to process
 * @param {string} alertType - The type of alert (NOTE, TIP, etc.)
 * @param {Object} alertConfig - Configuration for the alert type
 */
function transformBlockquoteToAlert(node, alertType, alertConfig) {
  // Transform the blockquote node to have alert classes and data attributes
  node.data = node.data || {}
  node.data.hName = 'div'
  node.data.hProperties = {
    className: ['github-alert', alertConfig.className],
    'data-alert-type': alertType.toLowerCase(),
  }

  // Create title element with data attributes for icon injection
  const titleElement = {
    type: 'paragraph',
    children: [{ type: 'text', value: alertConfig.title }],
    data: {
      hName: 'div',
      hProperties: {
        className: ['github-alert-title'],
        'data-alert-icon': alertType.toLowerCase(),
      },
    },
  }

  // Create content wrapper
  const contentWrapper = {
    type: 'blockquote',
    children: [...node.children],
    data: {
      hName: 'div',
      hProperties: { className: ['github-alert-content'] },
    },
  }

  // Replace children with structured content
  node.children = [titleElement, contentWrapper]
}

/**
 * Checks if a blockquote contains a GitHub alert pattern and processes it
 * @param {Object} node - The blockquote node to check
 * @returns {boolean} - True if the node was processed as an alert
 */
function processGitHubAlert(node) {
  // Check if this blockquote contains a GitHub alert pattern
  const firstChild = node.children[0]
  if (!firstChild || firstChild.type !== 'paragraph') {
    return false
  }

  const firstTextNode = firstChild.children[0]
  if (!firstTextNode || firstTextNode.type !== 'text') {
    return false
  }

  // Check for GitHub alert pattern: [!TYPE]
  const alertMatch = firstTextNode.value.match(
    /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|QUOTE)\]\s*/
  )
  if (!alertMatch) {
    return false
  }

  const alertType = alertMatch[1]
  const alertConfig = ALERT_TYPES[alertType]
  if (!alertConfig) {
    return false
  }

  // Remove the [!TYPE] from the text using the match result
  const remainingText = firstTextNode.value.slice(alertMatch[0].length)

  // Update the text node or remove it if empty
  if (remainingText.trim()) {
    firstTextNode.value = remainingText
  } else {
    // Remove the entire text node if it's now empty
    firstChild.children.shift()
    // If the paragraph is now empty, remove it too
    if (firstChild.children.length === 0) {
      node.children.shift()
    }
  }

  // Transform the blockquote to an alert
  transformBlockquoteToAlert(node, alertType, alertConfig)

  return true
}

/**
 * Remark plugin factory for blockquote types
 * @param {Object} visit - The visit function from unist-util-visit
 * @returns {Function} - The remark plugin function
 */
function remarkBlockquoteTypes(visit) {
  return tree => {
    visit(tree, 'blockquote', node => {
      processGitHubAlert(node)
    })
  }
}

module.exports = remarkBlockquoteTypes
module.exports.ALERT_TYPES = ALERT_TYPES
module.exports.processGitHubAlert = processGitHubAlert
module.exports.transformBlockquoteToAlert = transformBlockquoteToAlert
