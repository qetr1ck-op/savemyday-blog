const path = require(`path`)

const createPokemonPages = async ({ actions }) => {
  console.log(actions)
  const allPokemon = await Promise.resolve([
    { name: "pikachu" },
    { name: "charizard" },
    { name: "squirtle" },
  ])
  // Create a page that lists all Pokémon.
  actions.createPage({
    path: `/all-pokemon`,
    component: require.resolve("./src/templates/all-pokemon.js"),
    context: { allPokemon },
  })
  // Create a page for each Pokémon.
  allPokemon.forEach(pokemon => {
    actions.createPage({
      path: `/pokemon/${pokemon.name}/`,
      component: require.resolve("./src/templates/pokemon.js"),
      context: { pokemon },
    })
  })
}

const createBlogPostPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/pages/blog-template.js`)
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
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: blogPostTemplate,
      context: {}, // additional data can be passed via context
    })
  })
}

exports.createPages = async options => {
  await Promise.all([createPokemonPages(options), createBlogPostPages(options)])
}
