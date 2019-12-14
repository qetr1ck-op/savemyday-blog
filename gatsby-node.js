require("source-map-support").install()
require("ts-node").register()

const { createPages, onCreateNode } = require("./gatsby-node-config")

exports.createPages = createPages

exports.onCreateNode = onCreateNode
