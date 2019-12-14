const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const createBlogListPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostListTemplate = path.resolve(`src/components/pages/blog-all.jsx`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const pages = result.data.allMarkdownRemark.edges
  const POSTS_PER_PAGE = 2
  const pagesLength = Math.ceil(pages.length / POSTS_PER_PAGE)

  Array.from({ length: pagesLength }).forEach((_, i) => {
    createPage({
      path: i === 0 ? "blog/pages/" : `blog/pages/${i + 1}`,
      component: blogPostListTemplate,
      context: {
        pagesLength,
        currentPage: i + 1,
        limit: POSTS_PER_PAGE,
        skip: i * POSTS_PER_PAGE,
      },
    })
  })
}

const createBlogPostPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/components/pages/blog-single.jsx`)
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        nodes {
          frontmatter {
            path
            title
            date
          }
          fields {
            slug
          }
        }
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const pages = result.data.allMarkdownRemark.nodes
  const pageRelativePath = "blog"

  pages.forEach(node => {
    createPage({
      path: `${pageRelativePath}/${node.frontmatter.path}`,
      component: blogPostTemplate,
      context: {},
    })
  })
}

// TODO: copy-pasta
const createFomoPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  // TODO: own fomo template
  const blogPostTemplate = path.resolve(`src/components/pages/fomo-single.jsx`)
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
        filter: { fields: { source_type: { eq: "fomo-pages" } } }
      ) {
        nodes {
          frontmatter {
            title
            date
            path
          }
          fields {
            slug
          }
        }
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const pages = result.data.allMarkdownRemark.nodes
  const pageRelativePath = "fomo"

  pages.forEach(node => {
    createPage({
      path: `${pageRelativePath}/${node.frontmatter.path}`,
      component: blogPostTemplate,
      context: {
        slug: node.fields.slug,
      },
    })
  })
}

exports.createPages = async options => {
  await Promise.all([
    createBlogListPages(options),
    createBlogPostPages(options),
    createFomoPages(options),
  ])
}

// https://www.gatsbyjs.org/docs/node-apis/#onCreatePage
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    const parentNode = getNode(node.parent)

    // https://www.gatsbyjs.org/docs/creating-slugs-for-pages
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })

    // https://github.com/gatsbyjs/gatsby/issues/1634#issuecomment-388899348
    createNodeField({
      node,
      name: `source-type`,
      value: parentNode.sourceInstanceName,
    })
  }
}
