import React from 'react';
import {
  EuiPageTemplate,EuiTitle
} from '@elastic/eui';
import { Link } from 'react-router-dom';
import MainContent from './MainContent';

const MyPageTemplate = ({
  button = <></>,
  sidebar,
  emptyPrompt = <></>,
  header,
  panelled,
  sidebarSticky,
  offset,
  grow,
}) => {
  const theme = localStorage.getItem("theme")
  return (
    <EuiPageTemplate offset={offset} grow={grow}  className={`${theme == "dark" ? "backkkground":""}`}>
      {sidebar && (
        <EuiPageTemplate.Sidebar sticky={sidebarSticky}>
          {sidebar}
          {/* <EuiTitle size="xs">
        <h3>About Us</h3>
      </EuiTitle> */}
        </EuiPageTemplate.Sidebar>
        
      )}
      
      <EuiPageTemplate.Section grow>
        <MainContent />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};

export default MyPageTemplate;
