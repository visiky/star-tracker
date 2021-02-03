import React from 'react';
import { Link } from 'gatsby';

type Props = {
  siteTitle: string;
  githubUrl: string;
};

const Header: React.FC<Props> = ({ siteTitle, githubUrl }) => (
  <header>
    <div style={{ margin: `0 auto`, padding: `1rem 1.0875rem` }}>
      <h1 style={{ margin: 0 }}>
        {siteTitle}
        {githubUrl && (
          <Link
            to={githubUrl}
            style={{ textDecoration: `none` }}
            target="_blank"
          >
            GitHub
          </Link>
        )}
      </h1>
    </div>
  </header>
);

export default Header;
