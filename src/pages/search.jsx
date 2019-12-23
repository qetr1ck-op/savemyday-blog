import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Fuse from "fuse.js"

const mdPages = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      nodes {
        frontmatter {
          title
        }
        excerpt(format: PLAIN)
      }
    }
  }
`
const useSearch = (keys, dataSet) => {
  const options = {
    tokenize: true,
    matchAllTokens: true,
    threshold: 0,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys,
  }

  const fuse = new Fuse(dataSet, options)

  return fuse
}
const SearchPage = () => {
  const data = useStaticQuery(mdPages)
  const [searchQuery, setSearchQuery] = useState("")
  const searchApi = useSearch(
    ["frontmatter.title", "excerpt"],
    data.allMarkdownRemark.nodes
  )

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={e => {
          setSearchQuery(e.target.value)
        }}
      />
      <div>{JSON.stringify(searchApi.search(searchQuery))}</div>
    </div>
  )
}

export default SearchPage
