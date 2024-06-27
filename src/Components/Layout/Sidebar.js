import React from 'react';
import {
  EuiPageTemplate,
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
  return (
    <EuiPageTemplate offset={offset} grow={grow}>
      {sidebar && (
        <EuiPageTemplate.Sidebar sticky={sidebarSticky}>
          {sidebar}
        </EuiPageTemplate.Sidebar>
      )}
      <EuiPageTemplate.Section grow>
        <MainContent />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};

export default MyPageTemplate;
