// write the gatsby config in TypeScript
// https://github.com/gatsbyjs/gatsby/issues/1457
require("source-map-support").install()
require("ts-node").register()

const { createPages, onCreateNode } = require("./gatsby-node-config")

module.exports = {
  createPages,
  onCreateNode,
}
