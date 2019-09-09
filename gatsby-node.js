const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const createPokemonPages = async ({ actions }) => {
  const allPokemon = await Promise.resolve([
    { name: "pikachu" },
    { name: "charizard" },
    { name: "squirtle" },
  ])
  // Create a page that lists all Pokémon.
  actions.createPage({
    path: `/all-pokemon`,
    component: path.resolve("./src/components/templates/all-pokemon.js"),
    context: { allPokemon },
  })
  // Create a page for each Pokémon.
  allPokemon.forEach(pokemon => {
    actions.createPage({
      path: `/pokemon/${pokemon.name}/`,
      component: path.resolve("./src/components/templates/pokemon.js"),
      context: { pokemon },
    })
  })
}

const createBlogListPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostListTemplate = path.resolve(
    `src/components/templates/blog/blog-list.template.jsx`
  )
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
  const blogPostTemplate = path.resolve(
    `src/components/templates/blog/blog.template.jsx`
  )
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
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
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const pages = result.data.allMarkdownRemark.edges

  pages.forEach(({ node }) => {
    createPage({
      path: `blog/page${node.fields.slug}`,
      component: blogPostTemplate,
      context: {},
    })
  })
}

exports.createPages = async options => {
  await Promise.all([
    createPokemonPages(options),
    createBlogListPages(options),
    createBlogPostPages(options),
  ])
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
