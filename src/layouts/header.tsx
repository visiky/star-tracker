import React from 'react';

type Props = {
  siteTitle: string;
};

const Header: React.FC<Props> = ({ siteTitle }) => (
  <header>
    <h1 style={{ margin: 0 }}>{siteTitle}</h1>
  </header>
);

export default Header;
