import React from "react"
import { Link } from "gatsby"

interface Props {
  excludeItems?: string[]
}

export const defaultNavItems = {
  root: {
    title: "Root",
    path: "/",
  },
  profile: {
    title: "Profile",
    path: "/profile",
  },
  blog: {
    title: "Blog",
    path: "/blog/pages",
  },
  fomo: {
    title: "Fomo",
    path: "/fomo",
  },
}

export const MainNav = ({ excludeItems = [] }: Props) => {
  const navList = Object.values(defaultNavItems).filter(
    ({ title }) => !excludeItems.includes(title)
  )

  return (
    <ul>
      {navList.map(({ title, path }) => (
        <li>
          <Link to={path}>{title}</Link>
        </li>
      ))}
    </ul>
  )
}
