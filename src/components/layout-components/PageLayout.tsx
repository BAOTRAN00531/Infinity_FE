// components/layout-components/PageLayout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from '../Breadcrumbs';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <Breadcrumbs />
            <main>{children}</main>
        </>
    );
};

export default PageLayout;
