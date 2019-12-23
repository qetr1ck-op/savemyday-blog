import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { MainNav, defaultNavItems } from "../components/main-nav/main-nav"

export default function Profile() {
  return (
    <Layout>
      <SEO title="Profile" />
      <h1>Profile page</h1>
      <MainNav excludeItems={[defaultNavItems.profile.title]} />
    </Layout>
  )
}
